from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.utils import timezone
from model_utils.managers import QueryManager
from django.conf import settings

from friendship.models import Friend

class ParanoidModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=False)
    deleted_at = models.DateTimeField(blank=True, null=True, default=None, editable=False)
    objects = QueryManager(deleted_at__isnull=True)
    objects_with_deleted = models.Manager()

    class Meta:
        abstract = True

    def delete(self, hard=False, **kwargs):
        if hard:
            super(ParanoidModel, self).delete
        else:
            self.deleted_at = timezone.now()
            self.save()


class MFUserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, telegram_uid, password, **extra_fields):
        if not telegram_uid:
            raise ValueError("Telegram_uid must be set")
        user = self.model(telegram_uid=telegram_uid, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_user(self, telegram_uid, password, **extra_fields):
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(telegram_uid, password, **extra_fields)

    def create_superuser(self, telegram_uid, password, **extra_fields):
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        
        return self._create_user(telegram_uid, password, **extra_fields)


class MFUser(AbstractBaseUser, PermissionsMixin, ParanoidModel):
    telegram_uid = models.PositiveBigIntegerField(unique=True)
    first_name = models.CharField(max_length=120, blank=True, null=True)
    second_name = models.CharField(max_length=120, blank=True, null=True)
    telegram_username = models.CharField(max_length=64, blank=True, null=True)
    is_admin = models.BooleanField(default=False)
    avatar_url = models.SlugField(max_length=128, blank=True, null=True)
    bookmarks = models.ManyToManyField("Movie", through="Bookmark")
    public_reviews = models.BooleanField(default=False)
    public_bookmarks = models.BooleanField(default=False)
    only_friends_reviews = models.BooleanField(default=False)

    objects = MFUserManager()
    
    USERNAME_FIELD = "telegram_uid"

    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.id} {self.first_name} {self.second_name} {self.telegram_username}"

    def is_staff(self):
        "Is the user a member of staff?"
        return self.is_admin

    def is_active(self):
        return not self.deleted_at

    @property
    def added_friends(self):
        qs = Friend.objects.select_related("from_user").filter(to_user=self)
        users = [u.from_user for u in qs]
        return users
    
    @property
    def friend_requests(self):
        qs = Friend.objects.unrejected_requests(user=self)
        users = [u.from_user for u in qs]
        return users
    

class Bookmark(models.Model):
    user = models.ForeignKey("MFUser", on_delete=models.CASCADE)
    movie = models.ForeignKey("Movie", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)


class Movie(ParanoidModel):
    TYPE_CHOICES = (
        (1, "Фильм"),
        (2, "Сериал"),
        (3, "Мультик"),
        (4, "Аниме"),
        (5, "Мульт-сериал"),
        (6, "ТВ-шоу"),
    )
    kp_id = models.PositiveIntegerField(unique=True)
    name = models.CharField(max_length=128)
    alternative_name = models.CharField(max_length=128, blank=True, null=True)
    type = models.CharField(choices=TYPE_CHOICES, max_length=1)
    year = models.PositiveSmallIntegerField(blank=True, null=True)
    imdb_id = models.CharField(max_length=128, blank=True, null=True)
    poster_url = models.SlugField(max_length=128, blank=True, null=True)
    preview_url = models.SlugField(max_length=128, blank=True, null=True)
    description = models.TextField(max_length=128, blank=True, null=True)
    kp_rating = models.DecimalField(max_digits=5, decimal_places=3, blank=True, null=True)
    imdb_rating = models.DecimalField(max_digits=5, decimal_places=3, blank=True, null=True)
    movie_length = models.PositiveSmallIntegerField(blank=True, null=True)
    trailer_url = models.SlugField(max_length=256, blank=True, null=True)

    def __str__(self):
        return f'{self.name}'
    
    
class Review(ParanoidModel):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField(max_length=1024)
    rating = models.PositiveSmallIntegerField()
