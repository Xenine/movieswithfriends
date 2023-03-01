import random
import datetime
import jwt
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

from rest_framework import permissions, status, viewsets, views, exceptions, mixins
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from friendship.models import Friend

from core.models import MFUser, Movie, Review
from core.serializers import MFUserWriteSerializer, MFUserReadSerializer, MovieReadSerializer, ReviewReadSerializer, ReviewWriteSerializer, MFUserSmallReadSerializer
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


class MFUserViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None
    queryset = MFUser.objects.all()
    filter_backends = [SearchFilter]
    search_fields = ['^telegram_username']

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return MFUserSmallReadSerializer
        else:
            return MFUserWriteSerializer

class MovieViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = MovieReadSerializer
    queryset = Movie.objects.all().order_by('-kp_rating')
    filter_backends = [SearchFilter]
    search_fields = ['name']

    @action(detail=False, methods=['get'])
    def latest(self, request):
        latest_movies = Movie.objects.filter(type=1).order_by('-kp_id')[:10]

        return Response(MovieReadSerializer(latest_movies, many=True).data, status=status.HTTP_200_OK)

    
    @action(detail=False, methods=['get'])
    def recomended(self, request):
        random.seed(datetime.datetime.utcnow().date())
        best_movies = Movie.objects.filter(type=1, kp_rating__gte=8)
        recomended_movies = random.sample(list(best_movies), k=10)

        return Response(MovieReadSerializer(recomended_movies, many=True).data, status=status.HTTP_200_OK)


class ReviewViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Review.objects.all().order_by('-created_at')

    def get_queryset(self):
        if self.action in ["list"]:
            friends_qs = Friend.objects.friends(self.request.user)
            return Review.objects.filter(author__in=friends_qs).order_by('-created_at')
        
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
        if pk == None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
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
        if pk == None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            other_user = MFUser.objects.get(id=pk)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        friend_request = FriendshipRequest.objects.get(from_user=other_user, to_user=request.user)
        friend_request.accept()
        return Response(status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'])
    def delete_friend(self, request, pk=None):
        if pk == None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
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
        if pk == None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            other_user = MFUser.objects.get(id=pk)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        friend_request = FriendshipRequest.objects.get(from_user=request.user, to_user=other_user)
        friend_request.cancel()
        return Response(status=status.HTTP_200_OK)
