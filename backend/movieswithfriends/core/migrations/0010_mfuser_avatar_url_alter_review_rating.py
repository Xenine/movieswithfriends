# Generated by Django 4.1.3 on 2023-01-28 02:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_movie_trailer_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='mfuser',
            name='avatar_url',
            field=models.SlugField(blank=True, max_length=128, null=True),
        ),
        migrations.AlterField(
            model_name='review',
            name='rating',
            field=models.PositiveSmallIntegerField(default=None),
            preserve_default=False,
        ),
    ]
