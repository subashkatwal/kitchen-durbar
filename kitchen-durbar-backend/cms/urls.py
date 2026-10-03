from rest_framework.routers import DefaultRouter

from .views import ProjectViewSet, SiteImageViewSet, SolutionViewSet, TestimonialViewSet

router = DefaultRouter(trailing_slash=False)
router.register('site-images', SiteImageViewSet, basename='site-image')
router.register('projects', ProjectViewSet, basename='project')
router.register('testimonials', TestimonialViewSet, basename='testimonial')
router.register('solutions', SolutionViewSet, basename='solution')

urlpatterns = router.urls
