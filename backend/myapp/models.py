"""
Models for the 'myapp' application.

This module defines the database models for the 'myapp' application, including a custom user model 
that extends Django's AbstractUser.

Classes:
    CustomUser: A custom user model that extends Django's AbstractUser, adding additional fields 
                for name and credits.
    Zone: Represents a geographical zone with a name, and boundary coordinates.
    Search: Represents a search created by a user for advertising purposes.
    Busyness: Represents the busyness score for a specific zone at a particular datetime.
    Demographic: Represents the demographic score for a search in a specific zone at a datetime.

"""

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class CustomUser(AbstractUser):
    name = models.CharField(max_length=100, blank=True)
    credits = models.IntegerField(default=0)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    nationality = models.CharField(max_length=50, blank=True)
    industry = models.CharField(max_length=50, blank=True)
    business_size = models.CharField(max_length=50, blank=True)
    budget = models.CharField(max_length=50, blank=True)
    business_description = models.TextField(blank=True)
    free_search = models.BooleanField(default=False)

    def __str__(self):
        return str(self.username)
    
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

class Search(models.Model):
    """
    Represents a search created by a user for advertising purposes.

    Attributes:
        name (str): The name of the search.
        user (User): The user who created the search.
        start_date (date): The start date of the search.
        end_date (date): The end date of the search.
        date_search_made_on (date): The date when the search was made.
        target_market_interests (ManyToManyField): Many-to-many relationship with Interest.
        target_age (ManyToManyField): Many-to-many relationship with AgeCategory.
        gender (str): The gender of the target demographic (M: Male, F: Female, B: Both).
    """
    name = models.CharField(max_length=255)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    date_search_made_on = models.DateField()
    target_market_interests = models.ManyToManyField(Interest)
    target_age = models.ManyToManyField(AgeCategory)
    gender = models.CharField(max_length=1, choices=[('M', 'Male'), ('F', 'Female'), ('B', 'Both')])

    def __str__(self):
        return self.name



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
    
class CreditUsage(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date_used = models.DateTimeField(auto_now_add=True)
    credits_used = models.IntegerField()

    def __str__(self):
        return f"{self.user.username} used {self.credits_used} credits on {self.date_used}"