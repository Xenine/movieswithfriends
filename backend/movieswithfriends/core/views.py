from django.contrib.auth import login, logout
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from core.models import MFUser
from django_telegram_login.authentication import verify_telegram_authentication
from django_telegram_login.errors import NotTelegramDataError
from movieswithfriends import settings


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            verify_telegram_authentication(bot_token=settings.TELEGRAM_TOKEN, request_data=request.data)
        except NotTelegramDataError as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

        user, created = MFUser.objects.update_or_create(
            telegram_uid=request.data["id"],
            first_name=request.data.get("first_name"),
            second_name=request.data.get("last_name"),
            telegram_username=request.data.get("username"),
        )

        login(request, user)

        return Response()
