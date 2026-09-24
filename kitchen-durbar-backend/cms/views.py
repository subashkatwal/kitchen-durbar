from rest_framework import status, viewsets
from rest_framework.response import Response

from common.permissions import IsAdminOrReadOnly

from .models import Project, SiteImage, Testimonial
from .serializers import ProjectSerializer, SiteImageSerializer, TestimonialSerializer


class SiteImageViewSet(viewsets.ModelViewSet):
    """
    Mounted at /api/v1/site-images, addressed by slot key rather than id
    (e.g. PATCH /site-images/home_hero).

    list/retrieve: public - the storefront reads every override in one call.
    create: admin only; an upsert - posting a key that already has an image
      replaces that image instead of failing on the unique constraint.
    destroy: admin only; the slot reverts to the frontend's default photo.
    """

    queryset = SiteImage.objects.all()
    serializer_class = SiteImageSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'key'
    filter_backends = []
    pagination_class = None

    def create(self, request, *args, **kwargs):
        existing = SiteImage.objects.filter(key=request.data.get('key')).first()
        serializer = self.get_serializer(existing, data=request.data, partial=existing is not None)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK if existing else status.HTTP_201_CREATED)


class ActiveForPublicMixin:
    """Public readers only see is_active rows; staff see everything so hidden
    items can still be managed from the admin panel."""

    def get_queryset(self):
        qs = self.queryset.all()
        user = self.request.user
        if user.is_authenticated and user.is_staff:
            return qs
        return qs.filter(is_active=True)


class ProjectViewSet(ActiveForPublicMixin, viewsets.ModelViewSet):
    """Mounted at /api/v1/projects. Public read, admin write."""

    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = []


class TestimonialViewSet(ActiveForPublicMixin, viewsets.ModelViewSet):
    """Mounted at /api/v1/testimonials. Public read, admin write."""

    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = []
