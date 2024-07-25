import os
import pandas as pd
from django.core.management.base import BaseCommand
from django.utils import timezone
from model_data_2_0 import busyness_prediction

class Command(BaseCommand):
     help = 'Generates busyness predictions for every hour from the current date to 6 months ahead and saves them to a CSV file.'

     def handle(self, *args, **kwargs):
         try:
             # Get the current date and time
             current_time = timezone.now()

             # Generate timestamps for every hour from now to 6 months ahead
             six_months_later = current_time + pd.DateOffset(months=12)
             timestamps = pd.date_range(start=current_time, end=six_months_later, freq='H')

             # Round timestamps to the nearest whole hour
             timestamps = timestamps.round('H')

             all_predictions = []
             current_day = None

             for timestamp in timestamps:
                 # Check if we moved to a new day
                 if current_day != timestamp.date():
                     if current_day is not None:
                         self.stdout.write(self.style.SUCCESS(f'Completed predictions for {current_day}'))
                     current_day = timestamp.date()

                 # Make predictions using the busyness prediction model for each timestamp
                 predictions = busyness_prediction.make_prediction(timestamp.strftime('%Y-%m-%d %H:%M:%S'), 'model_data_2_0/busyness_model_percentiles.pkl')

                 if predictions.empty:
                     self.stdout.write(self.style.WARNING(f'No predictions returned for {timestamp}'))
                     continue

                 # Add timestamp to each prediction
                 predictions['timestamp'] = timestamp

                 all_predictions.append(predictions)

             # Concatenate all predictions into a single DataFrame
             if all_predictions:
                 result_df = pd.concat(all_predictions)

                 # Save the results to a CSV file
                 output_file = os.path.join(os.path.dirname(__file__), 'busyness_predictions.csv')
                 result_df.to_csv(output_file, index=False)

                 self.stdout.write(self.style.SUCCESS(f'Successfully saved busyness predictions to {output_file}'))
             else:
                 self.stdout.write(self.style.WARNING('No predictions were generated.'))

         except Exception as e:
             self.stdout.write(self.style.ERROR(f'Error generating busyness predictions: {e}'))