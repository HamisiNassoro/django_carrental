from django.urls import path

from . import views

urlpatterns = [
    path(
        "bookings/<int:pkid>/pay/",
        views.initiate_booking_payment,
        name="booking-pay",
    ),
    path(
        "bookings/<int:pkid>/status/",
        views.booking_payment_status,
        name="booking-payment-status",
    ),
    path("mpesa/callback/", views.mpesa_callback, name="mpesa-callback"),
]
