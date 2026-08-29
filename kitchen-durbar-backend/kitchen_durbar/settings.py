
"""
Django settings for the Kitchen Durbar backend.
"""
from datetime import timedelta
from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()

SECRET_KEY = env('DJANGO_SECRET_KEY', default='django-insecure-change-me-in-.env')
DEBUG = env.bool('DJANGO_DEBUG', default=False)
ALLOWED_HOSTS = env.list(
    'DJANGO_ALLOWED_HOSTS',
    default=['localhost', '127.0.0.1']
)

# Render injects RENDER_EXTERNAL_HOSTNAME into every service automatically.
RENDER_EXTERNAL_HOSTNAME = env('RENDER_EXTERNAL_HOSTNAME', default='')

if RENDER_EXTERNAL_HOSTNAME:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)

# Render terminates TLS at its edge and forwards plain HTTP internally.
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

CSRF_TRUSTED_ORIGINS = env.list('CSRF_TRUSTED_ORIGINS', default=[])

if RENDER_EXTERNAL_HOSTNAME:
    CSRF_TRUSTED_ORIGINS.append(
        f'https://{RENDER_EXTERNAL_HOSTNAME}'
    )


# ---------------------------------------------------------------------------
# Applications
# ---------------------------------------------------------------------------

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',

    # Must load before django.contrib.staticfiles per
    # django-cloudinary-storage documentation.
    'cloudinary_storage',
    'django.contrib.staticfiles',
    'cloudinary',

    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',
    'drf_spectacular',

    'users',
    'products',
    'orders',
    'ads',
]


# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# ---------------------------------------------------------------------------
# Django
# ---------------------------------------------------------------------------

ROOT_URLCONF = 'kitchen_durbar.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'kitchen_durbar.wsgi.application'
ASGI_APPLICATION = 'kitchen_durbar.asgi.application'


# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('POSTGRES_DB', default='kitchendurbar'),
        'USER': env('POSTGRES_USER', default='kitchendurbar'),
        'PASSWORD': env('POSTGRES_PASSWORD', default='kitchendurbar'),
        'HOST': env('POSTGRES_HOST', default='db'),
        'PORT': env('POSTGRES_PORT', default='5432'),
    }
}


# ---------------------------------------------------------------------------
# Authentication
# ---------------------------------------------------------------------------

AUTH_USER_MODEL = 'users.User'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': (
            'django.contrib.auth.password_validation.'
            'UserAttributeSimilarityValidator'
        )
    },
    {
        'NAME': (
            'django.contrib.auth.password_validation.'
            'MinimumLengthValidator'
        ),
        'OPTIONS': {
            'min_length': 6
        }
    },
    {
        'NAME': (
            'django.contrib.auth.password_validation.'
            'CommonPasswordValidator'
        )
    },
    {
        'NAME': (
            'django.contrib.auth.password_validation.'
            'NumericPasswordValidator'
        )
    },
]


# ---------------------------------------------------------------------------
# Internationalization
# ---------------------------------------------------------------------------

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Kathmandu'

USE_I18N = True
USE_TZ = True


# ---------------------------------------------------------------------------
# Static files
# ---------------------------------------------------------------------------

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'


# ---------------------------------------------------------------------------
# Media storage
# ---------------------------------------------------------------------------

CLOUDINARY_CLOUD_NAME = env(
    'CLOUDINARY_CLOUD_NAME',
    default=''
)

CLOUDINARY_API_KEY = env(
    'CLOUDINARY_API_KEY',
    default=''
)

CLOUDINARY_API_SECRET = env(
    'CLOUDINARY_API_SECRET',
    default=''
)

USE_CLOUDINARY_MEDIA = bool(CLOUDINARY_CLOUD_NAME)

if USE_CLOUDINARY_MEDIA:
    CLOUDINARY_STORAGE = {
        'CLOUD_NAME': CLOUDINARY_CLOUD_NAME,
        'API_KEY': CLOUDINARY_API_KEY,
        'API_SECRET': CLOUDINARY_API_SECRET,
    }


# ---------------------------------------------------------------------------
# Storage
# ---------------------------------------------------------------------------

STORAGES = {
    'default': {
        'BACKEND': (
            'cloudinary_storage.storage.MediaCloudinaryStorage'
            if USE_CLOUDINARY_MEDIA
            else 'django.core.files.storage.FileSystemStorage'
        ),
    },

    # Plain, uncompressed static storage - in BOTH environments. Two
    # different WhiteNoise storage classes were tried and failed here before
    # landing on this:
    #
    #   1. CompressedManifestStaticFilesStorage - rewrites url()/
    #      sourceMappingURL references inside CSS to hashed filenames during
    #      collectstatic, which requires resolving every referenced file
    #      (e.g. DRF's bootstrap.min.css -> bootstrap.min.css.map) against
    #      what's already been copied to STATIC_ROOT at that point. That
    #      resolution step intermittently threw "could not be found" even
    #      though the files are real and present in the packages.
    #   2. CompressedStaticFilesStorage (no manifest/hashing) - doesn't parse
    #      CSS, so failure mode #1 is structurally impossible - but it still
    #      gzips every collected file across a ThreadPoolExecutor, and THAT
    #      raced too: worker threads occasionally hit FileNotFoundError
    #      opening a file collectstatic had, per its own accounting, just
    #      finished writing. Reproduced both locally (Windows/Docker Desktop
    #      bind-mount I/O latency) and on Render's filesystem (different
    #      files fail each run, and a retry-without-compression-once fallback
    #      in entrypoint.sh still wasn't reliable) - two unrelated
    #      environments hitting the same shape of bug means the thread pool
    #      itself is the common factor, not either filesystem.
    #
    # Plain StaticFilesStorage does a single-threaded copy with no
    # post-processing step at all, so neither race is possible. WhiteNoise's
    # WSGI middleware (still in MIDDLEWARE) serves these files directly and
    # applies gzip at request time instead of ahead of time - no
    # cache-busting hashed filenames, no precompression, which doesn't matter
    # for the low-traffic admin/DRF browsable API this project actually has.
    'staticfiles': {
        'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage',
    },
}


MEDIA_URL = 'media/'

if not USE_CLOUDINARY_MEDIA:
    MEDIA_ROOT = BASE_DIR / 'media'


# ---------------------------------------------------------------------------
# Default primary key
# ---------------------------------------------------------------------------

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# ---------------------------------------------------------------------------
# Django REST Framework
# ---------------------------------------------------------------------------

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),

    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),

    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ),

    'DEFAULT_SCHEMA_CLASS': (
        'drf_spectacular.openapi.AutoSchema'
    ),
}


# ---------------------------------------------------------------------------
# Simple JWT
# ---------------------------------------------------------------------------

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}


# ---------------------------------------------------------------------------
# API documentation
# ---------------------------------------------------------------------------

SPECTACULAR_SETTINGS = {
    'TITLE': 'Kitchen Durbar API',
    'DESCRIPTION': (
        'REST API for the Kitchen Durbar commercial kitchen appliances '
        'store: auth, products, orders and user management.'
    ),
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}


# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------

CORS_ALLOW_ALL_ORIGINS = env.bool(
    'CORS_ALLOW_ALL_ORIGINS',
    default=False
)

CORS_ALLOWED_ORIGINS = env.list(
    'CORS_ALLOWED_ORIGINS',
    default=[
        'http://localhost:5173',
        'http://localhost',
        'http://127.0.0.1:5173',
    ],
)


# ---------------------------------------------------------------------------
# Google Sign-In
# ---------------------------------------------------------------------------

GOOGLE_CLIENT_ID = env(
    'GOOGLE_CLIENT_ID',
    default=''
)

GOOGLE_CLIENT_SECRET = env(
    'GOOGLE_CLIENT_SECRET',
    default=''
)


# ---------------------------------------------------------------------------
# Email / OTP
# ---------------------------------------------------------------------------

EMAIL_BACKEND = env(
    'EMAIL_BACKEND',
    default='django.core.mail.backends.console.EmailBackend'
)

EMAIL_HOST = env(
    'EMAIL_HOST',
    default='smtp.gmail.com'
)

EMAIL_PORT = env.int(
    'EMAIL_PORT',
    default=587
)

EMAIL_USE_TLS = env.bool(
    'EMAIL_USE_TLS',
    default=True
)

EMAIL_HOST_USER = env(
    'EMAIL_HOST_USER',
    default=''
)

EMAIL_HOST_PASSWORD = env(
    'EMAIL_HOST_PASSWORD',
    default=''
)

DEFAULT_FROM_EMAIL = env(
    'DEFAULT_FROM_EMAIL',
    default='Kitchen Durbar <no-reply@kitchendurbar.com>'
)


# ---------------------------------------------------------------------------
# OTP
# ---------------------------------------------------------------------------

OTP_EXPIRY_MINUTES = env.int(
    'OTP_EXPIRY_MINUTES',
    default=10
)

