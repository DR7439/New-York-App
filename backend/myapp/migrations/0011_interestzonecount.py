# Generated by Django 5.0.6 on 2024-07-09 09:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0010_alter_zone_id_populationdata'),
    ]

    operations = [
        migrations.CreateModel(
            name='InterestZoneCount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('count', models.IntegerField()),
                ('interest', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.interest')),
                ('zone', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.zone')),
            ],
            options={
                'unique_together': {('zone', 'interest')},
            },
        ),
    ]