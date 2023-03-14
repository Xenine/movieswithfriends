from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault, HiddenField
from core.models import MFUser, Movie, Review


class MFUserSmallReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = MFUser
        fields = ["id", "first_name", "second_name", "telegram_username", "avatar_url"]


class MFUserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MFUser
        fields = ["id", "first_name", "second_name", "telegram_username", "avatar_url", "public_reviews", "public_bookmarks", "only_friends_reviews"]


class MFUserReadSerializer(serializers.ModelSerializer):
    friend_requests = MFUserSmallReadSerializer(many=True)
    added_friends = MFUserSmallReadSerializer(many=True)
    class Meta:
        model = MFUser
        fields = ["id", "first_name", "second_name", "telegram_username", "avatar_url", "added_friends", "friend_requests"]


class MFUserWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = MFUser
        fields = ["first_name", "second_name", "public_reviews", "public_bookmarks", "only_friends_reviews"]


class MovieReadSerializer(serializers.ModelSerializer):
    type = serializers.ChoiceField(choices=Movie.TYPE_CHOICES)
    class Meta:
        model = Movie
        fields = ["id", "kp_id", "name", "alternative_name", "type", "year", "imdb_id", "poster_url", "preview_url", "description", "kp_rating", "imdb_rating", "movie_length"]


class MovieReviewIncludedReadSerializer(serializers.ModelSerializer):
    type = serializers.ChoiceField(choices=Movie.TYPE_CHOICES)
    is_in_bookmarks = serializers.SerializerMethodField()
    review = serializers.SerializerMethodField()

    def get_is_in_bookmarks(self, obj: Movie):
        request = self.context["request"]
        return request.user.bookmarks.contains(obj)
    
    def get_review(self, obj: Movie):
        request = self.context["request"]
        qs = Review.objects.filter(author=request.user, movie=obj)
        if qs.exists:
            return ReviewSmallReadSerializer(qs.first()).data
        else:
            return dict()

    class Meta:
        model = Movie
        fields = ["id", "kp_id", "name", "alternative_name", "type", "year", "imdb_id", "poster_url", "preview_url", "description", "kp_rating", "imdb_rating", "movie_length", "is_in_bookmarks", "review"]


class ReviewSmallReadSerializer(serializers.ModelSerializer):

    class Meta:
        model = Review
        fields = ["id", "text", "rating"]


class ReviewReadSerializer(serializers.ModelSerializer):
    author = MFUserSmallReadSerializer()
    movie = MovieReadSerializer()
    class Meta:
        model = Review
        fields = ["movie", "author", "text", "rating"]


class ReviewWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["id", "movie", "author", "text", "rating"]

    author = HiddenField(default=CurrentUserDefault())

    
class AddFriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = MFUser
        fields = ['telegram_username']
