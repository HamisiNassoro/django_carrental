from django.contrib import admin
from django.utils.html import format_html
from .models import Booking, BookingStatus


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = [
        "pkid",
        "car_title",
        "renter_info",
        "start_date",
        "end_date",
        "total_price",
        "status",
        "created_at",
    ]
    list_filter = [
        "status",
        "start_date",
        "end_date",
        "created_at",
        "car__car_type",
        "car__advert_type",
    ]
    search_fields = [
        "pkid",
        "car__title",
        "renter__email",
        "renter__username",
        "renter__first_name",
        "renter__last_name",
    ]
    readonly_fields = [
        "pkid",
        "id",
        "created_at",
        "updated_at",
        "total_price",
    ]
    list_per_page = 25
    date_hierarchy = "created_at"
    
    fieldsets = (
        ("Booking Information", {
            "fields": (
                "pkid",
                "id",
                "car",
                "renter",
                "start_date",
                "end_date",
                "total_price",
                "status",
                "notes",
            )
        }),
        ("Timestamps", {
            "fields": (
                "created_at",
                "updated_at",
            ),
            "classes": ("collapse",)
        }),
    )
    
    def car_title(self, obj):
        """Display car title with link to car admin"""
        if obj.car:
            return format_html(
                '<a href="{}">{}</a>',
                f"/admin/cars/car/{obj.car.pkid}/",
                obj.car.title
            )
        return "-"
    car_title.short_description = "Car"
    car_title.admin_order_field = "car__title"
    
    def renter_info(self, obj):
        """Display renter information with link to user admin"""
        if obj.renter:
            return format_html(
                '<a href="{}">{}</a>',
                f"/admin/users/user/{obj.renter.pkid}/",
                f"{obj.renter.first_name} {obj.renter.last_name}" if obj.renter.first_name and obj.renter.last_name else obj.renter.email
            )
        return "-"
    renter_info.short_description = "Renter"
    renter_info.admin_order_field = "renter__first_name"
    
    def get_queryset(self, request):
        """Optimize queryset with select_related for better performance"""
        return super().get_queryset(request).select_related("car", "renter")
    
    def save_model(self, request, obj, form, change):
        """Custom save logic for admin"""
        if not change:  # New booking
            # Calculate total price if not set
            if obj.car and obj.start_date and obj.end_date and obj.total_price == 0:
                from datetime import timedelta
                num_days = (obj.end_date - obj.start_date).days + 1
                obj.total_price = float(obj.car.price) * max(num_days, 1)
        super().save_model(request, obj, form, change)


# Register the BookingStatus choices as a separate admin interface if needed
# This is optional but can be useful for managing status choices
class BookingStatusAdmin(admin.ModelAdmin):
    list_display = ["value", "label"]
    readonly_fields = ["value", "label"]
    
    def has_add_permission(self, request):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False

# Uncomment the line below if you want to show BookingStatus choices in admin
# admin.site.register(BookingStatus, BookingStatusAdmin)
