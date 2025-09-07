import uuid

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.gis.db import models
from django.utils import timezone
from django.utils.translation import \
    gettext_lazy as _  # #for translation of all our strings

from apps.common.models import TimeStampedUUIDModel
from .managers import CustomUserManager


class UserLocation(TimeStampedUUIDModel):
    """Model to track user's current location for location-based car discovery"""
    
    user = models.OneToOneField(
        'users.User',  # Use string reference to avoid circular import
        on_delete=models.CASCADE,
        related_name='location',
        verbose_name=_("User")
    )
    
    location = models.PointField(
        verbose_name=_("Location"),
        null=True,
        blank=True,
        help_text="User's current geographical location (latitude, longitude)"
    )
    
    address = models.CharField(
        verbose_name=_("Address"),
        max_length=500,
        blank=True,
        null=True,
        help_text="User's current address"
    )
    
    city = models.CharField(
        verbose_name=_("City"),
        max_length=100,
        blank=True,
        null=True,
        help_text="User's current city"
    )
    
    state = models.CharField(
        verbose_name=_("State/Province"),
        max_length=100,
        blank=True,
        null=True,
        help_text="User's current state or province"
    )
    
    country = models.CharField(
        verbose_name=_("Country"),
        max_length=100,
        blank=True,
        null=True,
        help_text="User's current country"
    )
    
    last_updated = models.DateTimeField(
        verbose_name=_("Last Updated"),
        auto_now=True,
        help_text="When the location was last updated"
    )
    
    is_active = models.BooleanField(
        verbose_name=_("Location Active"),
        default=True,
        help_text="Whether this location is currently active"
    )
    
    class Meta:
        verbose_name = "User Location"
        verbose_name_plural = "User Locations"
        indexes = [
            models.Index(fields=['location']),
            models.Index(fields=['city', 'state']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f"{self.user.username}'s location in {self.city or 'Unknown'}"
    
    @property
    def coordinates(self):
        """Return coordinates as a tuple"""
        if self.location:
            return (self.location.y, self.location.x)  # PointField returns (longitude, latitude)
        return (None, None)
    
    @property
    def full_address(self):
        """Return full address string"""
        parts = [self.address, self.city, self.state, self.country]
        return ", ".join([part for part in parts if part])


class User(AbstractBaseUser, PermissionsMixin):
    pkid = models.BigAutoField(primary_key=True, editable=False)
    id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    username = models.CharField(verbose_name=_("Username"), max_length=255, unique=True)
    first_name = models.CharField(verbose_name=_("First Name"), max_length=50)
    last_name = models.CharField(verbose_name=_("Last Name"), max_length=50)
    email = models.EmailField(verbose_name=_("Email Address"), unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "first_name", "last_name"]

    objects = CustomUserManager()

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")

    def __str__(self):
        return self.username

    @property
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    def get_short_name(self):
        return self.username
