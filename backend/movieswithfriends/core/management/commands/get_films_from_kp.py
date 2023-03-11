from django.core.management import BaseCommand
import requests
from django.conf import settings

from core.models import Movie


class Command(BaseCommand):
    def handle(self, *args, **options):
        limit = 1000
        token = settings.KINOPOISK_TOKEN
        response = requests.get(f'https://api.kinopoisk.dev/v1/movie?selectFields=id&rating.kp=1-10&poster.url=%21null&page=1&limit={limit}&token={token}')
        pages = response.json()["pages"]
        for page_number in range(1, pages + 1):
            movies_array = []
            response = requests.get( f'https://api.kinopoisk.dev/v1/movie?selectFields=id&selectFields=name&selectFields=alternativeName&selectFields=typeNumber&selectFields=year&selectFields=description&selectFields=rating&selectFields=movieLength&selectFields=poster&selectFields=externalId&rating.kp=1-10&poster.url=%21null&page={page_number}&limit={limit}&token={token}')
            movies_list = response.json()['docs']
            for movie_number in range(len(movies_list)):
                movie_json = movies_list[movie_number]

                name = None
                imdb_id = None
                kp_rating = None
                imdb_rating = None

                movie_type = movie_json['typeNumber']
                poster_url = movie_json['poster'].get('url')
                preview_url = movie_json['poster'].get('previewUrl')

                if not movie_json.get('name'):
                    if not movie_json.get('alternativeName'):
                        continue
                    else:
                        name = movie_json.get('alternativeName')
                else:
                    name = movie_json['name']

                if movie_json.get('externalId'):
                    imdb_id = movie_json['externalId'].get('imdb')

                if movie_json.get('rating'):
                    kp_rating = movie_json['rating'].get('kp')
                    imdb_rating = movie_json['rating'].get('imdb')

                movie_obj = Movie(kp_id = movie_json['id'], 
                                name = name,
                                alternative_name = movie_json.get("alternativeName"),
                                description = movie_json.get('description'),
                                year = movie_json.get('year'), 
                                movie_length = movie_json.get('movieLength'), 
                                type = movie_type, 
                                imdb_id = imdb_id,
                                poster_url = poster_url,
                                preview_url = preview_url,
                                kp_rating = kp_rating,
                                imdb_rating = imdb_rating,
                                )
                movies_array.append(movie_obj)
            Movie.objects.bulk_create(movies_array)
            print(page_number) # Всего фильмов на кп: 940386  Мы добавляем: 77631
