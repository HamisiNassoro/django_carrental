from __future__ import absolute_import

import os

from celery import Celery
from car_rental.settings import base

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "car_rental.settings.development")

##naming celery app (i.e) can change it to any name you want
app = Celery("car_rental")

##read some config from django settings and the namespace makes the celery config have the celery prefix
app.config_from_object("car_rental.settings.development", namespace="CELERY"),

##load tasks in django app
app.autodiscover_tasks(lambda: base.INSTALLED_APPS)