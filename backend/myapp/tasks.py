from celery import shared_task
from django.utils import timezone
from .models import Search, Busyness, Demographic, Zone, PopulationData, InterestZoneCount
import random
import datetime

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
