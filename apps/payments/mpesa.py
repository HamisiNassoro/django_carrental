import base64
import json
import logging
from datetime import datetime
from decimal import Decimal

import requests
from django.conf import settings

logger = logging.getLogger(__name__)


class MpesaError(Exception):
    pass


def _mpesa_base_url() -> str:
    env = getattr(settings, "MPESA_ENV", "sandbox")
    if env == "production":
        return "https://api.safaricom.co.ke"
    return "https://sandbox.safaricom.co.ke"


def normalize_phone_number(phone: str) -> str:
    digits = "".join(ch for ch in phone if ch.isdigit())
    if digits.startswith("0"):
        return f"254{digits[1:]}"
    if digits.startswith("254"):
        return digits
    if digits.startswith("7") and len(digits) == 9:
        return f"254{digits}"
    return digits


def get_access_token() -> str:
    consumer_key = settings.MPESA_CONSUMER_KEY
    consumer_secret = settings.MPESA_CONSUMER_SECRET
    if not consumer_key or not consumer_secret:
        raise MpesaError("M-Pesa credentials are not configured")

    credentials = base64.b64encode(
        f"{consumer_key}:{consumer_secret}".encode()
    ).decode()
    response = requests.get(
        f"{_mpesa_base_url()}/oauth/v1/generate?grant_type=client_credentials",
        headers={"Authorization": f"Basic {credentials}"},
        timeout=30,
    )
    response.raise_for_status()
    return response.json()["access_token"]


def initiate_stk_push(*, phone_number: str, amount: Decimal, account_reference: str, description: str):
    if getattr(settings, "MOCK_MPESA", True):
        return {
            "provider": "MOCK",
            "MerchantRequestID": f"mock-merchant-{account_reference}",
            "CheckoutRequestID": f"mock-checkout-{account_reference}",
            "ResponseCode": "0",
            "ResponseDescription": "Mock STK push accepted",
        }

    shortcode = settings.MPESA_SHORTCODE
    passkey = settings.MPESA_PASSKEY
    callback_url = settings.MPESA_CALLBACK_URL
    if not all([shortcode, passkey, callback_url]):
        raise MpesaError("M-Pesa STK settings are incomplete")

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    password = base64.b64encode(f"{shortcode}{passkey}{timestamp}".encode()).decode()
    token = get_access_token()
    payload = {
        "BusinessShortCode": shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(Decimal(amount)),
        "PartyA": normalize_phone_number(phone_number),
        "PartyB": shortcode,
        "PhoneNumber": normalize_phone_number(phone_number),
        "CallBackURL": callback_url,
        "AccountReference": account_reference[:12],
        "TransactionDesc": description[:13],
    }

    try:
        response = requests.post(
            f"{_mpesa_base_url()}/mpesa/stkpush/v1/processrequest",
            headers={"Authorization": f"Bearer {token}"},
            json=payload,
            timeout=30,
        )
        response.raise_for_status()
    except requests.HTTPError as exc:
        try:
            detail = exc.response.json()
        except Exception:
            detail = exc.response.text if exc.response is not None else str(exc)
        logger.error("M-Pesa STK push failed: %s", detail)
        raise MpesaError(f"M-Pesa STK push failed: {detail}") from exc
    except requests.RequestException as exc:
        logger.error("M-Pesa STK push request error: %s", exc)
        raise MpesaError(f"M-Pesa STK push request failed: {exc}") from exc

    data = response.json()
    if data.get("ResponseCode") != "0":
        raise MpesaError(
            data.get("ResponseDescription")
            or data.get("errorMessage")
            or "M-Pesa rejected the STK push request"
        )
    data["provider"] = "MPESA"
    return data


def _should_mock_b2c() -> bool:
    if getattr(settings, "MOCK_B2C", True):
        return True
    if getattr(settings, "MOCK_MPESA", True):
        return True
    security_credential = getattr(settings, "MPESA_SECURITY_CREDENTIAL", "")
    result_url = getattr(settings, "MPESA_B2C_RESULT_URL", "")
    timeout_url = getattr(settings, "MPESA_B2C_TIMEOUT_URL", "")
    if not all([security_credential, result_url, timeout_url]):
        if getattr(settings, "MPESA_ENV", "sandbox") == "sandbox":
            logger.warning(
                "B2C credentials missing in sandbox — using mock owner payout"
            )
            return True
    return False


def initiate_b2c_payout(*, phone_number: str, amount: Decimal, remarks: str):
    if _should_mock_b2c():
        receipt = f"MOCKB2C{int(amount)}"
        return {
            "provider": "MOCK",
            "ResponseCode": "0",
            "ResponseDescription": "Mock B2C payout accepted (dev/sandbox)",
            "ConversationID": f"mock-b2c-{normalize_phone_number(phone_number)}",
            "TransactionReceipt": receipt,
        }

    security_credential = settings.MPESA_SECURITY_CREDENTIAL
    result_url = settings.MPESA_B2C_RESULT_URL
    timeout_url = settings.MPESA_B2C_TIMEOUT_URL
    if not all([security_credential, result_url, timeout_url]):
        raise MpesaError(
            "M-Pesa B2C settings are incomplete (security credential and callback URLs required)"
        )

    token = get_access_token()
    payload = {
        "InitiatorName": settings.MPESA_INITIATOR_NAME,
        "SecurityCredential": security_credential,
        "CommandID": "BusinessPayment",
        "Amount": int(Decimal(amount)),
        "PartyA": settings.MPESA_B2C_SHORTCODE,
        "PartyB": normalize_phone_number(phone_number),
        "Remarks": remarks[:100],
        "QueueTimeOutURL": timeout_url,
        "ResultURL": result_url,
        "Occasion": "Rental payout",
    }

    try:
        response = requests.post(
            f"{_mpesa_base_url()}/mpesa/b2c/v1/paymentrequest",
            headers={"Authorization": f"Bearer {token}"},
            json=payload,
            timeout=30,
        )
        response.raise_for_status()
    except requests.HTTPError as exc:
        try:
            detail = exc.response.json()
        except Exception:
            detail = exc.response.text if exc.response is not None else str(exc)
        logger.error("M-Pesa B2C payout failed: %s", detail)
        raise MpesaError(f"M-Pesa B2C payout failed: {detail}") from exc
    except requests.RequestException as exc:
        logger.error("M-Pesa B2C request error: %s", exc)
        raise MpesaError(f"M-Pesa B2C request failed: {exc}") from exc

    data = response.json()
    if data.get("ResponseCode") != "0":
        raise MpesaError(
            data.get("ResponseDescription")
            or data.get("errorMessage")
            or "M-Pesa rejected the B2C payout request"
        )
    data["provider"] = "MPESA"
    return data


def parse_callback_payload(payload: dict) -> dict:
    body = payload.get("Body", {}).get("stkCallback", {})
    result_code = body.get("ResultCode")
    metadata = {
        item["Name"]: item.get("Value")
        for item in body.get("CallbackMetadata", {}).get("Item", [])
    }
    return {
        "result_code": result_code,
        "result_desc": body.get("ResultDesc"),
        "merchant_request_id": body.get("MerchantRequestID"),
        "checkout_request_id": body.get("CheckoutRequestID"),
        "receipt_number": metadata.get("MpesaReceiptNumber"),
        "amount": metadata.get("Amount"),
        "phone_number": metadata.get("PhoneNumber"),
    }
