import pandas as pd
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction
from zones.models import Zone
from analytics.models import Busyness
from model_data_2_0 import busyness_prediction

class Command(BaseCommand):
    help = 'Populates the Busyness table with pre-calculated scores from busyness_predictions.csv.'

    def handle(self, *args, **kwargs):
        # Configuration
        csv_file_path = 'model_data_2_0/busyness_predictions.csv'

        # Read busyness scores from CSV
        try:
            predictions = pd.read_csv(csv_file_path)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'CSV file not found at {csv_file_path}'))
            return
        except pd.errors.EmptyDataError:
            self.stdout.write(self.style.ERROR(f'CSV file at {csv_file_path} is empty'))
            return
        except pd.errors.ParserError:
            self.stdout.write(self.style.ERROR(f'Error parsing CSV file at {csv_file_path}'))
            return

        # Perform inserts to the database
        with transaction.atomic():
            for _, row in predictions.iterrows():
                try:
                    zone = Zone.objects.get(id=row['zone_id'])
                    busyness = Busyness(
                        datetime=row['timestamp'],
                        zone=zone,
                        busyness_score=row['predicted_busyness_score']
                    )
                    busyness.save()
                    self.stdout.write(self.style.SUCCESS(f'Inserted Busyness with id {busyness.id}'))
                except Zone.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f'Zone with id {row["zone_id"]} does not exist.'))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Error inserting busyness record: {e}'))

        self.stdout.write(self.style.SUCCESS('Successfully populated the Busyness table with pre-calculated scores.'))

