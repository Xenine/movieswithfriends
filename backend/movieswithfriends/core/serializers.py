from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault, HiddenField
from core.models import MFUser, Movie, Review


class MFUserWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = MFUser
        fields = ["first_name", "second_name", "avatar_url"]


class MFUserSmallReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = MFUser
        fields = ["id", "first_name", "second_name", "telegram_username", "avatar_url"]


class MFUserReadSerializer(serializers.ModelSerializer):
    friend_requests = MFUserSmallReadSerializer(many=True)
    added_friends = MFUserSmallReadSerializer(many=True)
    class Meta:
        model = MFUser
        fields = ["id", "first_name", "second_name", "telegram_username", "avatar_url", "added_friends", "friend_requests"]


class MovieReadSerializer(serializers.ModelSerializer):
    type = serializers.ChoiceField(choices=Movie.TYPE_CHOICES)
    class Meta:
        model = Movie
        fields = ["id", "kp_id", "name", "alternative_name", "type", "year", "imdb_id", "poster_url", "preview_url", "description", "kp_rating", "imdb_rating", "movie_length"]


class ReviewReadSerializer(serializers.ModelSerializer):
    author = MFUserSmallReadSerializer()
    movie = MovieReadSerializer()
    class Meta:
        model = Review
        fields = ["movie", "author", "text", "rating"]


class ReviewWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["movie", "author", "text", "rating"]

    author = HiddenField(default=CurrentUserDefault())

    
class AddFriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = MFUser
        fields = ['telegram_username']
