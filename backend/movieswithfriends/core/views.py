import random
import datetime
import jwt
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.core.cache import cache

from rest_framework import permissions, status, viewsets, views, exceptions, mixins
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from friendship.models import Friend

from core.models import Bookmark, MFUser, Movie, Review
from core.serializers import MFUserInfoSerializer, MFUserWriteSerializer, MFUserReadSerializer, MovieReadSerializer, MovieReviewIncludedReadSerializer, ReviewReadSerializer, ReviewWriteSerializer, MFUserSmallReadSerializer
from django_telegram_login.authentication import verify_telegram_authentication
from django_telegram_login.errors import NotTelegramDataError
from django.conf import settings
from .utils import generate_access_token, generate_refresh_token

from friendship.models import Friend, FriendshipRequest


@method_decorator(ensure_csrf_cookie, name='dispatch')
class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            verify_telegram_authentication(bot_token=settings.TELEGRAM_TOKEN, request_data=request.data)
        except NotTelegramDataError as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

        user, _ = MFUser.objects.update_or_create(
            telegram_uid=request.data["id"],
            defaults=dict(first_name=request.data.get("first_name"), second_name=request.data.get("last_name"), 
                          telegram_username=request.data.get("username"), avatar_url=request.data.get("photo_url"),)
        )
        response = Response()

        # login(request, user)
        serialized_user = MFUserReadSerializer(user).data
        access_token = generate_access_token(user)
        refresh_token = generate_refresh_token(user)

        response.set_cookie(key='refreshtoken', value=refresh_token, httponly=True, samesite='none', secure=True)
        response.data = {
            'access_token': access_token,
            'user': serialized_user,
        }

        return response


class RefreshToken(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refreshtoken')
        if refresh_token is None:
            raise exceptions.AuthenticationFailed('Authentication credentials were not provided! (in view)')
        try:
            payload = jwt.decode(refresh_token, settings.REFRESH_TOKEN_SECRET, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Expired refresh token, please login again. (in view)')

        user = MFUser.objects.filter(telegram_uid=payload.get('telegram_uid')).first()
        if user is None:
            raise exceptions.PermissionDenied('User not found! (in view)')

        if not user.is_active:
            raise exceptions.PermissionDenied('User is inactive! (in view)')

        access_token = generate_access_token(user)
        serialized_user = MFUserReadSerializer(user).data
        response = Response()
        response.data = {
            'access_token': access_token,
            'user': serialized_user,
        }

        return response


class MFUserViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [SearchFilter]
    search_fields = ['^telegram_username']

    def get_queryset(self):
        if self.action in ["partial_update", "update"]:
            if self.request.user.pk != int(self.kwargs['pk']):
                return MFUser.objects.none()
            qs = MFUser.objects.filter(pk=self.kwargs['pk'])
            return qs
        
        elif self.action in ["bookmarks"]:
            friends_and_himself_qs = MFUser.objects.none()
            if self.request.user:
                friends_and_himself_qs = Friend.objects.friends(self.request.user) | MFUser.objects.get(pk=self.request.user)
            qs = MFUser.objects.filter(public_bookmarks=True) | friends_and_himself_qs 

            return qs
        
        elif self.action in ["reviews"]:
            friends_and_himself_qs = MFUser.objects.none()
            if self.request.user:
                friends_and_himself_qs = Friend.objects.friends(self.request.user) | MFUser.objects.get(pk=self.request.user)
            qs = MFUser.objects.filter(public_reviews=True) | friends_and_himself_qs

            return qs
        
        else: 
            return MFUser.objects.all()

    def get_serializer_class(self):
        if self.action in ["list"]:
            return MFUserSmallReadSerializer
        elif self.action in ["retrieve"]:
            return MFUserInfoSerializer
        elif self.action in ["partial_update", "update"]:
            return MFUserWriteSerializer
        elif self.action in ["bookmarks"]:
            return MovieReadSerializer
        elif self.action in ["reviews"]:
            return ReviewReadSerializer
        
    def get_pagination_class(self):
        if self.action in ["bookmarks", "reviews"]:
            return LimitOffsetPagination
        else:
            return None
    
    pagination_class = property(fget=get_pagination_class)
        
    @action(detail=True, methods=["get"])
    def bookmarks(self, request, pk=None):
        user = MFUser.objects.get(pk=pk)
        bookmarks = Bookmark.objects.select_related('movie').filter(user=user).order_by('-created_at')
        movies = [b.movie for b in bookmarks]
        page = self.paginate_queryset(movies)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)
        

    @action(detail=True, methods=["get"])
    def reviews(self, request, pk=None):
        user = MFUser.objects.get(pk=pk)
        qs = Review.objects.filter(author=user).order_by("-created_at")
        page = self.paginate_queryset(qs)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)


class MovieViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = MovieReadSerializer
    queryset = Movie.objects.all().order_by('-kp_rating')
    filter_backends = [SearchFilter]
    search_fields = ['name']

    def get_serializer_class(self):
        if self.action in ['retrieve'] and self.request.user.is_authenticated:
            return MovieReviewIncludedReadSerializer
        else:
            return MovieReadSerializer
        
    @action(detail=False, methods=['get'])
    def top10(self, request):
        id_list = cache.get('top10')
        qs = Movie.objects.filter(kp_id__in=id_list)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
            

    @action(detail=False, methods=['get'])
    def latest(self, request):
        latest_movies = Movie.objects.filter(type=1).order_by('-kp_id')[:10]
        serializer = self.get_serializer(latest_movies, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    
    @action(detail=False, methods=['get'])
    def recomended(self, request):
        random.seed(datetime.datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0).timestamp())
        best_movies = Movie.objects.filter(type=1, kp_rating__gte=8)
        recomended_movies = random.sample(list(best_movies), k=10)
        serializer = self.get_serializer(recomended_movies, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def add_bookmark(self, request, pk=None):
        try:
            movie = Movie.objects.get(pk=pk)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        request.user.bookmarks.add(movie)
        return Response(status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def remove_bookmark(self, request, pk=None):
        try:
            movie = Movie.objects.get(pk=pk)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        request.user.bookmarks.remove(movie)
        return Response(status=status.HTTP_201_CREATED)


class ReviewViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Review.objects.all().order_by('-created_at')

    def get_queryset(self):
        if self.action in ["list", "retrieve"]:
            friends_qs = Friend.objects.friends(self.request.user)
            return Review.objects.filter(author__in=friends_qs).order_by('-created_at')
        
        if self.action in ["update", "partial_update", "destroy"]:
            return Review.objects.filter(author=self.request.user)
        
        return Review.objects.all().order_by('-created_at')

    def get_serializer_class(self):
        if self.action in ["list",  "retrieve"]:
            return ReviewReadSerializer
        else:
            return ReviewWriteSerializer
        

class FriendshipViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    @action(detail=True, methods=['post'])
    def add_friend(self, request, pk=None):
        try:
            other_user = MFUser.objects.get(id=pk)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        Friend.objects.add_friend(
            request.user,
            other_user
        )
        return Response(MFUserSmallReadSerializer(other_user).data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        try:
            other_user = MFUser.objects.get(id=pk)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        friend_request = FriendshipRequest.objects.get(from_user=other_user, to_user=request.user)
        friend_request.accept()
        return Response(status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'])
    def delete_friend(self, request, pk=None):
        try:
            other_user = MFUser.objects.get(id=pk)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        deleted = Friend.objects.remove_friend(request.user, other_user)

        if deleted:
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=True, methods=['delete'])
    def delete_request(self, request, pk=None):
        try:
            other_user = MFUser.objects.get(id=pk)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        friend_request = FriendshipRequest.objects.get(from_user=request.user, to_user=other_user)
        friend_request.cancel()
        return Response(status=status.HTTP_200_OK)
