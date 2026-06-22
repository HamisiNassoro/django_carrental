import logging
from decimal import Decimal

from django.conf import settings
from django.utils import timezone

from .models import OwnerPayoutStatus, Transaction
from .mpesa import MpesaError, initiate_b2c_payout, normalize_phone_number

logger = logging.getLogger(__name__)


def _resolve_owner_payout_phone(owner) -> str | None:
    profile = getattr(owner, "profile", None)
    if not profile:
        return None
    if profile.mpesa_payout_number:
        return normalize_phone_number(profile.mpesa_payout_number)
    if profile.phone_number:
        return normalize_phone_number(str(profile.phone_number))
    return None


def release_owner_payout(payment_txn: Transaction) -> dict:
    """Send owner their share via M-Pesa B2C (or mock in development)."""
    if payment_txn.owner_payout_status == OwnerPayoutStatus.RELEASED:
        return {
            "status": "already_released",
            "receipt": payment_txn.owner_payout_mpesa_receipt,
        }

    owner = payment_txn.owner
    payout_phone = _resolve_owner_payout_phone(owner)
    amount = Decimal(str(payment_txn.owner_payout))

    if not payout_phone:
        payment_txn.owner_payout_status = OwnerPayoutStatus.RELEASED
        payment_txn.failure_reason = (
            (payment_txn.failure_reason or "")
            + " Owner payout phone missing — settle manually."
        ).strip()
        payment_txn.save(
            update_fields=["owner_payout_status", "failure_reason", "updated_at"]
        )
        return {
            "status": "released_manual",
            "message": "Owner payout phone not set. Marked for manual settlement.",
        }

    if amount <= 0:
        payment_txn.owner_payout_status = OwnerPayoutStatus.RELEASED
        payment_txn.save(update_fields=["owner_payout_status", "updated_at"])
        return {"status": "released", "message": "No payout amount due."}

    try:
        result = initiate_b2c_payout(
            phone_number=payout_phone,
            amount=amount,
            remarks=f"Rental payout BK{payment_txn.booking.pkid}",
        )
    except MpesaError as exc:
        logger.error("Owner B2C payout failed for txn %s: %s", payment_txn.pkid, exc)
        payment_txn.failure_reason = str(exc)
        payment_txn.save(update_fields=["failure_reason", "updated_at"])
        return {"status": "failed", "message": str(exc)}

    payment_txn.owner_payout_status = OwnerPayoutStatus.RELEASED
    payment_txn.owner_payout_phone = payout_phone
    payment_txn.owner_payout_mpesa_receipt = result.get("TransactionReceipt") or result.get(
        "ConversationID", ""
    )
    payment_txn.owner_payout_at = timezone.now()
    payment_txn.save(
        update_fields=[
            "owner_payout_status",
            "owner_payout_phone",
            "owner_payout_mpesa_receipt",
            "owner_payout_at",
            "updated_at",
        ]
    )
    return {
        "status": "released",
        "receipt": payment_txn.owner_payout_mpesa_receipt,
        "provider": result.get("provider"),
        "message": result.get("ResponseDescription", "Owner payout initiated"),
    }
