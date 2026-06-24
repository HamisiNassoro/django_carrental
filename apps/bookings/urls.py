from django.urls import path

from . import views
from . import location_views

urlpatterns = [
    path("", views.BookingCreateAPIView.as_view(), name="booking-create"),
    path("me/", views.MyBookingsListAPIView.as_view(), name="my-bookings"),
    path("owner/", views.OwnerBookingsListAPIView.as_view(), name="owner-bookings"),
    path("owner/earnings/", views.owner_earnings_summary, name="owner-earnings"),
    path("<int:pkid>/", views.BookingDetailAPIView.as_view(), name="booking-detail"),
    path("<int:pkid>/approve/", views.approve_booking, name="booking-approve"),
    path("<int:pkid>/decline/", views.decline_booking, name="booking-decline"),
    path("<int:pkid>/cancel/", views.cancel_booking, name="booking-cancel"),
    path("<int:pkid>/activate/", views.activate_booking, name="booking-activate"),
    path("<int:pkid>/complete/", views.complete_booking, name="booking-complete"),
    path("<int:pkid>/location/", location_views.booking_trip_location, name="booking-trip-location"),
    path("<int:pkid>/location/ping/", location_views.booking_location_ping, name="booking-location-ping"),
    path("<int:pkid>/location/sharing/", location_views.booking_location_sharing, name="booking-location-sharing"),
]
