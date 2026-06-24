from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.common.models import TimeStampedUUIDModel
from apps.cars.models import Car


class BookingStatus(models.TextChoices):
    PENDING = "PENDING", _("Pending")
    AWAITING_PAYMENT = "AWAITING_PAYMENT", _("Awaiting Payment")
    PAID = "PAID", _("Paid")
    ACTIVE = "ACTIVE", _("Active")
    COMPLETED = "COMPLETED", _("Completed")
    APPROVED = "APPROVED", _("Approved")  # legacy; migrated to AWAITING_PAYMENT
    DECLINED = "DECLINED", _("Declined")
    CANCELLED = "CANCELLED", _("Cancelled")


BOOKING_RESERVED_STATUSES = [
    BookingStatus.PENDING,
    BookingStatus.AWAITING_PAYMENT,
    BookingStatus.PAID,
    BookingStatus.ACTIVE,
    BookingStatus.APPROVED,
]


class Booking(TimeStampedUUIDModel):
    car = models.ForeignKey(Car, related_name="bookings", on_delete=models.CASCADE)
    renter = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="bookings", on_delete=models.CASCADE
    )
    start_date = models.DateField()
    end_date = models.DateField()
    total_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default="KES")
    platform_fee = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    owner_payout = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(
        max_length=20, choices=BookingStatus.choices, default=BookingStatus.PENDING
    )
    notes = models.TextField(blank=True, null=True)
    approved_at = models.DateTimeField(blank=True, null=True)
    payment_due_at = models.DateTimeField(blank=True, null=True)
    paid_at = models.DateTimeField(blank=True, null=True)
    activated_at = models.DateTimeField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    pickup_mileage = models.PositiveIntegerField(blank=True, null=True)
    pickup_notes = models.TextField(blank=True)
    pickup_photo = models.ImageField(upload_to="handover/pickup/", blank=True, null=True)
    return_mileage = models.PositiveIntegerField(blank=True, null=True)
    return_notes = models.TextField(blank=True)
    return_photo = models.ImageField(upload_to="handover/return/", blank=True, null=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["car", "start_date", "end_date"]),
            models.Index(fields=["renter", "status"]),
        ]
        constraints = [
            models.CheckConstraint(
                check=models.Q(end_date__gte=models.F("start_date")),
                name="booking_end_after_start",
            )
        ]

    def __str__(self) -> str:
        return f"Booking #{self.pkid} {self.car.title} ({self.start_date} -> {self.end_date})"
