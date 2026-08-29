from django.db.models import Q
from django.utils import timezone
from rest_framework import viewsets

from common.permissions import IsAdminOrReadOnly

from .models import Advertisement
from .serializers import AdvertisementSerializer


class AdvertisementViewSet(viewsets.ModelViewSet):
    """
    list/retrieve: public, but non-staff only ever see ads that are active
    AND currently within their scheduling window (start_date/end_date) - the
    homepage rails/popup have no reason to know about disabled or
    not-yet-live/expired ones.
    create/update/partial_update/destroy: admin only. Staff also see every ad
    (including scheduled-but-not-yet-live ones) so they can manage/preview
    them ahead of time.
    """

    serializer_class = AdvertisementSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.is_staff:
            return Advertisement.objects.all()

        now = timezone.now()
        return Advertisement.objects.filter(is_active=True).filter(
            Q(start_date__isnull=True) | Q(start_date__lte=now)
        ).filter(
            Q(end_date__isnull=True) | Q(end_date__gte=now)
        )
