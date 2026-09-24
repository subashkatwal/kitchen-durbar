from rest_framework import viewsets

from common.permissions import IsAdminOrReadOnly

from .models import TeamMember
from .serializers import TeamMemberSerializer


class TeamMemberViewSet(viewsets.ModelViewSet):
    """
    list/retrieve: public, but non-staff only see active members - the
    storefront's "Our team" section has no reason to know about hidden ones.
    create/update/partial_update/destroy: admin only. Staff also see hidden
    members so they can manage them from the admin panel.
    """

    serializer_class = TeamMemberSerializer
    permission_classes = [IsAdminOrReadOnly]
    # Explicit ordering only - the storefront relies on display_order, so
    # don't let the global OrderingFilter/SearchFilter backends reshuffle it.
    filter_backends = []

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.is_staff:
            return TeamMember.objects.all()
        return TeamMember.objects.filter(is_active=True)
