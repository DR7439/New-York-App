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

class CustomUser(AbstractUser):
    """
    A custom user model that extends Django's AbstractUser.

    This model adds additional fields to the default user model provided by Django, including
    a name field and a credits field.

    Attributes:
        name (str): The user's name, an optional field with a maximum length of 100 characters.
        credits (int): The user's credits, an integer field with a default value of 0.

    Methods:
        __str__():
            Returns the string representation of the user, which is the username.
    """
    name = models.CharField(max_length=100, blank=True)
    credits = models.IntegerField(default=0)

    def __str__(self):
        """
        Returns the string representation of the user.

        Returns:
            str: The username of the user.
        """
        return str(self.username)
    
class Zone(models.Model):
    """
    Represents a geographical zone with a unique identifier, name, and boundary coordinates.

    Attributes:
        name (str): The name of the zone.
        boundary_coordinates (JSON): JSON field storing the boundary coordinates of the zone.
    """
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
        name (str): The name of the interest.
    """
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Search(models.Model):
    """
    Represents a search created by a user for advertising purposes.

    Attributes:
        name (str): The name of the search.
        user (User): The user who created the search.
        date_of_advertising (date): The date when the advertisement will be displayed.
        date_search_made_on (date): The date when the search was made.
        target_market_interests (ManyToManyField): Many-to-many relationship with Interest.
        target_age (ManyToManyField): Many-to-many relationship with AgeCategory.
        gender (str): The gender of the target demographic (M: Male, F: Female, B: Both).
    """
    name = models.CharField(max_length=255)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date_of_advertising = models.DateField()
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
        datetime (datetime): The date and time of the demographic data.
        zone (Zone): The zone for which the demographic data is recorded.
        search (Search): The related search for which the demographic data was collected.
        score (float): The score representing the demographic data for the search in the zone at the given datetime.
    """
    datetime = models.DateTimeField()
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE)
    search = models.ForeignKey(Search, on_delete=models.CASCADE)
    score = models.FloatField()

    class Meta:
        unique_together = ('datetime', 'zone', 'search')