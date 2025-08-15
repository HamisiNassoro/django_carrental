from django.urls import path

from . import views

urlpatterns = [
    path("", views.BookingCreateAPIView.as_view(), name="booking-create"),
    path("me/", views.MyBookingsListAPIView.as_view(), name="my-bookings"),
    path("owner/", views.OwnerBookingsListAPIView.as_view(), name="owner-bookings"),
    path("<int:pkid>/", views.BookingDetailAPIView.as_view(), name="booking-detail"),
    path("<int:pkid>/approve/", views.approve_booking, name="booking-approve"),
    path("<int:pkid>/decline/", views.decline_booking, name="booking-decline"),
    path("<int:pkid>/cancel/", views.cancel_booking, name="booking-cancel"),
]
