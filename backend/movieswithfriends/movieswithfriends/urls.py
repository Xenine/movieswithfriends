from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from core.views import LoginView, MFUserViewSet, MovieViewSet, RefreshToken, ReviewViewSet, FriendshipViewSet

router = DefaultRouter()
router.register("movies", MovieViewSet, basename="movies")
router.register("users", MFUserViewSet, basename="users")
router.register("review", ReviewViewSet, basename="review")
router.register("friends", FriendshipViewSet, basename="friends")

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/login", LoginView.as_view(), name="login"),
    path("api/refresh", RefreshToken.as_view(), name="refresh"),
    path("api/", include(router.urls)),
]
