# Generated by Django 4.1.3 on 2022-11-24 10:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_movie'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mfuser',
            name='telegram_username',
            field=models.CharField(blank=True, max_length=64, null=True),
        ),
    ]
