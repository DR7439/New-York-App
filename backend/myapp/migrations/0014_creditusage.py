# Generated by Django 5.0.6 on 2024-07-14 14:24

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0013_customuser_budget_customuser_business_description_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='CreditUsage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_used', models.DateTimeField(auto_now_add=True)),
                ('credits_used', models.IntegerField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]