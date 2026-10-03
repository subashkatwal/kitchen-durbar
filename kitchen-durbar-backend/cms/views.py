from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from common.permissions import IsAdminOrReadOnly

from .models import Project, SiteImage, Solution, Testimonial
from .serializers import (
    ProjectSerializer,
    PublicFeedbackSerializer,
    SiteImageSerializer,
    SolutionSerializer,
    TestimonialSerializer,
)


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


class FeedbackCreateThrottle(AnonRateThrottle):
    """Feedback submission is public - cap it per IP so it can't be spammed."""

    scope = 'feedback_create'
    rate = '10/hour'


class TestimonialViewSet(ActiveForPublicMixin, viewsets.ModelViewSet):
    """
    Mounted at /api/v1/testimonials. Public read, admin write - except
    create, which anyone may call to leave feedback from the Projects page.
    A visitor's submission is saved hidden until an admin makes it visible.
    """

    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = []

    def _is_staff(self):
        user = self.request.user
        return bool(user and user.is_authenticated and user.is_staff)

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return super().get_permissions()

    def get_throttles(self):
        if self.action == 'create' and not self._is_staff():
            return [FeedbackCreateThrottle()]
        return super().get_throttles()

    def get_serializer_class(self):
        if self.action == 'create' and not self._is_staff():
            return PublicFeedbackSerializer
        return TestimonialSerializer

    def perform_create(self, serializer):
        if self._is_staff():
            serializer.save()
        else:
            serializer.save(is_active=False)


class SolutionViewSet(ActiveForPublicMixin, viewsets.ModelViewSet):
    """Mounted at /api/v1/solutions. Public read, admin write."""

    queryset = Solution.objects.all()
    serializer_class = SolutionSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = []
