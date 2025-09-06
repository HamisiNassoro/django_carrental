from __future__ import absolute_import, unicode_literals

# Temporarily commented out due to missing Celery module
# from .celery import app as celery_app

##make sure that the app is always imported when django starts...
##...such that shared tasks will always use this app
# __all__ = ("celery_app",)
__all__ = ()
