from datetime import timedelta

from django.db.models import Q
from rest_framework import serializers

from apps.cars.models import Car
from apps.cars.serializers import CarSerializer
from .models import Booking, BookingStatus


class BookingSerializer(serializers.ModelSerializer):
    car = serializers.SlugRelatedField(slug_field="slug", queryset=Car.objects.all())
    renter = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Booking
        fields = [
            "id",
            "car",
            "renter",
            "start_date",
            "end_date",
            "total_price",
            "status",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["status", "total_price", "created_at", "updated_at"]

    def validate(self, attrs):
        car = attrs.get("car")
        start_date = attrs.get("start_date")
        end_date = attrs.get("end_date")

        if start_date > end_date:
            raise serializers.ValidationError("start_date must be before or equal to end_date")

        # Disallow owner booking own car
        if car.user == self.context["request"].user:
            raise serializers.ValidationError("You cannot book your own car")

        # Overlap check
        overlap = Booking.objects.filter(
            car=car,
            status__in=[BookingStatus.PENDING, BookingStatus.APPROVED],
        ).filter(
            Q(start_date__lte=end_date) & Q(end_date__gte=start_date)
        ).exists()
        if overlap:
            raise serializers.ValidationError("Selected dates are not available for this car")
        return attrs

    def create(self, validated_data):
        car = validated_data["car"]
        start_date = validated_data["start_date"]
        end_date = validated_data["end_date"]

        num_days = (end_date - start_date).days + 1
        validated_data["total_price"] = float(car.price) * max(num_days, 1)
        booking = super().create(validated_data)
        return booking


class BookingDetailSerializer(BookingSerializer):
    car_detail = CarSerializer(source="car", read_only=True)

    class Meta(BookingSerializer.Meta):
        fields = BookingSerializer.Meta.fields + ["car_detail"]
