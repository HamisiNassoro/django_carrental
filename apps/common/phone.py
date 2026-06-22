import re

import phonenumbers
from django.core.exceptions import ValidationError
from phonenumbers import PhoneNumberFormat

from apps.payments.mpesa import normalize_phone_number


def parse_kenya_phone(raw: str) -> str:
    """Normalize a Kenyan phone number to E.164 (+2547XXXXXXXX)."""
    if not raw or not str(raw).strip():
        raise ValidationError("Phone number is required")

    cleaned = re.sub(r"[^\d+]", "", str(raw).strip())
    if not cleaned.startswith("+"):
        digits = normalize_phone_number(cleaned)
        cleaned = f"+{digits}"

    try:
        parsed = phonenumbers.parse(cleaned, "KE")
    except phonenumbers.NumberParseException as exc:
        raise ValidationError("Enter a valid Kenyan phone number") from exc

    if not phonenumbers.is_valid_number(parsed):
        raise ValidationError("Enter a valid Kenyan phone number")

    region = phonenumbers.region_code_for_number(parsed)
    if region != "KE":
        raise ValidationError("Only Kenyan phone numbers are supported")

    return phonenumbers.format_number(parsed, PhoneNumberFormat.E164)


def phone_lookup_variants(e164: str) -> list[str]:
    """Return common stored formats for profile lookup."""
    digits = e164.lstrip("+")
    variants = {e164, digits, f"+{digits}"}
    if digits.startswith("254"):
        variants.add(f"0{digits[3:]}")
    return list(variants)
