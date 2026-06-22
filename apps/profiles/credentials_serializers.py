from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from apps.users.otp_email import is_placeholder_email

User = get_user_model()

EMAIL_IN_USE_MESSAGE = (
    "This email is already registered to another account. "
    "Sign in with that account, or choose a different email."
)


class LinkEmailPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    re_password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(max_length=50, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=50, required=False, allow_blank=True)

    def validate_email(self, value):
        email = value.strip().lower()
        user = self.context["request"].user
        if User.objects.filter(email__iexact=email).exclude(pkid=user.pkid).exists():
            raise serializers.ValidationError(EMAIL_IN_USE_MESSAGE)
        return email

    def validate(self, attrs):
        if attrs["password"] != attrs["re_password"]:
            raise serializers.ValidationError({"re_password": "Passwords do not match."})
        try:
            validate_password(attrs["password"], self.context["request"].user)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({"password": list(exc.messages)}) from exc
        return attrs

    def save(self):
        user = self.context["request"].user
        if not is_placeholder_email(user.email):
            raise serializers.ValidationError(
                {"detail": "Your account already has email login enabled."}
            )

        user.email = self.validated_data["email"]
        user.set_password(self.validated_data["password"])
        if self.validated_data.get("first_name"):
            user.first_name = self.validated_data["first_name"].strip()
        if self.validated_data.get("last_name"):
            user.last_name = self.validated_data["last_name"].strip()
        user.save(
            update_fields=["email", "password", "first_name", "last_name"]
        )
        return user
