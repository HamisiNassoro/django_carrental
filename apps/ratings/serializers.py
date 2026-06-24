from rest_framework import serializers

from .models import Rating


class RatingSerializer(serializers.ModelSerializer):
    rater_name = serializers.SerializerMethodField()
    car_title = serializers.SerializerMethodField()

    class Meta:
        model = Rating
        fields = [
            "id",
            "rating",
            "comment",
            "created_at",
            "rater_name",
            "car_title",
        ]

    def get_rater_name(self, obj):
        if not obj.rater:
            return "Anonymous"
        first = (obj.rater.first_name or "").strip()
        if first:
            return f"{first[0].upper()}."
        return obj.rater.username[:1].upper() + "."

    def get_car_title(self, obj):
        if obj.booking_id and obj.booking:
            return obj.booking.car.title
        return None


class CreateBookingReviewSerializer(serializers.Serializer):
    rating = serializers.ChoiceField(choices=Rating.Range.choices)
    comment = serializers.CharField(required=False, allow_blank=True, max_length=2000)
