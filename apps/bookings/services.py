import logging

from django.conf import settings
from django.utils import timezone

from .models import Booking, BookingStatus

logger = logging.getLogger(__name__)


def expire_overdue_bookings() -> int:
    """Cancel bookings that were approved but not paid before the deadline."""
    now = timezone.now()
    overdue = Booking.objects.filter(
        status=BookingStatus.AWAITING_PAYMENT,
        payment_due_at__isnull=False,
        payment_due_at__lt=now,
    )
    count = overdue.count()
    if count:
        overdue.update(status=BookingStatus.CANCELLED, updated_at=now)
        logger.info("Cancelled %s overdue unpaid booking(s)", count)
    return count
