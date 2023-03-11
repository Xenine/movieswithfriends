from celery import shared_task
import requests
from django.conf import settings
from django.core.cache import cache
from django.db import transaction
from core.models import Movie



@shared_task
def get_new_films_from_kp():
    limit = 1000
    token = settings.KINOPOISK_TOKEN
    response = requests.get(f'https://api.kinopoisk.dev/v1/movie?selectFields=id&rating.kp=1-10&poster.url=%21null&page=1&limit={limit}&token={token}')

    pages = response.json()["pages"]
    print(pages)

    for page_number in range(1, pages + 1):
        response = requests.get( f'https://api.kinopoisk.dev/v1/movie?selectFields=id&selectFields=name&selectFields=alternativeName&selectFields=typeNumber&selectFields=year&selectFields=description&selectFields=rating&selectFields=movieLength&selectFields=poster&selectFields=externalId&rating.kp=1-10&poster.url=%21null&page={page_number}&limit={limit}&token={token}')
        movies_list = response.json()['docs']
        print(page_number)
        with transaction.atomic():
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
                
                movie, created = Movie.objects.update_or_create(kp_id=movie_json['id'], defaults={'name': name, 
                                                                                 'alternative_name': movie_json.get("alternativeName"), 
                                                                                 'year': movie_json.get('year'), 
                                                                                 'movie_length': movie_json.get('movieLength'), 
                                                                                 'type': movie_type, 
                                                                                 'imdb_id': imdb_id, 
                                                                                 'poster_url': poster_url,
                                                                                 'preview_url': preview_url,
                                                                                 'kp_rating': kp_rating,
                                                                                 'imdb_rating': imdb_rating,})
                if created:
                    print('Добавлено: ' + str(movie))
    


@shared_task
def get_top10_to_cache():
    token = settings.KINOPOISK_TOKEN
    try:
        response = requests.get(f'https://api.kinopoisk.dev/v1/movie?selectFields=id&top10=%21null&sortField=top10&sortType=-1&page=1&limit=10&token={token}')
        top10 =  [movie.id for movie in response.json()['docs']]
        print(top10)
        cache.set('top10', top10, 60*60*48)
    except:
        cache.touch('top10', 60*60*48)
        print("error in get_top10")