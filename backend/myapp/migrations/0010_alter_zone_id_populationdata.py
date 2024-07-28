# Generated by Django 5.0.6 on 2024-07-02 14:16

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0009_alter_demographic_unique_together_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='zone',
            name='id',
            field=models.IntegerField(primary_key=True, serialize=False),
        ),
        migrations.CreateModel(
            name='PopulationData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('population', models.IntegerField()),
                ('age_category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.agecategory')),
                ('zone', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.zone')),
            ],
            options={
                'unique_together': {('zone', 'age_category')},
            },
        ),
    ]