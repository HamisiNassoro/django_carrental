from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.common.models import TimeStampedUUIDModel
from apps.cars.models import Car


class BookingStatus(models.TextChoices):
    PENDING = "PENDING", _("Pending")
    APPROVED = "APPROVED", _("Approved")
    DECLINED = "DECLINED", _("Declined")
    CANCELLED = "CANCELLED", _("Cancelled")


class Booking(TimeStampedUUIDModel):
    car = models.ForeignKey(Car, related_name="bookings", on_delete=models.CASCADE)
    renter = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="bookings", on_delete=models.CASCADE
    )
    start_date = models.DateField()
    end_date = models.DateField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(
        max_length=20, choices=BookingStatus.choices, default=BookingStatus.PENDING
    )
    notes = models.TextField(blank=True, null=True)

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
