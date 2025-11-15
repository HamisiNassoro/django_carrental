"""car_rental URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView
from django.http import JsonResponse


def api_root_v1(request):
    """API root endpoint that returns JSON with all available endpoints"""
    return JsonResponse({
        "name": "Car Rental API",
        "version": "v1",
        "description": "Car Rental backend API for managing cars, bookings, and users",
        "links": {
            "authentication": request.build_absolute_uri("/api/v1/auth/"),
            "cars": request.build_absolute_uri("/api/cars/all/"),
            "bookings": request.build_absolute_uri("/api/bookings/"),
            "users": request.build_absolute_uri("/api/users/"),
            "profiles": request.build_absolute_uri("/api/profile/"),
            "ratings": request.build_absolute_uri("/api/ratings/"),
            "enquiries": request.build_absolute_uri("/api/enquiries/"),
            "admin": request.build_absolute_uri("/admin/"),
        }
    })


urlpatterns = [
    # Landing page
    path('', TemplateView.as_view(template_name='api_index.html'), name='api_landing'),
    
    # API root endpoint (JSON)
    path('api/v1/', api_root_v1, name='api_root_v1'),
    
    # Admin
    path('admin/', admin.site.urls),
    
    # API endpoints
    path("api/v1/auth/", include("djoser.urls")),
    path("api/v1/auth/", include("djoser.urls.jwt")),
    path("api/profile/", include("apps.profiles.urls")),
    path("api/cars/", include("apps.cars.urls")),
    path("api/ratings/", include("apps.ratings.urls")),
    path("api/enquiries/", include("apps.enquiries.urls")),
    path("api/bookings/", include("apps.bookings.urls")),
    path("api/users/", include("apps.users.urls")),
]## + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) ### this is for local use if using docker service on NGINX can be commented out


admin.site.site_header = "Car Rental Admin"
admin.site.site_title = "Car Renatal Admin Portal"
admin.site.index_title = "Welcome to the Car Rental Portal"
