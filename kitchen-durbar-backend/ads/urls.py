from rest_framework.routers import DefaultRouter

from .views import AdvertisementViewSet

router = DefaultRouter(trailing_slash=False)
router.register('ads', AdvertisementViewSet, basename='ad')

urlpatterns = router.urls
