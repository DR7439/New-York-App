# your_app/management/commands/load_billboards.py
from django.core.management.base import BaseCommand
import pandas as pd
from myapp.models import Zone, Billboard

class Command(BaseCommand):
    help = 'Load billboards from CSV file'

    def handle(self, *args, **kwargs):
        file_path = '/mnt/data/no_text_signs_df.csv'
        data = pd.read_csv(file_path)

        for _, row in data.iterrows():
            try:
                zone = Zone.objects.get(id=row['zone_id'])
                billboard = Billboard(
                    street_name=row['street_name'],
                    sign_illumination=row['sign_illumination'],
                    sign_sq_footage=row['sign_sq_footage'],
                    latitude=row['latitude'],
                    longitude=row['longitude'],
                    zone=zone
                )
                billboard.save()
                self.stdout.write(self.style.SUCCESS(f'Successfully added billboard at {row["street_name"]}'))
            except Zone.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'Zone with id {row["zone_id"]} does not exist'))
