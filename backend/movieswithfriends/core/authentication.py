import jwt 
from rest_framework.authentication import BaseAuthentication, CSRFCheck
from rest_framework import exceptions
from django.conf import settings

from core.models import MFUser


class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):

        authorization_header = request.headers.get('Authorization')

        if not authorization_header:
            return None
        try:
            access_token = authorization_header.split(' ')[1]
            payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Access_token expired!')
        except IndexError:
            raise exceptions.AuthenticationFailed('Token prefix missing!')

        user = MFUser.objects_with_deleted.filter(telegram_uid=payload['telegram_uid']).first()
        if user is None:
            raise exceptions.PermissionDenied('User not found!')

        if not user.is_active:
            raise exceptions.PermissionDenied('User is deleted!')

        print(user)
        return (user, None)

    def enforce_csrf(self, request):
        check = CSRFCheck()
        check.process_request(request)
        reason = check.process_view(request, None, (), {})
        print(reason)
        if reason:
            raise exceptions.PermissionDenied('CSRF Failed: %s' % reason)
