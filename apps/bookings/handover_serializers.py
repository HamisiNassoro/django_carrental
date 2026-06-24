from rest_framework import serializers

from .models import Booking


class TripHandoverSerializer(serializers.Serializer):
    mileage = serializers.IntegerField(min_value=0, required=True)
    notes = serializers.CharField(required=False, allow_blank=True, max_length=2000)
    photo = serializers.ImageField(required=False, allow_null=True)

    def validate_mileage(self, value):
        if value < 0:
            raise serializers.ValidationError("Mileage cannot be negative.")
        return value


class PickupHandoverSerializer(TripHandoverSerializer):
    pass


class ReturnHandoverSerializer(TripHandoverSerializer):
    def validate_mileage(self, value):
        booking = self.context.get("booking")
        if booking and booking.pickup_mileage is not None and value < booking.pickup_mileage:
            raise serializers.ValidationError(
                "Return mileage cannot be less than pickup mileage."
            )
        return super().validate_mileage(value)
