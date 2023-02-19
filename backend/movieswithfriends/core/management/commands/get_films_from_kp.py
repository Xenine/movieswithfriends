from django.core.management import BaseCommand
import requests
from django.conf import settings

from core.models import Movie


class Command(BaseCommand):
    def handle(self, *args, **options):
        limit = 700
        page = 1
        token = settings.KINOPOISK_TOKEN
        response = requests.get(f'https://api.kinopoisk.dev/movie?field=rating.kp&search=1-10&limit={limit}&page={page}&token={token}')
        print(response.text)
        pages = response.json()["pages"]
        for page_number in range(1, pages + 1):
            response = requests.get(f'https://api.kinopoisk.dev/movie?field=rating.kp&search=1-10&limit={limit}&page={page_number}&token={token}')
            json = response.json()['docs']
            movies_array = []
            for movie_number in range(len(json)):
                movie_json = json[movie_number]
                movie_type = movie_json['type']
                type = 0
                if movie_type == "movie":
                    type = 1
                elif movie_type == "tv-series":
                    type = 2
                elif movie_type == "cartoon":
                    type = 3
                elif movie_type == "anime":
                    type = 4
                elif movie_type == "animated-series":
                    type = 5
                else:
                    type = 6

                name = None
                poster_url = None
                preview_url = None
                imdb_id = None
                kp_rating = None
                imdb_rating = None

                if not movie_json.get('name'):
                    if not movie_json.get('alternativeName'):
                        continue
                    else:
                        name = movie_json.get('alternativeName')
                else:
                    name = movie_json['name']


                if movie_json.get('poster'):
                    poster_url = movie_json['poster'].get('url')
                    preview_url = movie_json['poster'].get('previewUrl')
               
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
                                type = type, 
                                imdb_id = imdb_id,
                                poster_url = poster_url,
                                preview_url = preview_url,
                                kp_rating = kp_rating,
                                imdb_rating = imdb_rating,
                                )

                movies_array.append(movie_obj)
            Movie.objects.bulk_create(movies_array)
            print(page_number) # 1 940386  # 2 79863
