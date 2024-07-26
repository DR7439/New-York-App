# Generated by Django 5.0.7 on 2024-07-26 14:17

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('zones', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Search',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('date_search_made_on', models.DateField()),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female'), ('B', 'Both')], max_length=1)),
                ('target_age', models.ManyToManyField(to='zones.agecategory')),
                ('target_market_interests', models.ManyToManyField(to='zones.interest')),
            ],
        ),
    ]
