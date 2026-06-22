from django_countries.serializer_fields import CountryField
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import fields, serializers

from apps.common.phone import parse_kenya_phone
from apps.ratings.serializers import RatingSerializer
from apps.users.otp_email import is_placeholder_email

from .models import Profile
from .validators import phone_number_in_use

PHONE_IN_USE_MESSAGE = (
    "This phone number is already linked to another account. "
    "Use a different number or sign in with that account."
)


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")
    first_name = serializers.CharField(source="user.first_name")
    last_name = serializers.CharField(source="user.last_name")
    email = serializers.EmailField(source="user.email")
    full_name = serializers.SerializerMethodField(read_only=True)
    country = CountryField(name_only=True)
    reviews = serializers.SerializerMethodField(read_only=True)
    is_phone_only_account = serializers.SerializerMethodField(read_only=True)
    email_login_enabled = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Profile
        fields = [
            "username",
            "first_name",
            "last_name",
            "full_name",
            "email",
            "id",
            "phone_number",
            "mpesa_payout_number",
            "profile_photo",
            "about_me",
            "license",
            "gender",
            "country",
            "city",
            "renters",
            "car_owner",
            "is_agent",
            "rating",
            "num_reviews",
            "reviews",
            "is_phone_only_account",
            "email_login_enabled",
        ]

    def get_full_name(self, obj):
        first_name = obj.user.first_name.title()
        last_name = obj.user.last_name.title()
        return f"{first_name} {last_name}"

    def get_reviews(self, obj):
        reviews = obj.car_owner_review.all()
        serializer = RatingSerializer(reviews, many=True)
        return serializer.data

    def get_is_phone_only_account(self, obj):
        return is_placeholder_email(obj.user.email)

    def get_email_login_enabled(self, obj):
        return not is_placeholder_email(obj.user.email)
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.top_agent:
            representation["top_agent"] = True
        if is_placeholder_email(instance.user.email):
            representation["email"] = ""
        return representation


class UpdateProfileSerializer(serializers.ModelSerializer):
    country = CountryField(name_only=True)

    class Meta:
        model = Profile
        fields = [
            "phone_number",
            "mpesa_payout_number",
            "profile_photo",
            "about_me",
            "license",
            "gender",
            "country",
            "city",
            "renters",
            "car_owner",
            "is_agent",
        ]

    def validate_phone_number(self, value):
        if not value:
            return value
        try:
            normalized = parse_kenya_phone(str(value))
        except DjangoValidationError as exc:
            message = exc.messages[0] if getattr(exc, "messages", None) else str(exc)
            raise serializers.ValidationError(message) from exc

        profile = self.instance
        if phone_number_in_use(normalized, exclude_profile_id=profile.pk):
            raise serializers.ValidationError(PHONE_IN_USE_MESSAGE)
        return normalized

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.top_agent:
            representation["top_agent"] = True
        return representation

