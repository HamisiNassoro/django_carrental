from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.serializers import UserSerializer

from .otp_serializers import PhoneOTPSendSerializer, PhoneOTPVerifySerializer
from .otp_services import otp_service
from .throttles import LoginAnonThrottle


def _client_meta(request):
    return {
        "ip_address": request.META.get("REMOTE_ADDR"),
        "user_agent": request.META.get("HTTP_USER_AGENT", ""),
    }


class PhoneOTPSendView(APIView):
    throttle_classes = [LoginAnonThrottle]
    permission_classes = []

    def post(self, request):
        serializer = PhoneOTPSendSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = otp_service.send_phone_otp(
            phone_number=serializer.validated_data["phone_number"],
            **_client_meta(request),
        )
        if not result.get("success"):
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        return Response(result, status=status.HTTP_200_OK)


class PhoneOTPVerifyView(APIView):
    throttle_classes = [LoginAnonThrottle]
    permission_classes = []

    def post(self, request):
        serializer = PhoneOTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        result = otp_service.verify_phone_otp(
            otp_id=data["otp_id"],
            otp_code=data["otp_code"],
            phone_number=data["phone_number"],
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
            **_client_meta(request),
        )
        if not result.get("success"):
            return Response(result, status=status.HTTP_400_BAD_REQUEST)

        user = result["user"]
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "success": True,
                "message": "Login successful",
                "is_new_user": result.get("is_new_user", False),
                "user": UserSerializer(user).data,
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
            },
            status=status.HTTP_200_OK,
        )
