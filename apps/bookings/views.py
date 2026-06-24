from datetime import date, timedelta
from decimal import Decimal

from django.conf import settings
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from apps.payments.models import OwnerPayoutStatus, Transaction, TransactionStatus
from apps.payments.payouts import release_owner_payout
from .handover_serializers import PickupHandoverSerializer, ReturnHandoverSerializer
from .notifications import notify_renter_booking_approved
from .models import Booking, BookingStatus
from .serializers import BookingDetailSerializer, BookingSerializer
from .services import expire_overdue_bookings


class BookingCreateAPIView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookingSerializer


class OwnerBookingsListAPIView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookingDetailSerializer

    def get_queryset(self):
        expire_overdue_bookings()
        return Booking.objects.filter(car__user=self.request.user).select_related("car")

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class MyBookingsListAPIView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookingDetailSerializer

    def get_queryset(self):
        expire_overdue_bookings()
        return Booking.objects.filter(renter=self.request.user).select_related(
            "car"
        ).prefetch_related("renter_review")

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


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
        booking = Booking.objects.select_related("car", "renter").get(
            pkid=pkid, car__user=request.user
        )
    except Booking.DoesNotExist:
        return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    if booking.status != BookingStatus.PENDING:
        return Response(
            {"detail": "Only pending bookings can be approved"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    now = timezone.now()
    due_hours = getattr(settings, "PAYMENT_DUE_HOURS", 24)
    booking.status = BookingStatus.AWAITING_PAYMENT
    booking.approved_at = now
    booking.payment_due_at = now + timedelta(hours=due_hours)
    booking.save(
        update_fields=["status", "approved_at", "payment_due_at", "updated_at"]
    )

    email_sent = notify_renter_booking_approved(booking)

    return Response(
        {
            "status": booking.status,
            "approved_at": booking.approved_at,
            "payment_due_at": booking.payment_due_at,
            "email_sent": email_sent,
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
        booking = Booking.objects.select_related("car", "car__user").get(pkid=pkid)
    except Booking.DoesNotExist:
        return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    user = request.user
    user_pk = user.pkid
    if booking.renter_id != user_pk and booking.car.user_id != user_pk:
        return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

    if booking.status != BookingStatus.ACTIVE:
        return Response(
            {"detail": "Only active rentals can be completed (pickup checklist required first)"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if booking.end_date > date.today() and booking.renter_id != user_pk:
        return Response(
            {"detail": "Trip can be completed after the end date"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    handover = ReturnHandoverSerializer(
        data=request.data, context={"booking": booking}
    )
    handover.is_valid(raise_exception=True)
    handover_data = handover.validated_data

    now = timezone.now()
    booking.status = BookingStatus.COMPLETED
    booking.completed_at = now
    booking.location_sharing_enabled = False
    booking.return_mileage = handover_data["mileage"]
    booking.return_notes = handover_data.get("notes", "")
    if handover_data.get("photo"):
        booking.return_photo = handover_data["photo"]
    booking.save(
        update_fields=[
            "status",
            "completed_at",
            "location_sharing_enabled",
            "return_mileage",
            "return_notes",
            "return_photo",
            "updated_at",
        ]
    )

    payment_txn = (
        booking.transactions.filter(status=TransactionStatus.COMPLETED)
        .order_by("-created_at")
        .first()
    )
    payout_result = None
    if payment_txn:
        payout_result = release_owner_payout(payment_txn)

    return Response(
        {
            "status": booking.status,
            "completed_at": booking.completed_at,
            "owner_payout_status": payment_txn.owner_payout_status if payment_txn else None,
            "owner_payout": payout_result,
            "message": "Trip completed.",
            "payout_message": payout_result.get("message") if payout_result else None,
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

    user_pk = request.user.pkid
    if booking.renter_id != user_pk and booking.car.user_id != user_pk:
        return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

    if booking.status != BookingStatus.PAID:
        return Response(
            {"detail": "Only paid bookings can be activated"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    is_owner = booking.car.user_id == user_pk
    if not is_owner:
        return Response(
            {"detail": "Only the car owner can start the rental with pickup checklist"},
            status=status.HTTP_403_FORBIDDEN,
        )

    handover = PickupHandoverSerializer(data=request.data)
    handover.is_valid(raise_exception=True)
    handover_data = handover.validated_data

    now = timezone.now()
    booking.status = BookingStatus.ACTIVE
    booking.activated_at = now
    booking.pickup_mileage = handover_data["mileage"]
    booking.pickup_notes = handover_data.get("notes", "")
    if handover_data.get("photo"):
        booking.pickup_photo = handover_data["photo"]
    booking.save(
        update_fields=[
            "status",
            "activated_at",
            "pickup_mileage",
            "pickup_notes",
            "pickup_photo",
            "updated_at",
        ]
    )
    return Response(
        {
            "status": booking.status,
            "activated_at": booking.activated_at,
            "pickup_mileage": booking.pickup_mileage,
            "message": "Rental started with pickup checklist recorded.",
        }
    )


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def owner_earnings_summary(request):
    """Aggregate owner earnings from completed and in-progress bookings."""
    bookings = Booking.objects.filter(car__user=request.user).prefetch_related(
        "transactions"
    )
    currency = "KES"
    total_earned = Decimal("0")
    pending_payout = Decimal("0")
    active_trips = 0
    completed_trips = 0

    for booking in bookings:
        currency = booking.currency or currency
        payout = Decimal(str(booking.owner_payout or 0))
        txn = (
            booking.transactions.filter(status=TransactionStatus.COMPLETED)
            .order_by("-created_at")
            .first()
        )

        if booking.status == BookingStatus.COMPLETED:
            completed_trips += 1
            if txn and txn.owner_payout_status == OwnerPayoutStatus.RELEASED:
                total_earned += payout
            elif txn:
                pending_payout += payout
        elif booking.status in [BookingStatus.PAID, BookingStatus.ACTIVE]:
            active_trips += 1
            if txn:
                pending_payout += payout

    return Response(
        {
            "currency": currency,
            "total_earned": str(total_earned.quantize(Decimal("0.01"))),
            "pending_payout": str(pending_payout.quantize(Decimal("0.01"))),
            "active_trips": active_trips,
            "completed_trips": completed_trips,
        }
    )
