# Generated by Django 5.0.6 on 2024-06-24 16:14

from django.db import migrations, models
import datetime

class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0007_remove_search_target_market_interests_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='search',
            name='date_of_advertising',
        ),
        migrations.AddField(
            model_name='search',
            name='end_date',
            field=models.DateField(default=datetime.date.today),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='search',
            name='start_date',
            field=models.DateField(default=datetime.date.today),
            preserve_default=False,
        ),
    ]
