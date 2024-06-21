from django.test import TestCase
from .models import Zone, Search, Busyness, Demographic, CustomUser
from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from django.core.exceptions import ValidationError
from django.db import IntegrityError
import datetime
import json
from django.utils import timezone

# To note: run using -> python manage.py test myapp, in backend directory.

# Setting up a test case for the CustomUser model.
class CUTestCase(TestCase):
    
    def setUp(self):
        """
        Create a CustomUser instance for testing.
        """
        self.user = CustomUser.objects.create_user(
            username="testuser",
            password="testpassword",
            name="DRtest",
            credits=1000
        )
        
    def test_fields(self):
        """
        Test the fields of CustomUser.
        """
        self.assertEqual(self.user.username, "testuser")
        self.assertTrue(self.user.check_password("testpassword"))
        self.assertEqual(self.user.name, "DRtest")
        self.assertEqual(self.user.credits, 1000)
        
    def test_default_credits(self):
        """
        Test the default credits field of CustomUser (we currently have it set to 0).
        """
        no_credits = CustomUser.objects.create_user(
            username="0credittest",
            password="testpassword",
            name="brokeuser",
        )
        
        self.assertEqual(no_credits.credits, 0)
        
    def test_credits(self):
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
            "username": "DRTestUser",
            "password": "DRTestPassword",
            "email": "test@example.com"
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
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
    
    def setUp(self):
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
        
class SearchTest(TestCase):

    def setUp(self):
        """
        Set up a user and a search instance for testing.
        """
        self.user = CustomUser.objects.create_user(username="testuser4", password="blahblah")
        self.search = Search.objects.create(
            name="Testing Search",
            user=self.user,
            date_of_advertising=datetime.date.today(),
            date_search_made_on=datetime.date.today(),
            target_market_interests=json.dumps(["sports", "food"]),
            min_age=23,
            max_age=50,
            gender="M"
        )

    def test_search_creation(self):
        """
        Testing the creation of a Search instance.
        """
        self.assertEqual(self.search.name, "Testing Search")
        self.assertEqual(self.search.user, self.user)
        self.assertEqual(self.search.target_market_interests, json.dumps(["sports", "food"]))
        self.assertEqual(self.search.min_age, 23)
        self.assertEqual(self.search.max_age, 50)
        self.assertEqual(self.search.gender, 'M')
        
class ZoneTest(TestCase):

    def setUp(self):
        """
        Setting up a zone instance for testing.
        """
        self.zone = Zone.objects.create(
            name="Testing Zone",
            boundary_coordinates=json.dumps({"type": "Polygon", "coordinates": [[[0, 0], [1, 1], [1, 0], [0, 0]]]})
        )

    def test_zone_creation(self):
        """
        Testing the creation of a Zone instance.
        """
        self.assertEqual(self.zone.name, "Testing Zone")
        self.assertEqual(self.zone.boundary_coordinates, json.dumps({"type": "Polygon", "coordinates": [[[0, 0], [1, 1], [1, 0], [0, 0]]]}))

    def test_str_method(self):
        """
        Testing the __str__ method of the Zone model.
        """
        self.assertEqual(str(self.zone), "Testing Zone")


class DemographicModelTest(TestCase):
  
    def setUp(self):
        """
        Setting up a zone, user, search, and demographic instance for testing.
        """
        self.zone = Zone.objects.create(
            name="Testing Zone",
            boundary_coordinates=json.dumps({"type": "Polygon", "coordinates": [[[0, 0], [1, 1], [1, 0], [0, 0]]]})
        )
        self.user = CustomUser.objects.create_user(username="testuser5", password="blahblah")
        self.search = Search.objects.create(
            name="Testing Zone",
            user=self.user,
            date_of_advertising=datetime.date.today(),
            date_search_made_on=datetime.date.today(),
            target_market_interests=json.dumps(["sports", "food"]),
            min_age=23,
            max_age=35,
            gender="M"
        )
        self.demographic = Demographic.objects.create(
            datetime=timezone.now(),
            zone=self.zone,
            search=self.search,
            score=99.9
        )

    def test_demographic_creation(self):
        """
        Testing the creation of a Demographic instance.
        """
        self.assertEqual(self.demographic.zone, self.zone)
        self.assertEqual(self.demographic.search, self.search)
        self.assertEqual(self.demographic.score, 99.9)

    def test_unique_together_constraint(self):
        """
        Testing the unqiue constraint on the Demographic model.
        """
        duplicate_demographic = Demographic(
            datetime=self.demographic.datetime,
            zone=self.zone,
            search=self.search,
            score=98
        )
        with self.assertRaises(IntegrityError):
            duplicate_demographic.save()
        
        

        
#if __name__ == '__main__':
    #TestCase.main()