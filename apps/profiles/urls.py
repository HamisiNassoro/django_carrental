from django.urls import path

from .views import (AgentListAPIView, GetProfileAPIView, TopAgentsListAPIView,
                    UpdateProfileAPIView, RentersListAPIView,CarOwnersListAPIView)

urlpatterns = [
    path("me/", GetProfileAPIView.as_view(), name="get_profile"),
    path("update/<str:username>/", UpdateProfileAPIView.as_view(), name="update_profile"),
    path("agents/all/", AgentListAPIView.as_view(), name="all-agents"),
    path("top-agents/all/", TopAgentsListAPIView.as_view(), name="top-agents"),
    path("renters/all/", RentersListAPIView.as_view(), name="all-renters"),
    path("car-owners/all/", CarOwnersListAPIView.as_view(), name="car-owners"),
]
