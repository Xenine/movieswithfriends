from django import forms
from django.contrib import admin
from core.models import MFUser, Movie, Review
from django.contrib.auth.forms import ReadOnlyPasswordHashField

from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


class UserChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    disabled password hash display field.
    """
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = MFUser
        fields = ('telegram_uid', 'password', 'first_name', 'second_name', 'telegram_username', 'is_admin')

class UserAdmin(BaseUserAdmin):
    # form = UserChangeForm
    list_display = ('telegram_uid', 'is_admin')
    list_filter = ('is_admin',)
    ordering = ('first_name',)
    fieldsets = (
        (None, {'fields': ('telegram_uid', 'first_name', 'second_name', 'telegram_username')}),
        # ('Paranoid', {'fields': ('created_at', 'updated_at', 'deleted_at')}),
        ('Permissions', {'fields': ('is_admin',)}),
    )

admin.site.register(MFUser, UserAdmin)
admin.site.register(Movie)
admin.site.register(Review)
