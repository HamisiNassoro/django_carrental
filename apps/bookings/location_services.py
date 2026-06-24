from datetime import timedelta

from django.utils import timezone

from .location_serializers import serialize_ping
from .models import Booking, BookingLocationPing, BookingStatus

MIN_PING_INTERVAL_SECONDS = 15
TRAIL_POINT_LIMIT = 100
STALE_LOCATION_MINUTES = 10


def user_can_access_trip_location(user, booking: Booking) -> bool:
    user_pk = user.pkid
    return booking.renter_id == user_pk or booking.car.user_id == user_pk


def user_is_renter(user, booking: Booking) -> bool:
    return booking.renter_id == user.pkid


def booking_allows_location_sharing(booking: Booking) -> bool:
    return booking.status == BookingStatus.ACTIVE


def disable_location_sharing(booking: Booking) -> None:
    if booking.location_sharing_enabled:
        booking.location_sharing_enabled = False
        booking.save(update_fields=["location_sharing_enabled", "updated_at"])


def set_location_sharing(booking: Booking, enabled: bool) -> Booking:
    booking.location_sharing_enabled = enabled
    if enabled and not booking.location_sharing_started_at:
        booking.location_sharing_started_at = timezone.now()
    booking.save(
        update_fields=[
            "location_sharing_enabled",
            "location_sharing_started_at",
            "updated_at",
        ]
    )
    return booking


def too_soon_since_last_ping(booking: Booking) -> bool:
    latest = booking.location_pings.order_by("-recorded_at").first()
    if not latest:
        return False
    elapsed = (timezone.now() - latest.recorded_at).total_seconds()
    return elapsed < MIN_PING_INTERVAL_SECONDS


def create_location_ping(booking: Booking, validated_data: dict) -> BookingLocationPing:
    now = timezone.now()
    return BookingLocationPing.objects.create(
        booking=booking,
        location=validated_data["point"],
        accuracy_m=validated_data.get("accuracy_m"),
        speed_kmh=validated_data.get("speed_kmh"),
        heading=validated_data.get("heading"),
        recorded_at=now,
    )


def build_location_payload(booking: Booking) -> dict:
    latest = booking.location_pings.order_by("-recorded_at").first()
    trail_qs = (
        booking.location_pings.order_by("-recorded_at")[:TRAIL_POINT_LIMIT]
    )
    trail = [serialize_ping(p) for p in reversed(list(trail_qs))]

    stale = True
    stale_minutes = None
    if latest:
        delta = timezone.now() - latest.recorded_at
        stale_minutes = int(delta.total_seconds() // 60)
        stale = delta > timedelta(minutes=STALE_LOCATION_MINUTES)

    return {
        "booking_pkid": booking.pkid,
        "status": booking.status,
        "sharing_enabled": booking.location_sharing_enabled,
        "sharing_started_at": booking.location_sharing_started_at,
        "latest": serialize_ping(latest) if latest else None,
        "trail": trail,
        "is_stale": stale,
        "stale_minutes": stale_minutes,
        "ping_count": booking.location_pings.count(),
    }
