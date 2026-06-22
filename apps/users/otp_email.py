import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def is_placeholder_email(email: str) -> bool:
    if not email:
        return True
    return email.endswith("@phone.carrental.local")


def send_otp_email(*, email: str, otp_code: str, purpose: str = "login") -> dict:
    app_name = getattr(settings, "SITE_NAME", "Car Rental")
    if purpose == "registration":
        subject = f"{app_name}: Verify your phone sign-up"
    else:
        subject = f"{app_name}: Your login verification code"

    message = (
        f"Your {app_name} verification code is: {otp_code}\n\n"
        f"Valid for {getattr(settings, 'OTP_EXPIRY_MINUTES', 10)} minutes. "
        "Do not share this code with anyone."
    )

    try:
        send_mail(
            subject,
            message,
            getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@carrental.local"),
            [email],
            fail_silently=False,
        )
        logger.info("OTP email sent to %s", email)
        return {"success": True}
    except Exception as exc:
        logger.error("OTP email failed for %s: %s", email, exc)
        return {"success": False, "error": str(exc)}
