from django.contrib import admin

from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        "pkid",
        "booking",
        "amount",
        "currency",
        "status",
        "owner_payout_status",
        "provider",
        "created_at",
    )
    list_filter = ("status", "owner_payout_status", "provider", "currency")
    search_fields = ("mpesa_receipt_number", "phone_number", "booking__pkid")
