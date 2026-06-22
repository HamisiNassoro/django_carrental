from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .forms import CustomUserChangeForm, CustomUserCreationForm
from .models import User
from .otp_models import OTP, OTPAttempt


@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ["id", "phone_number", "otp_type", "is_used", "attempts", "created_at", "expires_at"]
    list_filter = ["otp_type", "is_used"]
    search_fields = ["phone_number", "otp_code"]
    readonly_fields = ["otp_code", "created_at", "expires_at", "verified_at"]


@admin.register(OTPAttempt)
class OTPAttemptAdmin(admin.ModelAdmin):
    list_display = ["id", "otp", "is_successful", "ip_address", "created_at"]
    list_filter = ["is_successful"]


class UserAdmin(BaseUserAdmin):
    ordering = ["email"]
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User
    list_display = [
        "pkid",
        "id",
        "email",
        "username",
        "first_name",
        "last_name",
        "is_staff",
        "is_active",
    ]
    list_display_links = ["id", "email"]  ### On the Admin page these will be clickable
    list_filter = [
        "email",
        "username",
        "first_name",
        "last_name",
        "is_staff",
        "is_active",
    ]
    fieldsets = (
        (
            _("Login Credentials"),
            {
                "fields": (
                    "email",
                    "password",
                )
            },
        ),
        (
            _("Personal Information"),
            {
                "fields": (
                    "username",
                    "first_name",
                    "last_name",
                )
            },
        ),
        (
            _("Permissions and Groups"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (_("Important Dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2", "is_staff", "is_active"),
            },
        ),
    )
    search_fields = ["email", "username", "first_name", "last_name"]


admin.site.register(User, UserAdmin)
