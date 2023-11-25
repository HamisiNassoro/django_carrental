import random
import string

from autoslug import AutoSlugField
from django.contrib.auth import get_user_model
from django.contrib.gis.db import models
from django.core.validators import MinValueValidator
from django.utils.translation import gettext_lazy as _
from django_countries.fields import CountryField

from apps.common.models import TimeStampedUUIDModel

# Create your models here.

User = get_user_model()

### Custom Model Manager
class CarPublishedManager(models.Manager):
    def get_queryset(self):
        return (
            super(CarPublishedManager, self)
            .get_queryset()
            .filter(published_status=True)
        )  #### The queryset will be called only if the published_status is true


class Car(TimeStampedUUIDModel):
    class AdvertType(models.TextChoices):
        FOR_SALE = "For Sale", _("For Sale")
        FOR_RENT = "For Rent", _("For Rent")
        AUCTION = "Auction", _("Auction")

    class CarType(models.TextChoices):
        SEDAN = "Sedan", _("Sedan")
        SUV = "Sports Utility Vehicle(SUV)", _("Sports Utility Vehicle(SUV)")
        HATCHBACK = "Hatchback", _("Hatchback")
        LUXURY = "Luxury", _("Luxury")
        CONVERTIBLE = "Convertible", _("Convertible")
        VAN = "Van", _("Van")
        ELECTRIC = "Electric", _("Electric")
        OTHER = "Other", _("Other")

    user = models.ForeignKey(
        User,
        verbose_name=_("Agent,renter or Vehicle Provider"),
        related_name="agent_buyer",
        on_delete=models.DO_NOTHING,
    )

    title = models.CharField(verbose_name=_("Car Title"), max_length=250)
    slug = AutoSlugField(
        populate_from="title", unique=True, always_update=True
    )  ### Means when title changes also update slug field
    ref_code = models.CharField(
        verbose_name=_("Car Reference Code"),
        max_length=255,
        unique=True,
        blank=True,
    )
    description = models.TextField(
        verbose_name=_("Description"),
        default="Default description...update me please....",
    )
    country = CountryField(
        verbose_name=_("Country"),
        default="KE",
        blank_label="(select country)",
    )
    city = models.CharField(verbose_name=_("City"), max_length=180, default="Nairobi")
    postal_code = models.CharField(
        verbose_name=_("Postal Code"), max_length=100, default="140"
    )
    street_address = models.CharField(
        verbose_name=_("Street Address"), max_length=150, default="KG8 Avenue"
    )
    car_number = models.CharField(
        verbose_name=_("Car Number Plate"),
        max_length=255, unique=True
    )
    price = models.DecimalField(
        verbose_name=_("Price"), max_digits=10, decimal_places=2, default=0.0
    )
    tax = models.DecimalField(
        verbose_name=_("Car Tax"),
        max_digits=6,
        decimal_places=2,
        default=0.15,
        help_text="15% car tax charged",
    )
    total_seats = models.IntegerField(verbose_name=_("Number of Seats"), default=0)
    advert_type = models.CharField(
        verbose_name=_("Advert Type"),
        max_length=50,
        choices=AdvertType.choices,
        default=AdvertType.FOR_SALE,
    )

    car_type = models.CharField(
        verbose_name=_("Car Type"),
        max_length=50,
        choices=CarType.choices,
        default=CarType.OTHER,
    )

    cover_photo = models.ImageField(
        verbose_name=_("Main Photo"), default="/car_sample.jpg", null=True, blank=True
    )
    photo1 = models.ImageField(
        default="/interior_sample.jpg",
        null=True,
        blank=True,
    )
    photo2 = models.ImageField(
        default="/interior_sample.jpg",
        null=True,
        blank=True,
    )
    photo3 = models.ImageField(
        default="/interior_sample.jpg",
        null=True,
        blank=True,
    )
    photo4 = models.ImageField(
        default="/interior_sample.jpg",
        null=True,
        blank=True,
    )
    published_status = models.BooleanField(
        verbose_name=_("Published Status"), default=False
    )
    views = models.IntegerField(verbose_name=_("Total Views"), default=0)
    location = models.PointField()

    objects = models.Manager()
    published = CarPublishedManager()

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Car"
        verbose_name_plural = "Cars"

    def save(self, *args, **kwargs):
        self.title = str.title(self.title)  # title be title cased
        self.description = str.capitalize(
            self.description
        )  # description be capitalized
        self.ref_code = "".join(
            random.choices(string.ascii_uppercase + string.digits, k=10)
        )
        super(Car, self).save(*args, **kwargs)

    @property
    def final_car_price(self):
        tax_percentage = self.tax
        car_price = self.price
        tax_amount = round(tax_percentage * car_price, 2)
        price_after_tax = float(round(car_price + tax_amount, 2))
        return price_after_tax


class CarViews(TimeStampedUUIDModel):
    ip = models.CharField(verbose_name=_("IP Address"), max_length=250)
    car = models.ForeignKey(
        Car, related_name="car_views", on_delete=models.CASCADE
    )

    def __str__(self):
        return (
            f"Total views on - {self.car.title} is - {self.car.views} view(s)"
        )

    class Meta:
        verbose_name = "Total Views on car"
        verbose_name_plural = "Total car Views"
