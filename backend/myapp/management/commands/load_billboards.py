# your_app/management/commands/load_billboards.py
from django.core.management.base import BaseCommand
import pandas as pd
from myapp.models import Zone, Billboard

class Command(BaseCommand):
    help = 'Load billboards from CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='The path to the CSV file to load data from')

    def handle(self, *args, **kwargs):
        file_path = kwargs['csv_file']
        data = pd.read_csv(file_path)

        for _, row in data.iterrows():
            try:
                zone = Zone.objects.get(id=row['zone_id'])
                billboard = Billboard(
                    street_name=row['street_name'],
                    sign_illumination=row['sign_illumination'],
                    sign_sq_footage=row['sign_sq_footage'],
                    latitude=row['Latitude'],
                    longitude=row['Longitude'],
                    zone=zone
                )
                billboard.save()
                self.stdout.write(self.style.SUCCESS(f'Successfully added billboard at {row["street_name"]}'))
            except Zone.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'Zone with id {row["zone_id"]} does not exist'))
