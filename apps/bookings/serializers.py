from decimal import Decimal

from django.db.models import Q
from rest_framework import serializers

from apps.cars.models import Car
from apps.cars.serializers import CarSerializer
from apps.common.currency import currency_for_country
from apps.payments.serializers import calculate_fees
from .models import Booking, BookingStatus, BOOKING_RESERVED_STATUSES


class BookingSerializer(serializers.ModelSerializer):
    car = serializers.SlugRelatedField(slug_field="slug", queryset=Car.objects.all())
    renter = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Booking
        fields = [
            "pkid",
            "id",
            "car",
            "renter",
            "start_date",
            "end_date",
            "total_price",
            "currency",
            "platform_fee",
            "owner_payout",
            "status",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "status",
            "total_price",
            "currency",
            "platform_fee",
            "owner_payout",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        car = attrs.get("car")
        start_date = attrs.get("start_date")
        end_date = attrs.get("end_date")

        if start_date > end_date:
            raise serializers.ValidationError("start_date must be before or equal to end_date")

        if car.user == self.context["request"].user:
            raise serializers.ValidationError("You cannot book your own car")

        overlap = (
            Booking.objects.filter(
                car=car,
                status__in=BOOKING_RESERVED_STATUSES,
            )
            .filter(Q(start_date__lte=end_date) & Q(end_date__gte=start_date))
            .exists()
        )
        if overlap:
            raise serializers.ValidationError("Selected dates are not available for this car")
        return attrs

    def create(self, validated_data):
        car = validated_data["car"]
        start_date = validated_data["start_date"]
        end_date = validated_data["end_date"]

        num_days = (end_date - start_date).days + 1
        total_price = Decimal(str(car.price)) * max(num_days, 1)
        platform_fee, owner_payout = calculate_fees(total_price)

        validated_data["total_price"] = total_price
        validated_data["currency"] = car.currency or currency_for_country(car.country)
        validated_data["platform_fee"] = platform_fee
        validated_data["owner_payout"] = owner_payout
        return super().create(validated_data)


class BookingDetailSerializer(BookingSerializer):
    car_detail = CarSerializer(source="car", read_only=True)
    latest_transaction = serializers.SerializerMethodField()

    class Meta(BookingSerializer.Meta):
        fields = BookingSerializer.Meta.fields + ["car_detail", "latest_transaction"]

    def get_latest_transaction(self, obj):
        transaction = obj.transactions.order_by("-created_at").first()
        if not transaction:
            return None
        return {
            "pkid": transaction.pkid,
            "status": transaction.status,
            "amount": transaction.amount,
            "currency": transaction.currency,
            "platform_fee": transaction.platform_fee,
            "owner_payout": transaction.owner_payout,
            "mpesa_receipt_number": transaction.mpesa_receipt_number,
            "owner_payout_status": transaction.owner_payout_status,
        }
