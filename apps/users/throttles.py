from rest_framework.throttling import AnonRateThrottle


class LoginAnonThrottle(AnonRateThrottle):
    """Limit OTP send/verify bursts: 5 requests per 30 seconds per IP."""

    scope = "login"

    def parse_rate(self, rate):
        if rate and rate.endswith("/30s"):
            num, _ = rate.split("/")
            return (int(num), 30)
        return super().parse_rate(rate)
