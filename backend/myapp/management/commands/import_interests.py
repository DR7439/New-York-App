# myapp/management/commands/import_interests.py
import pandas as pd
from django.core.management.base import BaseCommand
from myapp.models import Interest, Zone, InterestZoneCount

class Command(BaseCommand):
    help = 'Process CSV file and store counts of interests related to zones'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='/mnt/data/merged_zone_sector_counts.csv')

    def handle(self, *args, **kwargs):
        csv_file = kwargs['csv_file']
        df = pd.read_csv(csv_file)

        for _, row in df.iterrows():
            zone_id = row['zone_id']
            zone = Zone.objects.get(id=zone_id)
            
            for interest_name in df.columns[1:]:
                interest_count = row[interest_name]

                interest, created = Interest.objects.get_or_create(name=interest_name)

                interest_zone_count, created = InterestZoneCount.objects.get_or_create(zone=zone, interest=interest)
                interest_zone_count.count = interest_count
                interest_zone_count.save()

        self.stdout.write(self.style.SUCCESS('Successfully processed CSV file'))
