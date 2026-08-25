from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenRefreshView

from users.views import (
    EmailTokenObtainPairView,
    GoogleLoginView,
    MeView,
    PasswordResetConfirmView,
    RegisterView,
    RequestOTPView,
    VerifyOTPView,
)

# All API routes live under /api/v1 with no trailing slash (e.g. /api/v1/login,
# /api/v1/products/<id>). Django's own admin site keeps its own conventions and
# lives at /django-admin/ (not /admin/) so it never collides with the React
# app's own /admin dashboard route - see nginx.conf and vite.config.ts.
urlpatterns = [
    path('django-admin/', admin.site.urls),

    # Auth
    path('api/v1/register', RegisterView.as_view(), name='auth-register'),
    path('api/v1/login', EmailTokenObtainPairView.as_view(), name='auth-login'),
    path('api/v1/refresh', TokenRefreshView.as_view(), name='auth-refresh'),
    path('api/v1/google', GoogleLoginView.as_view(), name='auth-google'),
    path('api/v1/me', MeView.as_view(), name='auth-me'),

    # Email OTP - signup verification and forgot-password
    path('api/v1/otp/request', RequestOTPView.as_view(), name='otp-request'),
    path('api/v1/otp/verify', VerifyOTPView.as_view(), name='otp-verify'),
    path('api/v1/password-reset/confirm', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),

    # Users / Products / Orders (DRF routers, trailing_slash=False)
    path('api/v1/', include('users.urls')),
    path('api/v1/', include('products.urls')),
    path('api/v1/', include('orders.urls')),

    # API docs
    path('api/v1/schema', SpectacularAPIView.as_view(), name='schema'),
    path('api/v1/docs', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # Uploaded product images. Served by Django itself (not whitenoise - that's
    # collectstatic-only) since there's no nginx in front of the backend
    # container in either deploy target. Fine at this traffic volume; swap for
    # whitenoise/S3/a CDN if that ever changes.
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]
