# Generated by Django 4.1.6 on 2023-02-09 00:17

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0011_friendship_mfuser_friends'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='mfuser',
            name='friends',
        ),
        migrations.AlterField(
            model_name='friendship',
            name='receiver',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='receiver', to=settings.AUTH_USER_MODEL),
        ),
    ]