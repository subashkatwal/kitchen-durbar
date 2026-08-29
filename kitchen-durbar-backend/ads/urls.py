from rest_framework.routers import DefaultRouter

from .views import AdvertisementViewSet

router = DefaultRouter(trailing_slash=False)
# URL prefix is "promotions", not "ads" - ad-blocker extensions generically
# block requests whose path contains "/ads" (ERR_BLOCKED_BY_CLIENT),
# regardless of who's actually serving them. basename stays 'ad' - it only
# affects internal reverse-URL names, not anything network-visible.
router.register('promotions', AdvertisementViewSet, basename='ad')

urlpatterns = router.urls
