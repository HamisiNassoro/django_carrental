from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .location_serializers import (
    LocationPingCreateSerializer,
    LocationSharingSerializer,
    serialize_ping,
)
from .location_services import (
    booking_allows_location_sharing,
    build_location_payload,
    create_location_ping,
    disable_location_sharing,
    set_location_sharing,
    too_soon_since_last_ping,
    user_can_access_trip_location,
    user_is_renter,
)
from .models import Booking


def _get_booking(pkid):
    return get_object_or_404(
        Booking.objects.select_related("car", "renter"),
        pkid=pkid,
    )


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def booking_trip_location(request, pkid):
    """Latest vehicle location and trail for an active rental."""
    booking = _get_booking(pkid)

    if not user_can_access_trip_location(request.user, booking):
        return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

    if not booking_allows_location_sharing(booking):
        return Response(
            {"detail": "Location is only available during an active rental"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    return Response(build_location_payload(booking))


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def booking_location_ping(request, pkid):
    """Renter sends a GPS ping while location sharing is enabled."""
    booking = _get_booking(pkid)

    if not user_is_renter(request.user, booking):
        return Response(
            {"detail": "Only the renter can share trip location"},
            status=status.HTTP_403_FORBIDDEN,
        )

    if not booking_allows_location_sharing(booking):
        return Response(
            {"detail": "Location sharing is only allowed during an active rental"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not booking.location_sharing_enabled:
        return Response(
            {"detail": "Enable location sharing for this trip first"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if too_soon_since_last_ping(booking):
        latest = booking.location_pings.order_by("-recorded_at").first()
        return Response(
            {
                "message": "Ping recorded recently",
                "latest": serialize_ping(latest) if latest else None,
            },
            status=status.HTTP_200_OK,
        )

    serializer = LocationPingCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    ping = create_location_ping(booking, serializer.validated_data)

    return Response(
        {
            "message": "Location updated",
            "ping": serialize_ping(ping),
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["PATCH"])
@permission_classes([permissions.IsAuthenticated])
def booking_location_sharing(request, pkid):
    """Renter opts in or out of sharing location during the active rental."""
    booking = _get_booking(pkid)

    if not user_is_renter(request.user, booking):
        return Response(
            {"detail": "Only the renter can control location sharing"},
            status=status.HTTP_403_FORBIDDEN,
        )

    if not booking_allows_location_sharing(booking):
        return Response(
            {"detail": "Location sharing is only available during an active rental"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    serializer = LocationSharingSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    enabled = serializer.validated_data["enabled"]

    if enabled:
        set_location_sharing(booking, True)
        message = "Location sharing enabled for this trip"
    else:
        disable_location_sharing(booking)
        message = "Location sharing stopped"

    booking.refresh_from_db()
    return Response(
        {
            "message": message,
            "sharing_enabled": booking.location_sharing_enabled,
            "sharing_started_at": booking.location_sharing_started_at,
        }
    )
