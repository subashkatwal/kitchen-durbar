from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenRefreshView

from users.views import EmailTokenObtainPairView, GoogleLoginView, MeView, RegisterView

# All API routes live under /api/v1 with no trailing slash (e.g. /api/v1/login,
# /api/v1/products/<id>). Django's own /admin/ site keeps its own conventions -
# it isn't part of this API surface.
urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth
    path('api/v1/register', RegisterView.as_view(), name='auth-register'),
    path('api/v1/login', EmailTokenObtainPairView.as_view(), name='auth-login'),
    path('api/v1/refresh', TokenRefreshView.as_view(), name='auth-refresh'),
    path('api/v1/google', GoogleLoginView.as_view(), name='auth-google'),
    path('api/v1/me', MeView.as_view(), name='auth-me'),

    # Users / Products / Orders (DRF routers, trailing_slash=False)
    path('api/v1/', include('users.urls')),
    path('api/v1/', include('products.urls')),
    path('api/v1/', include('orders.urls')),

    # API docs
    path('api/v1/schema', SpectacularAPIView.as_view(), name='schema'),
    path('api/v1/docs', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
