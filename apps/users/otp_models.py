import secrets
import string
from datetime import timedelta

from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class OTPType(models.TextChoices):
    LOGIN = "login", _("Login Verification")
    REGISTRATION = "registration", _("Registration Verification")


class OTP(models.Model):
    user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="otps",
        null=True,
        blank=True,
    )
    phone_number = models.CharField(max_length=20)
    otp_code = models.CharField(max_length=8)
    otp_type = models.CharField(max_length=30, choices=OTPType.choices)
    is_used = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    attempts = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    verified_at = models.DateTimeField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    metadata = models.JSONField(null=True, blank=True)

    class Meta:
        db_table = "user_otps"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["phone_number", "otp_type", "is_used"]),
            models.Index(fields=["expires_at"]),
        ]

    def __str__(self):
        return f"OTP {self.phone_number} ({self.otp_type})"

    @classmethod
    def generate_code(cls, length=None):
        length = length or getattr(settings, "OTP_CODE_LENGTH", 6)
        return "".join(secrets.choice(string.digits) for _ in range(length))

    @classmethod
    def create_for_phone(
        cls,
        *,
        phone_number,
        otp_type=OTPType.LOGIN,
        user=None,
        ip_address=None,
        user_agent=None,
        metadata=None,
    ):
        expiry_minutes = getattr(settings, "OTP_EXPIRY_MINUTES", 10)
        otp_code = cls.generate_code()
        while cls.objects.filter(
            otp_code=otp_code, is_used=False, expires_at__gt=timezone.now()
        ).exists():
            otp_code = cls.generate_code()

        otp = cls(
            user=user,
            phone_number=phone_number,
            otp_code=otp_code,
            otp_type=otp_type,
            ip_address=ip_address,
            user_agent=user_agent or "",
            metadata=metadata,
            expires_at=timezone.now() + timedelta(minutes=expiry_minutes),
        )
        otp.save()
        return otp

    def is_expired(self):
        return timezone.now() > self.expires_at

    def is_valid(self):
        max_attempts = getattr(settings, "OTP_MAX_ATTEMPTS", 5)
        return not self.is_used and not self.is_expired() and self.attempts < max_attempts

    def verify(self, provided_code):
        max_attempts = getattr(settings, "OTP_MAX_ATTEMPTS", 5)
        self.attempts += 1
        self.save(update_fields=["attempts"])

        if self.is_used:
            return False, "This code was already used"
        if self.is_expired():
            return False, "This code has expired"
        if self.attempts > max_attempts:
            return False, "Too many attempts — request a new code"
        if self.otp_code != provided_code:
            remaining = max(0, max_attempts - self.attempts)
            return False, f"Invalid code. {remaining} attempt(s) left."

        self.is_verified = True
        self.is_used = True
        self.verified_at = timezone.now()
        self.save(update_fields=["is_verified", "is_used", "verified_at"])
        return True, "Code verified"


class OTPAttempt(models.Model):
    otp = models.ForeignKey(OTP, on_delete=models.CASCADE, related_name="verification_attempts")
    provided_code = models.CharField(max_length=8)
    is_successful = models.BooleanField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "otp_attempts"
        ordering = ["-created_at"]
