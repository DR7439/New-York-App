from celery import shared_task
from django.utils import timezone
from .models import Search, Busyness, Demographic, Zone
import random
import datetime

@shared_task
def background_task(search_id):
    print(f'Background task started for search_id: {search_id}')
    search = Search.objects.get(id=search_id)
    zones = Zone.objects.all()

    

    # Create random demographic scores for each zone for the search
    for zone in zones:
        Demographic.objects.update_or_create(
            zone=zone,
            search=search,
            defaults={'score': random.uniform(0, 100)}
        )

    # Generate random busyness scores for each hour of each day between start_date and end_date
    current_date = search.start_date
    end_date = search.end_date

    while current_date <= end_date:
        for hour in range(24):
            for zone in zones:
                naive_datetime = datetime.datetime.combine(current_date, datetime.time(hour=hour))
                aware_datetime = timezone.make_aware(naive_datetime)
                Busyness.objects.update_or_create(
                    datetime=aware_datetime,
                    zone=zone,
                    defaults={'busyness_score': random.uniform(0, 100)}
                )
        current_date += datetime.timedelta(days=1)

    print(f'Background task completed for search_id: {search_id}')


def get_demographic(search, zones):
    pass