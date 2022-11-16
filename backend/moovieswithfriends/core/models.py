from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.utils import timezone
from model_utils.managers import QueryManager


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
    telegram_username = models.CharField(max_length=64, null=True)
    is_admin = models.BooleanField(default=False)

    objects = MFUserManager()
    
    USERNAME_FIELD = "telegram_uid"

    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.id} {self.telegram_uid}"

    def is_staff(self):
        "Is the user a member of staff?"
        return self.is_admin