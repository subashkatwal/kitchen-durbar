from datetime import timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
from rest_framework import generics, mixins, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .emails import send_otp_email
from .models import OTP
from .serializers import (
    EmailTokenObtainPairSerializer,
    GoogleLoginSerializer,
    OTPRequestSerializer,
    OTPVerifySerializer,
    PasswordResetConfirmSerializer,
    RegisterSerializer,
    UserAdminUpdateSerializer,
    UserSerializer,
)

User = get_user_model()

OTP_RESEND_COOLDOWN_SECONDS = 60


class RegisterView(generics.CreateAPIView):
    """
    POST /api/v1/register - create an account.

    Deliberately does NOT issue JWTs here: registering only creates the user,
    it does not authenticate them. The client must call /api/v1/login
    afterwards, same as any other credential check.

    Also fires off a signup-verification OTP so the frontend can send the
    user straight to the OTP page after a successful registration.
    """

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        otp = OTP.objects.create(email=user.email, purpose=OTP.Purpose.SIGNUP)
        send_otp_email(user.email, otp.code, OTP.Purpose.SIGNUP)
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class EmailTokenObtainPairView(TokenObtainPairView):
    """POST /api/v1/login - email + password login."""

    serializer_class = EmailTokenObtainPairSerializer


class GoogleLoginView(generics.GenericAPIView):
    """
    POST /api/v1/google - sign in (or sign up) with a Google ID token.

    Body: {"credential": "<Google Identity Services ID token>"}
    Verifies the token server-side against GOOGLE_CLIENT_ID, then finds or
    creates a matching local account by email and issues our own JWT pair -
    same response shape as /api/v1/login.
    """

    serializer_class = GoogleLoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        client_id = settings.GOOGLE_CLIENT_ID
        if not client_id:
            return Response(
                {'detail': 'Google sign-in is not configured on the server yet.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        try:
            idinfo = google_id_token.verify_oauth2_token(
                serializer.validated_data['credential'], google_requests.Request(), client_id
            )
        except ValueError:
            return Response({'detail': 'Invalid or expired Google credential.'}, status=status.HTTP_401_UNAUTHORIZED)

        email = idinfo.get('email')
        if not email or not idinfo.get('email_verified'):
            return Response({'detail': 'Google account email is not verified.'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            full_name = idinfo.get('name') or email.split('@')[0]
            # No usable password: this account can only sign in via Google
            # unless the user later sets one through a password-reset flow.
            user = User.objects.create_user(email=email, full_name=full_name, password=None, is_verified=True)

        if not user.is_active:
            return Response({'detail': 'This account has been deactivated.'}, status=status.HTTP_403_FORBIDDEN)

        # Google already verified this address, whether the account is new or
        # was previously created (and unverified) via email/password signup.
        if not user.is_verified:
            user.is_verified = True
            user.save(update_fields=['is_verified'])

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        )


class MeView(generics.RetrieveAPIView):
    """GET /api/v1/me - the current authenticated user."""

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class RequestOTPView(generics.GenericAPIView):
    """
    POST /api/v1/otp/request {email, purpose: "signup"|"reset"} - emails a
    fresh one-time code. Also used to resend a code.

    "signup": the account must exist and not already be verified.
    "reset": always returns the same generic response whether or not the
      account exists, so this endpoint can't be used to enumerate emails.
    """

    serializer_class = OTPRequestSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email'].strip().lower()
        purpose = serializer.validated_data['purpose']

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            user = None

        if purpose == OTP.Purpose.SIGNUP:
            if user is None:
                return Response({'detail': 'No account found for this email.'}, status=status.HTTP_400_BAD_REQUEST)
            if user.is_verified:
                return Response({'detail': 'This account is already verified.'}, status=status.HTTP_400_BAD_REQUEST)

        generic_response = Response({'detail': 'If an account exists for this email, a code has been sent.'})

        if purpose == OTP.Purpose.RESET and user is None:
            # Don't reveal whether the address is registered.
            return generic_response

        recently_sent = OTP.objects.filter(
            email__iexact=email,
            purpose=purpose,
            created_at__gte=timezone.now() - timedelta(seconds=OTP_RESEND_COOLDOWN_SECONDS),
        ).exists()
        if recently_sent:
            return Response(
                {'detail': 'Please wait a moment before requesting another code.'},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        otp = OTP.objects.create(email=email, purpose=purpose)
        send_otp_email(email, otp.code, purpose)

        return generic_response if purpose == OTP.Purpose.RESET else Response({'detail': 'Verification code sent.'})


class VerifyOTPView(generics.GenericAPIView):
    """
    POST /api/v1/otp/verify {email, code, purpose} - check a one-time code.

    "signup": consumes the code, marks the account verified, and logs the
      user in (same response shape as /api/v1/login).
    "reset": only checks validity here - the code isn't spent until
      /api/v1/password-reset/confirm is called with it, so the OTP page can
      let the user re-check the code before committing to a new password.
    """

    serializer_class = OTPVerifySerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email'].strip().lower()
        code = serializer.validated_data['code']
        purpose = serializer.validated_data['purpose']

        otp = OTP.objects.filter(email__iexact=email, purpose=purpose, code=code).first()
        if not otp or not otp.is_valid():
            return Response({'detail': 'Invalid or expired code.'}, status=status.HTTP_400_BAD_REQUEST)

        if purpose == OTP.Purpose.RESET:
            return Response({'detail': 'Code verified.'})

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({'detail': 'No account found for this email.'}, status=status.HTTP_400_BAD_REQUEST)

        otp.is_used = True
        otp.save(update_fields=['is_used'])
        user.is_verified = True
        user.save(update_fields=['is_verified'])

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        )


class PasswordResetConfirmView(generics.GenericAPIView):
    """POST /api/v1/password-reset/confirm {email, code, new_password} - spend a "reset" code to set a new password."""

    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email'].strip().lower()
        code = serializer.validated_data['code']
        new_password = serializer.validated_data['new_password']

        otp = OTP.objects.filter(email__iexact=email, purpose=OTP.Purpose.RESET, code=code).first()
        if not otp or not otp.is_valid():
            return Response({'detail': 'Invalid or expired code.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({'detail': 'Invalid or expired code.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save(update_fields=['password'])
        otp.is_used = True
        otp.save(update_fields=['is_used'])

        return Response({'detail': 'Password updated. You can now log in.'})


class UserViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """
    Admin-only user management, mounted at /api/v1/users.

    list/retrieve: full user directory
    partial_update: toggle is_staff (role) / is_active (enable/disable) - the
      only fields an admin is allowed to change on someone else's account here
    destroy: remove a user (an admin may not delete their own account)
    """

    queryset = User.objects.all()
    permission_classes = [permissions.IsAdminUser]

    def get_serializer_class(self):
        if self.action in ('update', 'partial_update'):
            return UserAdminUpdateSerializer
        return UserSerializer

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.partial_update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(instance).data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.pk == request.user.pk:
            return Response({'detail': "You can't delete your own account."}, status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(request, *args, **kwargs)
