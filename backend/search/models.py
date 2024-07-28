from django.db import models
from users.models import CustomUser
from zones.models import Interest, AgeCategory

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


