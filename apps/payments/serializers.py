from decimal import Decimal

from django.conf import settings
from rest_framework import serializers

from .models import Transaction


class InitiatePaymentSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)

    def validate_phone_number(self, value):
        digits = "".join(ch for ch in value if ch.isdigit())
        if len(digits) < 9:
            raise serializers.ValidationError("Enter a valid M-Pesa phone number")
        return value


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            "pkid",
            "id",
            "booking",
            "amount",
            "platform_fee",
            "owner_payout",
            "currency",
            "phone_number",
            "provider",
            "status",
            "owner_payout_status",
            "mpesa_receipt_number",
            "failure_reason",
            "owner_payout_phone",
            "owner_payout_mpesa_receipt",
            "owner_payout_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


def calculate_fees(total_price: Decimal) -> tuple[Decimal, Decimal]:
    rate = Decimal(str(getattr(settings, "PLATFORM_COMMISSION_RATE", "0.10")))
    platform_fee = (total_price * rate).quantize(Decimal("0.01"))
    owner_payout = (total_price - platform_fee).quantize(Decimal("0.01"))
    return platform_fee, owner_payout
