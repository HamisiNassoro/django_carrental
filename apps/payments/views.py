import logging

from django.conf import settings
from django.db import transaction as db_transaction
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from apps.bookings.models import Booking, BookingStatus
from .models import OwnerPayoutStatus, PaymentProvider, Transaction, TransactionStatus
from .mpesa import MpesaError, initiate_stk_push, normalize_phone_number, parse_callback_payload
from .serializers import InitiatePaymentSerializer, TransactionSerializer, calculate_fees

logger = logging.getLogger(__name__)


def _mark_payment_success(transaction: Transaction, receipt_number: str = ""):
    transaction.status = TransactionStatus.COMPLETED
    if receipt_number:
        transaction.mpesa_receipt_number = receipt_number
    transaction.save(update_fields=["status", "mpesa_receipt_number", "updated_at"])

    booking = transaction.booking
    now = timezone.now()
    booking.status = BookingStatus.PAID
    booking.paid_at = now
    booking.save(update_fields=["status", "paid_at", "updated_at"])


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def initiate_booking_payment(request, pkid):
    try:
        booking = Booking.objects.select_related("car", "car__user").get(
            pkid=pkid, renter=request.user
        )
    except Booking.DoesNotExist:
        return Response({"detail": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

    if booking.status != BookingStatus.AWAITING_PAYMENT:
        return Response(
            {"detail": "This booking is not awaiting payment"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    serializer = InitiatePaymentSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    phone_number = normalize_phone_number(serializer.validated_data["phone_number"])

    existing = (
        Transaction.objects.filter(
            booking=booking,
            status__in=[
                TransactionStatus.PENDING,
                TransactionStatus.PROCESSING,
                TransactionStatus.COMPLETED,
            ],
        )
        .order_by("-created_at")
        .first()
    )
    if (
        existing
        and existing.status == TransactionStatus.COMPLETED
        and booking.status != BookingStatus.AWAITING_PAYMENT
    ):
        return Response(
            {"detail": "Booking is already paid", "transaction": TransactionSerializer(existing).data},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if existing and existing.status in (
        TransactionStatus.PENDING,
        TransactionStatus.PROCESSING,
    ):
        existing.status = TransactionStatus.FAILED
        existing.failure_reason = "Superseded by new payment attempt"
        existing.save(update_fields=["status", "failure_reason", "updated_at"])

    platform_fee, owner_payout = calculate_fees(booking.total_price)
    provider = PaymentProvider.MOCK if getattr(settings, "MOCK_MPESA", True) else PaymentProvider.MPESA

    with db_transaction.atomic():
        payment_txn = Transaction.objects.create(
            booking=booking,
            renter=request.user,
            owner=booking.car.user,
            amount=booking.total_price,
            platform_fee=platform_fee,
            owner_payout=owner_payout,
            currency=booking.currency,
            phone_number=phone_number,
            provider=provider,
            status=TransactionStatus.PROCESSING,
        )

        try:
            stk_response = initiate_stk_push(
                phone_number=phone_number,
                amount=booking.total_price,
                account_reference=f"BK{booking.pkid}",
                description=f"Car rental {booking.car.title[:10]}",
            )
        except MpesaError as exc:
            payment_txn.status = TransactionStatus.FAILED
            payment_txn.failure_reason = str(exc)
            payment_txn.save(update_fields=["status", "failure_reason", "updated_at"])
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        payment_txn.mpesa_checkout_request_id = stk_response.get("CheckoutRequestID", "")
        payment_txn.mpesa_merchant_request_id = stk_response.get("MerchantRequestID", "")
        payment_txn.save(
            update_fields=[
                "mpesa_checkout_request_id",
                "mpesa_merchant_request_id",
                "updated_at",
            ]
        )

        if provider == PaymentProvider.MOCK:
            _mark_payment_success(payment_txn, receipt_number=f"MOCK{booking.pkid}")

    payment_txn.refresh_from_db()
    booking.refresh_from_db()
    message = (
        "Payment completed (mock mode)."
        if provider == PaymentProvider.MOCK
        else "M-Pesa STK push sent. Enter your PIN on your phone to complete payment."
    )
    return Response(
        {
            "message": message,
            "transaction": TransactionSerializer(payment_txn).data,
            "booking_status": booking.status,
        },
        status=status.HTTP_200_OK,
    )


@csrf_exempt
@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def mpesa_callback(request):
    try:
        payload = request.data if isinstance(request.data, dict) else {}
        parsed = parse_callback_payload(payload)
    except Exception as exc:
        logger.exception("Failed to parse M-Pesa callback: %s", exc)
        return Response({"ResultCode": 1, "ResultDesc": "Invalid callback"}, status=status.HTTP_400_BAD_REQUEST)

    checkout_id = parsed.get("checkout_request_id")
    if not checkout_id:
        return Response({"ResultCode": 0, "ResultDesc": "Accepted"})

    payment_txn = (
        Transaction.objects.select_related("booking")
        .filter(mpesa_checkout_request_id=checkout_id)
        .order_by("-created_at")
        .first()
    )
    if not payment_txn:
        logger.warning("M-Pesa callback for unknown checkout id: %s", checkout_id)
        return Response({"ResultCode": 0, "ResultDesc": "Accepted"})

    if parsed.get("result_code") == 0:
        _mark_payment_success(payment_txn, receipt_number=parsed.get("receipt_number") or "")
    else:
        payment_txn.status = TransactionStatus.FAILED
        payment_txn.failure_reason = parsed.get("result_desc") or "Payment failed"
        payment_txn.save(update_fields=["status", "failure_reason", "updated_at"])

    return Response({"ResultCode": 0, "ResultDesc": "Accepted"})


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def booking_payment_status(request, pkid):
    try:
        booking = Booking.objects.get(pkid=pkid, renter=request.user)
    except Booking.DoesNotExist:
        return Response({"detail": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

    payment_txn = booking.transactions.order_by("-created_at").first()
    return Response(
        {
            "booking_status": booking.status,
            "transaction": TransactionSerializer(payment_txn).data if payment_txn else None,
        }
    )
