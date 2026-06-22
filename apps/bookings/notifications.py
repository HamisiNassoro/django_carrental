import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def notify_renter_booking_approved(booking) -> bool:
    """Email renter that their booking was approved and payment is required."""
    renter = booking.renter
    email = getattr(renter, "email", None)
    if not email:
        logger.info("Skipping approval email for booking %s: renter has no email", booking.pkid)
        return False

    site_name = getattr(settings, "SITE_NAME", "Car Rental")
    due_hours = getattr(settings, "PAYMENT_DUE_HOURS", 24)
    frontend_base = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
    pay_by = ""
    if booking.payment_due_at:
        pay_by = booking.payment_due_at.strftime("%d %b %Y %H:%M")

    subject = f"{site_name}: Your booking was approved — pay to confirm"
    message = (
        f"Hi {renter.first_name or renter.username},\n\n"
        f"Good news — the owner approved your booking for {booking.car.title}.\n\n"
        f"Dates: {booking.start_date} to {booking.end_date}\n"
        f"Total: {booking.total_price} {booking.currency}\n"
    )
    if pay_by:
        message += f"Pay by: {pay_by} ({due_hours}h window)\n"
    message += (
        f"\nLog in and pay with M-Pesa:\n{frontend_base}/my-bookings\n\n"
        f"— {site_name}"
    )

    try:
        send_mail(
            subject,
            message,
            getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@carrental.local"),
            [email],
            fail_silently=False,
        )
        return True
    except Exception as exc:
        logger.warning("Failed to send approval email for booking %s: %s", booking.pkid, exc)
        return False
