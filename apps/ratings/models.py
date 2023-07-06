from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.common.models import TimeStampedUUIDModel
from apps.profiles.models import Profile
from car_rental.settings.base import AUTH_USER_MODEL

# Create your models here.


class Rating(TimeStampedUUIDModel):
    class Range(models.IntegerChoices):
        RATING_1 = 1, _("Poor")
        RATING_2 = 2, _("Fair")
        RATING_3 = 3, _("Good")
        RATING_4 = 4, _("Very Good")
        RATING_5 = 5, _("Excellent")

    rater = models.ForeignKey(
        AUTH_USER_MODEL,
        verbose_name=_("User providing the rating"),
        on_delete=models.SET_NULL,
        null=True,
    )
    car_owner = models.ForeignKey(
        Profile,
        verbose_name=_("User being rated"),
        related_name="car_owner_review",
        on_delete=models.SET_NULL,
        null=True,
    )
    rating = models.IntegerField(
        verbose_name=_("Rating"),
        choices=Range.choices,
        help_text="1=Poor, 2=Fair, 3=Good, 4=Very Good, 5=Excellent",
        default=0,
    )
    comment = models.TextField(verbose_name=_("Comment"))

    class Meta:
        unique_together = ["rater", "car_owner"]

    def __str__(self):
        return f"{self.car_owner} rated at {self.rating}"
