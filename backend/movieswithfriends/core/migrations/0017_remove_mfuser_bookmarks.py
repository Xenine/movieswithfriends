# Generated by Django 4.1.6 on 2023-03-05 22:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0016_mfuser_only_friends_reviews'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='mfuser',
            name='bookmarks',
        ),
    ]
