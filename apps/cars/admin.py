from django.contrib import admin

from .models import Car, CarViews

# Register your models here.


class CarAdmin(admin.ModelAdmin):
    list_display = ["title", "country", "advert_type", "car_type"]
    list_filter = ["advert_type", "car_type", "country"]


admin.site.register(Car, CarAdmin)
admin.site.register(CarViews)
