# myapp/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    name = models.CharField(max_length=100, blank=True)
    credits = models.IntegerField(default=0)

    def __str__(self):
        return self.username
