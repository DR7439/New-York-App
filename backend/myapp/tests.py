from django.test import TestCase
from .models import Zone, Search, Busyness, Demographic, CustomUser
from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from django.core.exceptions import ValidationError
from django.db import IntegrityError
import datetime
import json

# To note: run using -> python manage.py test myapp, in backend directory.

# Setting up a test case for the CustomUser model.
class CUTestCase(TestCase):
    
    def set_up(self):
        """
        Create a CustomUser instance for testing.
        """
        self.user = CustomUser.objects.create_user(
            username="testuser",
            password="testpassword",
            name="DRtest",
            credits=1000
        )
        
    def fields_test(self):
        """
        Test the fields of CustomUser.
        """
        self.assertEqual(self.user.username, "testuser")
        self.assertTrue(self.user.check_password("testpassword"))
        self.assertEqual(self.user.name, "DRtest")
        self.assertEqual(self.user.credits, 1000)
        
    def default_credits_test(self):
        """
        Test the default credits field of CustomUser (we currently have it set to 0).
        """
        no_credits = CustomUser.objects.create_user(
            username="0credittest",
            password="testpassword",
            name="brokeuser",
        )
        
        self.assertEqual(no_credits.credits, 0)
        
    def credits_test(self):
        """
        Test the credits field of CustomUser.
        """
        self.user.add_credits(100)
        self.assertEqual(self.user.credits, 1100)
        self.user.remove_credits(100)
        self.assertEqual(self.user.credits, 1000)
        
    def test_str_method(self):
        """
        Test the __str__ method of the CustomUser model.
        """
        self.assertEqual(str(self.user), 'testuser')
        
# Setting up a test to verify that we can create a new user.
class UserCreateTest(APITestCase):
    
    def test_create_user(self):
        """
        Test to see if we can create a new user.
        """
        url = reverse("register") 
        data = {
            'username': "testuser2",
            'password': "testpassword",
            'name': "DRTestUser"
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CustomUser.objects.count(), 1)
        self.assertEqual(CustomUser.objects.get().username, "DRTestUser")
        
    def test_create_user_with_existing_username(self):
        """
        Ensuring that creating a user with an existing username fails.
        """
        CustomUser.objects.create_user(username='testuser2', password='testpassword') # Using the abover credientials which should not work thus verifying the test.
        url = reverse('register')  
        data = {
            "username": "testuser2",
            "password": "testpassword",
            "name": "New DRTestUser"
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "A user with that username already exists.")
       
# Setting up a test to verify token generation. 
class TokenTest(APITestCase):
    
    def set_up(self):
        """
        Creating a user for testing token generatiorn 
        """
        
        self.user = CustomUser.objects.create_user(username="testuser3", password="testpassword")
        
    def test_token(self):
        """
        Ensure we can obtain a token with valid credentials.
        """
        
        url = reverse("login")
        data = {
            "username": "testuser3",
            "password": "testpassword"
        }
        
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue("token" in response.data)
        self.assertTrue("user" in response.data)
        
    def test_invalid_token(self):
        """
        Ensure we can't obtain a token with invalid credentials.
        """
        
        url = reverse("login")
        data = {
            "username": "testuser3",
            "password": "blahblah"
        }
        
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        
        
        

        
#if __name__ == '__main__':
    #TestCase.main()