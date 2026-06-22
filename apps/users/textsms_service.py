import logging

import requests
from django.conf import settings

logger = logging.getLogger(__name__)


class TextSMSService:
    def __init__(self):
        self.api_key = getattr(settings, "TEXT_SMS_API", "")
        self.partner_id = getattr(settings, "TEXT_SMS_PARTNER_ID", "")
        self.shortcode = getattr(settings, "TEXT_SMS_SHORTCODE", "")
        self.api_url = getattr(
            settings, "TEXT_SMS_URL", "https://sms.textsms.co.ke/api/services/sendsms/"
        )

    def _is_configured(self) -> bool:
        return all([self.api_key, self.partner_id, self.shortcode, self.api_url])

    def send_sms(self, phone_number: str, message: str) -> dict:
        if not self._is_configured():
            return {"success": False, "error": "TextSMS service not configured"}

        payload = {
            "message": message,
            "mobile": phone_number.lstrip("+"),
            "apikey": self.api_key,
            "partnerID": self.partner_id,
            "shortcode": self.shortcode,
        }

        try:
            response = requests.post(
                self.api_url,
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30,
            )
            if response.status_code == 200:
                return {"success": True, "data": response.json()}
            return {"success": False, "error": f"HTTP {response.status_code}: {response.text}"}
        except requests.RequestException as exc:
            logger.error("TextSMS request failed: %s", exc)
            return {"success": False, "error": str(exc)}

    def send_otp(self, phone_number: str, otp_code: str, app_name: str = "Car Rental") -> dict:
        message = (
            f"Your {app_name} verification code is: {otp_code}. "
            f"Valid for 10 minutes. Do not share this code."
        )
        return self.send_sms(phone_number, message)


textsms_service = TextSMSService()
