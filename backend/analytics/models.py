from django.db import models
from zones.models import Zone
from search.models import Search

    

class Busyness(models.Model):
    """
    Represents the busyness score for a specific zone at a particular datetime.

    Attributes:
        datetime (datetime): The date and time of the busyness score.
        zone (Zone): The zone for which the busyness score is recorded.
        busyness_score (float): The busyness score for the zone at the given datetime.
    """
    datetime = models.DateTimeField()
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE)
    busyness_score = models.FloatField()

    class Meta:
        unique_together = ('datetime', 'zone')

class Demographic(models.Model):
    """
    Represents the demographic score for a search in a specific zone at a particular datetime.

    Attributes:
        zone (Zone): The zone for which the demographic data is recorded.
        search (Search): The related search for which the demographic data was collected.
        score (float): The score representing the demographic data for the search in the zone at the given datetime.
    """
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE)
    search = models.ForeignKey(Search, on_delete=models.CASCADE)
    score = models.FloatField()

    class Meta:
        unique_together = ('zone', 'search')

