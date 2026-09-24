from rest_framework.routers import DefaultRouter

from .views import TeamMemberViewSet

router = DefaultRouter(trailing_slash=False)
router.register('team', TeamMemberViewSet, basename='team')

urlpatterns = router.urls
