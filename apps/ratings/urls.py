from django.urls import path

from . import views

urlpatterns = [
    path(
        "bookings/<int:booking_pkid>/",
        views.create_booking_review,
        name="create-booking-review",
    ),
    path(
        "owners/<uuid:profile_id>/",
        views.list_owner_reviews,
        name="list-owner-reviews",
    ),
]
