import pandas as pd
from django.core.management.base import BaseCommand
from zones.models import Interest, Zone, InterestZoneCount

class Command(BaseCommand):
    help = 'Process CSV file and store counts of interests related to zones'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file')

    def handle(self, *args, **kwargs):
        csv_file = kwargs['csv_file']
        df = pd.read_csv(csv_file)
        print(df.head(5))

        for _, row in df.iterrows():
            zone_id = row['zone_id']
            zone = Zone.objects.get(id=zone_id)
            
            for interest_name in df.columns[1:]:
                interest_count = row[interest_name]
                print(zone_id, interest_name, interest_count)
                interest, created = Interest.objects.get_or_create(name=interest_name)

                interest_zone_count, created = InterestZoneCount.objects.get_or_create(
                    zone=zone, 
                    interest=interest,
                    defaults={'count': interest_count}  # Ensure the count is provided during creation
                )
                if not created:
                    # If the instance already exists, update the count
                    interest_zone_count.count = interest_count
                    interest_zone_count.save()

        self.stdout.write(self.style.SUCCESS('Successfully processed CSV file'))
