from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from apps.cars.models import Car
from .models import Booking, BookingStatus
from .serializers import BookingDetailSerializer, BookingSerializer


class IsAuthenticatedOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in ("GET",):
            return True
        return bool(request.user and request.user.is_authenticated)


class BookingCreateAPIView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookingSerializer


class MyBookingsListAPIView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookingDetailSerializer

    def get_queryset(self):
        return Booking.objects.filter(renter=self.request.user).select_related("car")


class OwnerBookingsListAPIView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookingDetailSerializer

    def get_queryset(self):
        return Booking.objects.filter(car__user=self.request.user).select_related("car")


class BookingDetailAPIView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookingDetailSerializer
    lookup_field = "pkid"

    def get_queryset(self):
        return Booking.objects.filter(
            renter=self.request.user
        ) | Booking.objects.filter(car__user=self.request.user)


@api_view(["PATCH"])  # approve
@permission_classes([permissions.IsAuthenticated])
def approve_booking(request, pkid):
    try:
        booking = Booking.objects.select_related("car").get(pkid=pkid, car__user=request.user)
    except Booking.DoesNotExist:
        return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    if booking.status != BookingStatus.PENDING:
        return Response({"detail": "Only pending bookings can be approved"}, status=status.HTTP_400_BAD_REQUEST)
    booking.status = BookingStatus.APPROVED
    booking.save(update_fields=["status"])
    return Response({"status": booking.status})


@api_view(["PATCH"])  # decline
@permission_classes([permissions.IsAuthenticated])
def decline_booking(request, pkid):
    try:
        booking = Booking.objects.select_related("car").get(pkid=pkid, car__user=request.user)
    except Booking.DoesNotExist:
        return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    if booking.status != BookingStatus.PENDING:
        return Response({"detail": "Only pending bookings can be declined"}, status=status.HTTP_400_BAD_REQUEST)
    booking.status = BookingStatus.DECLINED
    booking.save(update_fields=["status"])
    return Response({"status": booking.status})


@api_view(["PATCH"])  # cancel by renter
@permission_classes([permissions.IsAuthenticated])
def cancel_booking(request, pkid):
    try:
        booking = Booking.objects.get(pkid=pkid, renter=request.user)
    except Booking.DoesNotExist:
        return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    if booking.status not in [BookingStatus.PENDING, BookingStatus.APPROVED]:
        return Response({"detail": "Cannot cancel this booking"}, status=status.HTTP_400_BAD_REQUEST)
    booking.status = BookingStatus.CANCELLED
    booking.save(update_fields=["status"])
    return Response({"status": booking.status})
