from .base import *

# EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"  # Temporarily use console backend
# EMAIL_BACKEND = "djcelery_email.backends.CeleryEmailBackend"  # Temporarily commented out
EMAIL_HOST = env("EMAIL_HOST")
EMAIL_USE_TLS = True
EMAIL_PORT = env("EMAIL_PORT")
EMAIL_HOST_USER = env("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")
DEFAULT_FROM_EMAIL = "info@solo-rider.com"
DOMAIN = env("DOMAIN")
SITE_NAME = "Car Hire"


# Use PostgreSQL with PostGIS for development (recommended for location features)
DATABASES = {
    "default": {
        "ENGINE": "django.contrib.gis.db.backends.postgis",
        "NAME": env("POSTGRES_DB", default="carrental"),
        "USER": env("POSTGRES_USER", default="postgres"),
        "PASSWORD": env("POSTGRES_PASSWORD", default=""),
        "HOST": env("PG_HOST", default="localhost"),
        "PORT": env("PG_PORT", default="5432"),
    }
}

CELERY_BROKER_URL = env("CELERY_BROKER", default="redis://localhost:6379/0")
CELERY_RESULT_BACKEND = env("CELERY_BACKEND", default="redis://localhost:6379/1")
CELERY_TIMEZONE = "Africa/Nairobi"

# GeoDjango (macOS/Homebrew): allow overriding library paths via env
GDAL_LIBRARY_PATH = env("GDAL_LIBRARY_PATH", default=None)
GEOS_LIBRARY_PATH = env("GEOS_LIBRARY_PATH", default=None)

# CORS settings
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# Dev-friendly auth: skip email activation so register/login works immediately
DJOSER["SEND_ACTIVATION_EMAIL"] = False
DJOSER["SEND_CONFIRMATION_EMAIL"] = False