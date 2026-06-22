from django.urls import path

from .otp_views import PhoneOTPSendView, PhoneOTPVerifyView

urlpatterns = [
    path("otp/send/", PhoneOTPSendView.as_view(), name="otp-send"),
    path("otp/verify/", PhoneOTPVerifyView.as_view(), name="otp-verify"),
]
