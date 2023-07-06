from rest_framework import serializers

from .models import Rating


class RatingSerializer(serializers.ModelSerializer):
    rater = serializers.SerializerMethodField(read_only=True)
    car_owner = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Rating
        exclude = ["updated_at", "pkid"]

    #### Since i said rater and car_owner are method fields , define as below:

    def get_rater(self, obj):
        return obj.rater.username

    def get_car_owner(self, obj):
        return obj.car_owner.user.username
