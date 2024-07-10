from celery import shared_task
from django.utils import timezone
from .models import Search, Busyness, Demographic, Zone, PopulationData, InterestZoneCount
import random
import datetime
from model_data_2_0 import busyness_prediction
from datetime import timedelta
import pandas as pd
import numpy as np

@shared_task
def background_task(search_id):
    print(f'Background task started for search_id: {search_id}')
    print("OK")
    search = Search.objects.get(id=search_id)
    zones = Zone.objects.all()

    # Create demographic scores for each zone for the search
    for zone in zones:
        demographic_score = calculate_demographic_score(zone, search)
        Demographic.objects.update_or_create(
            zone=zone,
            search=search,
            defaults={'score': demographic_score}
        )

    # Generate busyness scores for each hour of each day between start_date and end_date
    current_date = search.start_date
    end_date = search.end_date

    while current_date <= end_date:
        for hour in range(24):
            naive_datetime = datetime.datetime.combine(current_date, datetime.time(hour=hour))
            aware_datetime = timezone.make_aware(naive_datetime)

            for zone in zones:
                busyness_entry = Busyness.objects.filter(datetime=aware_datetime, zone=zone).first()
                if busyness_entry:
                    busyness_score = busyness_entry.busyness_score
                    Busyness.objects.update_or_create(
                        datetime=aware_datetime,
                        zone=zone,
                        defaults={'busyness_score': busyness_score}
                    )
                else:
                    print(f"No busyness entry found for zone {zone.id} at {aware_datetime}")
        current_date += datetime.timedelta(days=1)

    print(f'Background task completed for search_id: {search_id}')
    
@shared_task
def check_and_populate_busyness():
    now = timezone.now()
    end_date = now + timedelta(weeks=2)
    zones = Zone.objects.all()

    # Generate timestamps for every hour from now to 14 days ahead
    timestamps = pd.date_range(start=now, periods=14*24, freq='H')

    for timestamp in timestamps:
        for zone in zones:
            if not Busyness.objects.filter(zone=zone, datetime=timestamp).exists():
                # Make predictions using the busyness prediction model for the timestamp
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
                    Busyness.objects.update_or_create(
                        datetime=row['timestamp'],
                        zone=zone,
                        defaults={'busyness_score': busyness_score}
                    )

def calculate_demographic_score(zone, search):
    # Calculate age score (50 points max)
    total_population = sum(PopulationData.objects.filter(zone=zone).values_list('population', flat=True))
    target_population = sum(
        PopulationData.objects.filter(zone=zone, age_category__in=search.target_age.all()).values_list('population', flat=True)
    )
    age_score = (target_population / total_population) * 50 if total_population > 0 else 0

    # Calculate interest score (50 points max)
    total_interest_count = sum(
        InterestZoneCount.objects.filter(
            zone=zone, 
            interest__in=search.target_market_interests.all()
        ).values_list('count', flat=True)
    )

    interest_score = 0
    if total_interest_count >= 1000:
        interest_score = 50
    elif total_interest_count > 0:
        interest_score = (total_interest_count / 1000) * 50

    # Combine scores
    demographic_score = age_score + interest_score
    
    # Print scores in a single line
    print(f'{zone.name} - Age Score: {age_score}, Interest Count: {total_interest_count}, Interest Score: {interest_score}')

    return demographic_score
