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

    response = requests.post(
        f"{_mpesa_base_url()}/mpesa/stkpush/v1/processrequest",
        headers={"Authorization": f"Bearer {token}"},
        json=payload,
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()
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
