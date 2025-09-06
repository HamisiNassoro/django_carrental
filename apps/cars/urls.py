from django.urls import path

from . import views

urlpatterns = [
    path("all/", views.ListAllCarsAPIView.as_view(), name="all-cars"),
    path("agents/", views.ListAgentsCarsAPIView.as_view(), name="agent-cars"),
    path("create/", views.create_car_api_view, name="car-create"),
    path("details/<slug:slug>/", views.CarDetailView.as_view(), name="car-details"),
    path("search/", views.CarSearchAPIView.as_view(), name="car-search"),
    path("advanced-search/", views.AdvancedCarSearchAPIView.as_view(), name="advanced-car-search"),
    path("update/<slug:slug>/", views.update_car_api_view, name="update-car"),
    path("delete/<slug:slug>/", views.delete_car_api_view, name="delete-car"),
    path("upload-image/<slug:slug>/", views.uploadCarImage, name="upload-image"),
    path("views/<slug:slug>/", views.CarViewsAPIView.as_view(), name="car-views"),
    
    # New location-based endpoints
    path("nearby/", views.NearbyCarsAPIView.as_view(), name="nearby-cars"),
    path("location/update/<slug:slug>/", views.UpdateCarLocationAPIView.as_view(), name="update-car-location"),
]
