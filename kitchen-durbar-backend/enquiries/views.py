import logging

from django.conf import settings
from django.core.mail import send_mail
from rest_framework import mixins, permissions, viewsets
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from .models import Enquiry
from .serializers import EnquiryAdminUpdateSerializer, EnquirySerializer

logger = logging.getLogger(__name__)


class EnquiryCreateThrottle(AnonRateThrottle):
    """The contact form is public - cap anonymous submissions per IP so it
    can't be used to flood the inbox."""

    scope = 'enquiry_create'
    rate = '10/hour'


def notify_staff(enquiry):
    """Best-effort email to ENQUIRY_NOTIFY_EMAIL (if configured). A mail
    failure must never lose the enquiry itself - it's already saved."""
    recipient = getattr(settings, 'ENQUIRY_NOTIFY_EMAIL', '')
    if not recipient:
        return
    message = (
        f'New enquiry from the Kitchen Durbar website\n\n'
        f'Name: {enquiry.name}\n'
        f'Company: {enquiry.company or "-"}\n'
        f'Phone: {enquiry.phone}\n'
        f'Email: {enquiry.email}\n\n'
        f'{enquiry.message}\n'
    )
    try:
        send_mail(f'New enquiry: {enquiry.name}', message, settings.DEFAULT_FROM_EMAIL, [recipient])
    except Exception:  # noqa: BLE001 - logged, never surfaced to the visitor
        logger.exception('Could not send enquiry notification email')


class EnquiryViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """
    create: public - the storefront contact form (throttled per IP)
    list/retrieve: admin only
    partial_update: admin only, toggles is_handled
    destroy: admin only
    """

    queryset = Enquiry.objects.all()
    filter_backends = []

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_throttles(self):
        if self.action == 'create':
            return [EnquiryCreateThrottle()]
        return super().get_throttles()

    def get_serializer_class(self):
        if self.action in ('update', 'partial_update'):
            return EnquiryAdminUpdateSerializer
        return EnquirySerializer

    def perform_create(self, serializer):
        notify_staff(serializer.save())

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(EnquirySerializer(instance).data)

    def partial_update(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
