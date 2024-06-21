from django.db import migrations, models

def create_age_categories(apps, schema_editor):
    AgeCategory = apps.get_model('myapp', 'AgeCategory')
    age_ranges = [
        "Under 5 years", "5 to 9 years", "10 to 14 years", "15 to 19 years",
        "20 to 24 years", "25 to 29 years", "30 to 34 years", "35 to 39 years",
        "40 to 44 years", "45 to 49 years", "50 to 54 years", "55 to 59 years",
        "60 to 64 years", "65 to 69 years", "70 to 74 years", "75 to 79 years",
        "80 to 84 years", "85 years and over"
    ]
    for age_range in age_ranges:
        AgeCategory.objects.create(age_range=age_range)

class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0002_zone_search_demographic_busyness'),
    ]

    operations = [
        migrations.CreateModel(
            name='AgeCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('age_range', models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='search',
            name='max_age',
        ),
        migrations.RemoveField(
            model_name='search',
            name='min_age',
        ),
        migrations.AddField(
            model_name='search',
            name='target_age',
            field=models.ManyToManyField(to='myapp.AgeCategory'),
        ),
        migrations.RunPython(create_age_categories),
    ]
