from django.core.management import BaseCommand
import requests
import logging

from core.models import Movie

# logger = logging.getLogger(__name__)

class Command(BaseCommand):
    def handle(self, *args, **options):
        response = requests.get('https://api.kinopoisk.dev/movie?field=rating.kp&search=7-10&field=typeNumber&search=1&limit=1&token=ZQQ8GMN-TN54SGK-NB3MKEC-ZKB8V06')
        print(response.text)
        json = response.json()['docs']
        # print(response.json())
        print(json[0].get('id'))
        print(json[0]['externalId'].get('imdb'),)
        movie_type = 1
        if json[0]['type'] == "movie":
            movie_type = 1
        else:
            movie_type = 2


        movie, created = Movie.objects.update_or_create(
            kp_id = json[0]['id'],
            defaults = dict(
                name = json[0]['name'], 
                type = movie_type,
                year = json[0]['year'],
                imbd_id = json[0]['externalId'].get('imdb'),
                poster_url = json[0]['poster'].get('previewUrl'),
                description = json[0].get('description'),
                kp_rating = json[0].get('rating').get('kp'),
            )
        )
