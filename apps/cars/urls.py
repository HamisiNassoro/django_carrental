from django.urls import path

from . import views

urlpatterns = [
    path("all/", views.ListAllCarsAPIView.as_view(), name="all-cars"),
    path(
        "agents/", views.ListAgentsCarsAPIView.as_view(), name="agent-cars"
    ),
    path("create/", views.create_car_api_view, name="car-create"),
    path(
        "details/<slug:slug>/",
        views.CarDetailView.as_view(),
        name="car-details",
    ),
    path("update/<slug:slug>/", views.update_car_api_view, name="update-car"),
    path("delete/<slug:slug>/", views.delete_car_api_view, name="delete-car"),
    path("search/", views.CarSearchAPIView.as_view(), name="car-search"),
]
