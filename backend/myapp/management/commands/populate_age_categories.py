from django.core.management.base import BaseCommand
from zones.models import AgeCategory

class Command(BaseCommand):
    help = 'Populates the AgeCategory model with predefined age ranges'

    def handle(self, *args, **kwargs):
        age_ranges = [
            "Under 5 years", "5 to 9 years", "10 to 14 years", "15 to 19 years",
            "20 to 24 years", "25 to 29 years", "30 to 34 years", "35 to 39 years",
            "40 to 44 years", "45 to 49 years", "50 to 54 years", "55 to 59 years",
            "60 to 64 years", "65 to 69 years", "70 to 74 years", "75 to 79 years",
            "80 to 84 years", "85 years and over"
        ]

        for age_range in age_ranges:
            AgeCategory.objects.get_or_create(age_range=age_range)

        self.stdout.write(self.style.SUCCESS('Successfully populated AgeCategory model'))
