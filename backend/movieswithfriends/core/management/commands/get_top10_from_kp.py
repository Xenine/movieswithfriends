from django.core.management import BaseCommand
import requests
from django.conf import settings
from django.core.cache import cache



class Command(BaseCommand):
    def handle(self, *args, **options):
        token = settings.KINOPOISK_TOKEN
        try:
            response = requests.get(f'https://api.kinopoisk.dev/v1/movie?selectFields=id&top10=%21null&sortField=top10&sortType=-1&page=1&limit=10&token={token}')
            print(response.json()['docs'])
            top10 = [movie['id'] for movie in response.json()['docs']]
            cache.set('top10', top10, 60*60*48)
        except:
            cache.touch('top10', 60*60*48)
            print("error in get_top10")
