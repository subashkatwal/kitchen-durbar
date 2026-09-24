from rest_framework.routers import DefaultRouter

from .views import ProjectViewSet, SiteImageViewSet, TestimonialViewSet

router = DefaultRouter(trailing_slash=False)
router.register('site-images', SiteImageViewSet, basename='site-image')
router.register('projects', ProjectViewSet, basename='project')
router.register('testimonials', TestimonialViewSet, basename='testimonial')

urlpatterns = router.urls
