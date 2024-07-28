# Generated by Django 5.0.7 on 2024-07-26 15:19

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('analytics', '0001_initial'),
        ('search', '0001_initial'),
        ('zones', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='demographic',
            name='search',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='search.search'),
        ),
        migrations.AddField(
            model_name='demographic',
            name='zone',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='zones.zone'),
        ),
        migrations.AlterUniqueTogether(
            name='busyness',
            unique_together={('datetime', 'zone')},
        ),
        migrations.AlterUniqueTogether(
            name='demographic',
            unique_together={('zone', 'search')},
        ),
    ]
