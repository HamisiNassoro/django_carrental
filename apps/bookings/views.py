from datetime import date

from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from apps.payments.models import OwnerPayoutStatus, Transaction, TransactionStatus
from .models import Booking, BookingStatus
from .serializers import BookingDetailSerializer, BookingSerializer


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


@api_view(["PATCH"])
@permission_classes([permissions.IsAuthenticated])
def approve_booking(request, pkid):
    try:
        booking = Booking.objects.select_related("car").get(pkid=pkid, car__user=request.user)
    except Booking.DoesNotExist:
        return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    if booking.status != BookingStatus.PENDING:
        return Response(
            {"detail": "Only pending bookings can be approved"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    booking.status = BookingStatus.AWAITING_PAYMENT
    booking.save(update_fields=["status"])
    return Response(
        {
            "status": booking.status,
            "message": "Booking approved. Renter will be prompted to pay via M-Pesa.",
        }
    )


@api_view(["PATCH"])
@permission_classes([permissions.IsAuthenticated])
def decline_booking(request, pkid):
    try:
        booking = Booking.objects.select_related("car").get(pkid=pkid, car__user=request.user)
    except Booking.DoesNotExist:
        return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    if booking.status != BookingStatus.PENDING:
        return Response(
            {"detail": "Only pending bookings can be declined"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    booking.status = BookingStatus.DECLINED
    booking.save(update_fields=["status"])
    return Response({"status": booking.status})


@api_view(["PATCH"])
@permission_classes([permissions.IsAuthenticated])
def cancel_booking(request, pkid):
    try:
        booking = Booking.objects.get(pkid=pkid, renter=request.user)
    except Booking.DoesNotExist:
        return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    if booking.status not in [BookingStatus.PENDING, BookingStatus.AWAITING_PAYMENT]:
        return Response(
            {"detail": "Cannot cancel this booking"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    booking.status = BookingStatus.CANCELLED
    booking.save(update_fields=["status"])
    return Response({"status": booking.status})


@api_view(["PATCH"])
@permission_classes([permissions.IsAuthenticated])
def complete_booking(request, pkid):
    try:
        booking = Booking.objects.select_related("car").get(pkid=pkid)
    except Booking.DoesNotExist:
        return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    user = request.user
    if booking.renter_id != user.id and booking.car.user_id != user.id:
        return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

    if booking.status not in [BookingStatus.PAID, BookingStatus.ACTIVE]:
        return Response(
            {"detail": "Only paid or active bookings can be completed"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if booking.end_date > date.today() and booking.renter_id != user.id:
        return Response(
            {"detail": "Trip can be completed after the end date"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    booking.status = BookingStatus.COMPLETED
    booking.save(update_fields=["status"])

    payment_txn = (
        booking.transactions.filter(status=TransactionStatus.COMPLETED)
        .order_by("-created_at")
        .first()
    )
    if payment_txn:
        payment_txn.owner_payout_status = OwnerPayoutStatus.RELEASED
        payment_txn.save(update_fields=["owner_payout_status", "updated_at"])

    return Response(
        {
            "status": booking.status,
            "owner_payout_status": payment_txn.owner_payout_status if payment_txn else None,
            "message": "Trip completed. Owner payout marked for release.",
        }
    )


@api_view(["PATCH"])
@permission_classes([permissions.IsAuthenticated])
def activate_booking(request, pkid):
    """Mark a paid booking as active when the rental period starts."""
    try:
        booking = Booking.objects.select_related("car").get(pkid=pkid)
    except Booking.DoesNotExist:
        return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    if booking.renter_id != request.user.id and booking.car.user_id != request.user.id:
        return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

    if booking.status != BookingStatus.PAID:
        return Response(
            {"detail": "Only paid bookings can be activated"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    booking.status = BookingStatus.ACTIVE
    booking.save(update_fields=["status"])
    return Response({"status": booking.status})
