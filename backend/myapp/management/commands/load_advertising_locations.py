from django.core.management.base import BaseCommand
import pandas as pd
from myapp.models import Zone, AdvertisingLocation

class Command(BaseCommand):
    help = 'Load advertising locations from CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='The path to the CSV file to load data from')

    def handle(self, *args, **kwargs):
        file_path = kwargs['csv_file']
        data = pd.read_csv(file_path)

        for _, row in data.iterrows():
            try:
                zone = Zone.objects.get(id=row['zone_id'])
                advertising_location, created = AdvertisingLocation.objects.get_or_create(
                    latitude=row['properties.lat'],
                    longitude=row['properties.lng'],
                    zone=zone,
                    defaults={
                        'location': row['properties.location'][:255],  # Truncate if necessary
                        'format': row['properties.format'][:255],  # Truncate if necessary
                        'category_alias': row['properties.categoryAlias'][:255],  # Truncate if necessary
                        'market': row['properties.market'][:255],  # Truncate if necessary
                        'size': row['properties.size'][:255],  # Truncate if necessary
                        'design_template_url': row['properties.designTemplateUrl'][:255],  # Truncate if necessary
                        'description': row['properties.description'][:255],  # Truncate if necessary
                        'calculated_cpm': row['properties.display.calculatedCpm'],  # Assuming this is a float
                        'views': row['properties.display.views'],
                        'cost_per_day': row['cost-per-day'],
                        'numbers_total': row['properties.numbers.total'],
                        'property_id': row['property_id'],  # New field
                        'photo_url': row['photo_url']  # New field
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Successfully added advertising location at {row["properties.location"]}'))
                else:
                    self.stdout.write(self.style.WARNING(f'Advertising location at {row["properties.location"]} already exists'))
            except Zone.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'Zone with id {row["zone_id"]} does not exist'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error processing row: {row}\nError: {e}'))
