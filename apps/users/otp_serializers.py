from rest_framework import serializers

from apps.common.phone import parse_kenya_phone


class PhoneOTPSendSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)

    def validate_phone_number(self, value):
        return parse_kenya_phone(value)


class PhoneOTPVerifySerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    otp_code = serializers.CharField(min_length=4, max_length=8)
    otp_id = serializers.IntegerField()
    first_name = serializers.CharField(max_length=50, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=50, required=False, allow_blank=True)

    def validate_phone_number(self, value):
        return parse_kenya_phone(value)

    def validate_otp_code(self, value):
        code = value.strip()
        if not code.isdigit():
            raise serializers.ValidationError("Code must contain digits only")
        return code
