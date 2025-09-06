from django.urls import path

from . import views

urlpatterns = [
    # ... existing endpoints ...
    
    # New location management endpoints
    path("location/", views.UserLocationAPIView.as_view(), name="user-location"),
    path("location/update/", views.UpdateUserLocationAPIView.as_view(), name="update-user-location"),
    path("location/set/", views.set_user_location, name="set-user-location"),
    path("location/clear/", views.clear_user_location, name="clear-user-location"),
]



