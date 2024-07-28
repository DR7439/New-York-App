from django.db import models
from django.contrib.auth.models import AbstractUser
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
    free_search = models.BooleanField(default=True)

    def __str__(self):
        return str(self.username)


class CreditUsage(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date_used = models.DateTimeField(auto_now_add=True)
    credits_used = models.IntegerField()

    def __str__(self):
        return f"{self.user.username} used {self.credits_used} credits on {self.date_used}"