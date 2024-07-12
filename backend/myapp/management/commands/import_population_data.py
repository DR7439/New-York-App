import os
import pandas as pd
from django.core.management.base import BaseCommand
from myapp.models import Zone, AgeCategory, PopulationData

class Command(BaseCommand):
    help = 'Import population data from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='The path to the CSV file')

    def handle(self, *args, **kwargs):
        csv_file = kwargs['csv_file']
        if not os.path.exists(csv_file):
            self.stdout.write(self.style.ERROR(f'File "{csv_file}" does not exist'))
            return

        # Read the CSV file
        df = pd.read_csv(csv_file)

        # Get age categories
        age_categories = AgeCategory.objects.all()
        age_category_map = {ac.age_range: ac for ac in age_categories}

        # Iterate over each row in the dataframe
        for _, row in df.iterrows():
            age_range = row['label_(grouping)'].strip()
            if age_range not in age_category_map:
                self.stdout.write(self.style.WARNING(f'Age category "{age_range}" not found in database'))
                continue

            age_category = age_category_map[age_range]

            for col in df.columns:
                if col.startswith('location_'):
                    zone_id = int(col.split('_')[1])
                    population = row[col]

                    if population == 0:
                        continue

                    try:
                        zone = Zone.objects.get(id=zone_id)
                    except Zone.DoesNotExist:
                        self.stdout.write(self.style.WARNING(f'Zone with id "{zone_id}" not found in database'))
                        continue

                    # Create or update PopulationData
                    PopulationData.objects.update_or_create(
                        zone=zone,
                        age_category=age_category,
                        defaults={'population': population}
                    )

        self.stdout.write(self.style.SUCCESS('Population data imported successfully'))
