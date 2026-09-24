from rest_framework.routers import DefaultRouter

from .views import EnquiryViewSet

router = DefaultRouter(trailing_slash=False)
router.register('enquiries', EnquiryViewSet, basename='enquiry')

urlpatterns = router.urls
