import os
import sys
import pandas as pd
import numpy as np
from django.core.management.base import BaseCommand
from django.utils import timezone
from myapp.models import Busyness, Zone
from model_data_2_0 import busyness_prediction

class Command(BaseCommand):
    help = 'Populates the Busyness table with log-normalized busyness scores for every hour from the current date to 14 days ahead.'

    def handle(self, *args, **kwargs):
        # Get the current date and time
        current_time = timezone.now()
        
        # Generate timestamps for every hour from now to 7 days ahead
        timestamps = pd.date_range(start=current_time, periods=14*24, freq='H')

        # Round timestamps to the nearest whole hour
        timestamps = timestamps.round('H')

        for timestamp in timestamps:
            # Make predictions using the busyness prediction model for each timestamp
            predictions = busyness_prediction.make_prediction(timestamp.strftime('%Y-%m-%d %H:%M:%S'), 'model_data_2_0/busyness_model.pkl')


            # Apply logarithmic scaling to the 'predicted_busyness_score'
            predictions['log_normalized_score'] = np.log1p(predictions['predicted_busyness_score'])

            # Min-max scaling the log-transformed scores to 1-100
            min_log_score = predictions['log_normalized_score'].min()
            max_log_score = predictions['log_normalized_score'].max()

            predictions['log_normalized_score'] = 1 + (predictions['log_normalized_score'] - min_log_score) * 99 / (max_log_score - min_log_score)

            # Populate the Busyness table
            for _, row in predictions.iterrows():
                zone = Zone.objects.get(id=row['zone_id'])
                busyness_score = row['log_normalized_score']

                # Update or create Busyness object
                obj, created = Busyness.objects.update_or_create(
                    datetime=row['timestamp'],
                    zone=zone,
                    defaults={'busyness_score': busyness_score}
                )

                # Print a message for each entry made
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Created Busyness entry for {row["timestamp"]}'))
                else:
                    self.stdout.write(self.style.SUCCESS(f'Updated Busyness entry for {row["timestamp"]}'))

        self.stdout.write(self.style.SUCCESS('Successfully populated the Busyness table for every hour from now to 7 days ahead.'))