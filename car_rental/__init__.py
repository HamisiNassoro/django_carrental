from __future__ import absolute_import, unicode_literals

from .celery import app as celery_app

##make sure that the app is always imported when django starts...
##...such that shared tasks will always use this app
__all__ = ("celery_app",)
