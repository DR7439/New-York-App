"""
Models for the 'myapp' application.

This module defines the database models for the 'myapp' application, including a custom user model 
that extends Django's AbstractUser.

Classes:
    CustomUser: A custom user model that extends Django's AbstractUser, adding additional fields 
                for name and credits.
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
