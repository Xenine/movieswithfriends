import os 
from celery import Celery
from celery.schedules import crontab
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movieswithfriends.settings')
django.setup()

app = Celery('movieswithfriends')

app.config_from_object('django.conf:settings', namespace="CELERY")
app.autodiscover_tasks()

from core.tasks import get_new_films_from_kp, get_top10_to_cache

@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(minute=0, hour=2),
        get_new_films_from_kp.s()
    )
    sender.add_periodic_task(
        crontab(minute=30, hour=2),
        get_top10_to_cache.s()
    )




