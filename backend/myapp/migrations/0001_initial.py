# Generated by Django 5.0.7 on 2024-07-26 12:57

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AdvertisingLocation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('location', models.CharField(blank=True, max_length=255, null=True)),
                ('format', models.CharField(blank=True, max_length=255, null=True)),
                ('category_alias', models.CharField(blank=True, max_length=255, null=True)),
                ('market', models.CharField(blank=True, max_length=255, null=True)),
                ('size', models.CharField(blank=True, max_length=255, null=True)),
                ('design_template_url', models.URLField(blank=True, null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('calculated_cpm', models.FloatField(blank=True, null=True)),
                ('views', models.IntegerField(blank=True, null=True)),
                ('cost_per_day', models.FloatField(blank=True, null=True)),
                ('numbers_total', models.IntegerField(blank=True, null=True)),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
                ('property_id', models.CharField(blank=True, max_length=255, null=True)),
                ('photo_url', models.URLField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='AgeCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('age_range', models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Billboard',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('street_name', models.CharField(max_length=255)),
                ('sign_illumination', models.CharField(max_length=255)),
                ('sign_sq_footage', models.FloatField()),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='Busyness',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.DateTimeField()),
                ('busyness_score', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='Demographic',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='Interest',
            fields=[
                ('name', models.CharField(max_length=255, primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Zone',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('boundary_coordinates', models.JSONField()),
            ],
        ),
        migrations.CreateModel(
            name='InterestZoneCount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('count', models.IntegerField()),
                ('interest', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.interest')),
            ],
        ),
        migrations.CreateModel(
            name='PopulationData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('population', models.IntegerField()),
                ('age_category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.agecategory')),
            ],
        ),
        migrations.CreateModel(
            name='Search',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('date_search_made_on', models.DateField()),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female'), ('B', 'Both')], max_length=1)),
                ('target_age', models.ManyToManyField(to='myapp.agecategory')),
                ('target_market_interests', models.ManyToManyField(to='myapp.interest')),
            ],
        ),
    ]
