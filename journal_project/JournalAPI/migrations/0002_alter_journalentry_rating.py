# Generated by Django 5.0 on 2023-12-23 01:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('JournalAPI', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='journalentry',
            name='rating',
            field=models.IntegerField(choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6), (7, 7), (8, 8), (9, 9), (10, 10)]),
        ),
    ]
