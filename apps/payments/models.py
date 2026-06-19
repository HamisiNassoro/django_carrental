from decimal import Decimal

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.common.models import TimeStampedUUIDModel


class PaymentProvider(models.TextChoices):
    MPESA = "MPESA", _("M-Pesa")
    MOCK = "MOCK", _("Mock (development)")


class TransactionStatus(models.TextChoices):
    PENDING = "PENDING", _("Pending")
    PROCESSING = "PROCESSING", _("Processing")
    COMPLETED = "COMPLETED", _("Completed")
    FAILED = "FAILED", _("Failed")


class OwnerPayoutStatus(models.TextChoices):
    PENDING = "PENDING", _("Pending")
    RELEASED = "RELEASED", _("Released")


class Transaction(TimeStampedUUIDModel):
    booking = models.ForeignKey(
        "bookings.Booking",
        related_name="transactions",
        on_delete=models.CASCADE,
    )
    renter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="payment_transactions",
        on_delete=models.CASCADE,
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="owner_payout_transactions",
        on_delete=models.CASCADE,
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    platform_fee = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    owner_payout = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default="KES")
    phone_number = models.CharField(max_length=20, blank=True)
    provider = models.CharField(
        max_length=20,
        choices=PaymentProvider.choices,
        default=PaymentProvider.MPESA,
    )
    status = models.CharField(
        max_length=20,
        choices=TransactionStatus.choices,
        default=TransactionStatus.PENDING,
    )
    owner_payout_status = models.CharField(
        max_length=20,
        choices=OwnerPayoutStatus.choices,
        default=OwnerPayoutStatus.PENDING,
    )
    mpesa_checkout_request_id = models.CharField(max_length=100, blank=True)
    mpesa_merchant_request_id = models.CharField(max_length=100, blank=True)
    mpesa_receipt_number = models.CharField(max_length=100, blank=True)
    failure_reason = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Transaction #{self.pkid} {self.amount} {self.currency} ({self.status})"
