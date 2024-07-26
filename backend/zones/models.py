from django.db import models



class Zone(models.Model):
    """
    Represents a geographical zone with a unique identifier, name, and boundary coordinates.

    Attributes:
        id (int): The unique identifier for the zone.
        name (str): The name of the zone.
        boundary_coordinates (JSON): JSON field storing the boundary coordinates of the zone.
    """
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    boundary_coordinates = models.JSONField()  # Store the boundary coordinates as JSON

    def __str__(self):
        return str(self.name)
    
class AgeCategory(models.Model):
    """
    Represents an age category for target demographics.
    """
    age_range = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.age_range
    
class Interest(models.Model):
    """
    Represents an interest that can be targeted in a search.

    Attributes:
        name (str): The name of the interest, used as the primary key.
    """
    name = models.CharField(max_length=255, primary_key=True)

    def __str__(self):
        return self.name


class InterestZoneCount(models.Model):
    """
    Represents the count of a particular interest within a zone.

    Attributes:
        zone (ForeignKey): Reference to the Zone model.
        interest (ForeignKey): Reference to the Interest model.
        count (int): The count of the interest within the zone.
    """
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE)
    interest = models.ForeignKey(Interest, on_delete=models.CASCADE)
    count = models.IntegerField()

    class Meta:
        unique_together = ('zone', 'interest')

    def __str__(self):
        return f"{self.zone.name} - {self.interest.name}: {self.count}"


class PopulationData(models.Model):
    """
    Represents population data for each zone and age category.
    """
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE)
    age_category = models.ForeignKey(AgeCategory, on_delete=models.CASCADE)
    population = models.IntegerField()

    class Meta:
        unique_together = ('zone', 'age_category')

    def __str__(self):
        return f"{self.zone.name} - {self.age_category.age_range}: {self.population}"



class Billboard(models.Model):
    """
    Represents a billboard with its details and associated zone.
    """
    street_name = models.CharField(max_length=255)
    sign_illumination = models.CharField(max_length=255)
    sign_sq_footage = models.FloatField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.street_name} ({self.latitude}, {self.longitude})'
    

class AdvertisingLocation(models.Model):
    location = models.CharField(max_length=255, null=True, blank=True)
    format = models.CharField(max_length=255, null=True, blank=True)
    category_alias = models.CharField(max_length=255, null=True, blank=True)
    market = models.CharField(max_length=255, null=True, blank=True)
    size = models.CharField(max_length=255, null=True, blank=True)
    design_template_url = models.URLField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    calculated_cpm = models.FloatField(null=True, blank=True)
    views = models.IntegerField(null=True, blank=True)
    cost_per_day = models.FloatField(null=True, blank=True)
    numbers_total = models.IntegerField(null=True, blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE)
    property_id = models.CharField(max_length=255, null=True, blank=True)  
    photo_url = models.URLField(null=True, blank=True)  

    def __str__(self):
        return f'{self.location} ({self.latitude}, {self.longitude})'
    

