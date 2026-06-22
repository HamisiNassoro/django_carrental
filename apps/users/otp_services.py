import logging
import secrets

from django.conf import settings
from django.db.models import Q
from django.utils import timezone

from apps.common.phone import parse_kenya_phone, phone_lookup_variants
from apps.profiles.models import Profile

from .models import User
from .otp_email import is_placeholder_email, send_otp_email
from .otp_models import OTP, OTPAttempt, OTPType
from .textsms_service import textsms_service

logger = logging.getLogger(__name__)


def find_user_by_phone(raw_phone: str):
    phone = parse_kenya_phone(raw_phone)
    variants = phone_lookup_variants(phone)
    profile = (
        Profile.objects.select_related("user")
        .filter(Q(phone_number__in=variants))
        .first()
    )
    if profile:
        return profile.user, phone
    return None, phone


def create_user_for_phone(phone: str, first_name: str = "", last_name: str = ""):
    digits = phone.lstrip("+")
    username_base = f"user_{digits[-9:]}"
    username = username_base
    suffix = 1
    while User.objects.filter(username=username).exists():
        username = f"{username_base}{suffix}"
        suffix += 1

    email = f"{digits}@phone.carrental.local"
    suffix = 1
    while User.objects.filter(email=email).exists():
        email = f"{digits}{suffix}@phone.carrental.local"
        suffix += 1

    user = User.objects.create_user(
        username=username,
        first_name=first_name or "User",
        last_name=last_name or "Member",
        email=email,
        password=secrets.token_urlsafe(32),
    )
    profile = user.profile
    profile.phone_number = phone
    profile.save(update_fields=["phone_number", "updated_at"])
    return user


def _should_mock_otp() -> bool:
    if getattr(settings, "MOCK_OTP", True):
        return True
    if textsms_service._is_configured():
        return False
    logger.warning("TextSMS not configured — OTP codes will be logged to the console only")
    return True


class OTPService:
    def _in_cooldown(self, phone_number: str, otp_type: str) -> bool:
        cooldown_seconds = getattr(settings, "OTP_COOLDOWN_SECONDS", 60)
        if cooldown_seconds <= 0:
            return False
        recent = OTP.objects.filter(
            phone_number=phone_number,
            otp_type=otp_type,
            created_at__gte=timezone.now() - timezone.timedelta(seconds=cooldown_seconds),
        ).exists()
        return recent

    def _send_sms(self, otp: OTP) -> dict:
        app_name = getattr(settings, "SITE_NAME", "Car Rental")
        if _should_mock_otp():
            logger.info(
                "[MOCK OTP] phone=%s code=%s (valid %s min)",
                otp.phone_number,
                otp.otp_code,
                getattr(settings, "OTP_EXPIRY_MINUTES", 10),
            )
            return {"success": True, "provider": "mock"}

        result = textsms_service.send_otp(otp.phone_number, otp.otp_code, app_name=app_name)
        if result.get("success"):
            return {"success": True, "provider": "textsms"}
        return {"success": False, "message": result.get("error", "Failed to send SMS")}

    def _send_email(self, otp: OTP, user: User | None, otp_type: str) -> dict:
        if not user or is_placeholder_email(user.email):
            return {"success": False, "skipped": True}

        if _should_mock_otp() and not getattr(settings, "OTP_EMAIL_WHEN_MOCK", False):
            logger.info("[MOCK OTP] email=%s code=%s", user.email, otp.otp_code)
            return {"success": True, "provider": "mock"}

        purpose = "registration" if otp_type == OTPType.REGISTRATION else "login"
        result = send_otp_email(email=user.email, otp_code=otp.otp_code, purpose=purpose)
        if result.get("success"):
            return {"success": True, "provider": "smtp"}
        return {"success": False, "message": result.get("error", "Failed to send email")}

    def send_phone_otp(
        self,
        *,
        phone_number: str,
        ip_address=None,
        user_agent=None,
        metadata=None,
    ) -> dict:
        user, normalized_phone = find_user_by_phone(phone_number)
        otp_type = OTPType.LOGIN if user else OTPType.REGISTRATION

        if self._in_cooldown(normalized_phone, otp_type):
            wait = getattr(settings, "OTP_COOLDOWN_SECONDS", 60)
            return {
                "success": False,
                "message": f"Please wait {wait} seconds before requesting another code",
            }

        otp = OTP.create_for_phone(
            phone_number=normalized_phone,
            otp_type=otp_type,
            user=user,
            ip_address=ip_address,
            user_agent=user_agent or "",
            metadata=metadata,
        )

        sms_result = self._send_sms(otp)
        email_result = self._send_email(otp, user, otp_type)

        sms_sent = sms_result.get("success")
        email_sent = email_result.get("success") and not email_result.get("skipped")

        if not sms_sent and not email_sent:
            otp.delete()
            return {
                "success": False,
                "message": sms_result.get("message", "Could not send verification code"),
            }

        payload = {
            "success": True,
            "message": "Verification code sent",
            "otp_id": otp.id,
            "expires_at": otp.expires_at.isoformat(),
            "is_new_user": user is None,
            "phone_number": normalized_phone,
            "delivery_methods": {
                "sms": {"sent": sms_sent},
                "email": {"sent": email_sent, "address": user.email if email_sent else None},
            },
        }
        if _should_mock_otp():
            payload["dev_hint"] = "Check the Django server console for your code in development"
        elif email_sent and sms_sent:
            payload["message"] = "Verification code sent to your phone and email"
        elif email_sent:
            payload["message"] = "Verification code sent to your email"
        else:
            payload["message"] = "Verification code sent to your phone"
        return payload

    def verify_phone_otp(
        self,
        *,
        otp_id: int,
        otp_code: str,
        phone_number: str,
        first_name: str = "",
        last_name: str = "",
        ip_address=None,
        user_agent=None,
    ) -> dict:
        _, normalized_phone = find_user_by_phone(phone_number)

        try:
            otp = OTP.objects.get(id=otp_id, phone_number=normalized_phone, is_used=False)
        except OTP.DoesNotExist:
            return {"success": False, "message": "Invalid or expired verification request"}

        is_valid, message = otp.verify(otp_code)
        OTPAttempt.objects.create(
            otp=otp,
            provided_code=otp_code,
            is_successful=is_valid,
            ip_address=ip_address,
            user_agent=user_agent or "",
        )

        if not is_valid:
            return {"success": False, "message": message}

        user = otp.user
        created = False
        if not user:
            user = create_user_for_phone(
                normalized_phone,
                first_name=first_name or (otp.metadata or {}).get("first_name", ""),
                last_name=last_name or (otp.metadata or {}).get("last_name", ""),
            )
            created = True
        else:
            profile = user.profile
            if not profile.phone_number:
                profile.phone_number = normalized_phone
                profile.save(update_fields=["phone_number", "updated_at"])

        return {
            "success": True,
            "message": "Phone verified",
            "user": user,
            "is_new_user": created,
        }


otp_service = OTPService()
