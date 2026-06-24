from django.contrib.gis.geos import Point
from django.utils import timezone
from rest_framework import serializers

from .models import Booking, BookingLocationPing


class LocationPingCreateSerializer(serializers.Serializer):
    latitude = serializers.FloatField(min_value=-90, max_value=90)
    longitude = serializers.FloatField(min_value=-180, max_value=180)
    accuracy_m = serializers.FloatField(required=False, allow_null=True, min_value=0)
    speed_kmh = serializers.FloatField(required=False, allow_null=True, min_value=0)
    heading = serializers.FloatField(required=False, allow_null=True, min_value=0, max_value=360)

    def validate(self, attrs):
        attrs["point"] = Point(
            float(attrs["longitude"]),
            float(attrs["latitude"]),
            srid=4326,
        )
        return attrs


class LocationSharingSerializer(serializers.Serializer):
    enabled = serializers.BooleanField()


def serialize_ping(ping: BookingLocationPing) -> dict:
    return {
        "latitude": ping.location.y,
        "longitude": ping.location.x,
        "accuracy_m": ping.accuracy_m,
        "speed_kmh": ping.speed_kmh,
        "heading": ping.heading,
        "recorded_at": ping.recorded_at,
        "source": ping.source,
    }
