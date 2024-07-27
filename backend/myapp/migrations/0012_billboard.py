# Generated by Django 5.0.6 on 2024-07-10 10:39

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0011_interestzonecount'),
    ]

    operations = [
        migrations.CreateModel(
            name='Billboard',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('street_name', models.CharField(max_length=255)),
                ('sign_illumination', models.CharField(max_length=255)),
                ('sign_sq_footage', models.FloatField()),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
                ('zone', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.zone')),
            ],
        ),
    ]