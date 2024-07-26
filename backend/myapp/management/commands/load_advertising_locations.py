from django.core.management.base import BaseCommand
import pandas as pd
from zones.models import Zone, AdvertisingLocation

class Command(BaseCommand):
    help = 'Load advertising locations from CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='The path to the CSV file to load data from')

    def handle(self, *args, **kwargs):
        file_path = kwargs['csv_file']
        data = pd.read_csv(file_path)

        for _, row in data.iterrows():
            try:
                zone = Zone.objects.get(id=int(row['zone_id']))
                advertising_location, created = AdvertisingLocation.objects.get_or_create(
                    latitude=float(row['properties.lat']),
                    longitude=float(row['properties.lng']),
                    zone=zone,
                    defaults={
                        'location': str(row['properties.location'])[:255],  # Truncate if necessary
                        'format': str(row['properties.format'])[:255],  # Truncate if necessary
                        'category_alias': str(row['properties.categoryAlias'])[:255],  # Truncate if necessary
                        'market': str(row['properties.market'])[:255],  # Truncate if necessary
                        'size': str(row['properties.size'])[:255],  # Truncate if necessary
                        'design_template_url': str(row['properties.designTemplateUrl'])[:255],  # Truncate if necessary
                        'description': str(row['properties.description'])[:255],  # Truncate if necessary
                        'calculated_cpm': float(row['properties.display.calculatedCpm']),
                        'views': int(row['properties.display.views']),
                        'cost_per_day': float(row['cost-per-day']),
                        'numbers_total': int(row['properties.numbers.total']),
                        'property_id': int(row['properties.sellingCompanyId']),
                        'photo_url': str(row['photo_url'])
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
