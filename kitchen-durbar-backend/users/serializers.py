from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone', 'is_staff', 'is_active', 'role', 'date_joined']
        read_only_fields = ['id', 'is_staff', 'is_active', 'role', 'date_joined']


class UserAdminUpdateSerializer(serializers.ModelSerializer):
    """Admin-only: promote/demote staff role and activate/deactivate an account."""

    class Meta:
        model = User
        fields = ['is_staff', 'is_active']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone', 'password']

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('This email is already registered.')
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Adds the serialized user to the login response, alongside the JWT pair."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['is_staff'] = user.is_staff
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data


class GoogleLoginSerializer(serializers.Serializer):
    """Input shape for POST /api/v1/google - the ID token from Google Identity Services."""

    credential = serializers.CharField()
