#from django.contrib.auth import authenticate
from rest_framework import generics, permissions, status  # Ensure this import
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import CustomUser, Search, Interest, Zone, Busyness, Demographic, Billboard, InterestZoneCount, CreditUsage
from .serializers import UserSerializer, MyTokenObtainPairSerializer, SearchSerializer, InterestSerializer, ZoneSerializer, BusynessSerializer, ZoneDetailSerializer, BillboardSerializer, PredictionRequestSerializer, PredictionSerializer, UpdateUserSerializer, CreditUsageSerializer

from .tasks import background_task
from django.contrib.auth import login
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.core.cache import cache
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.utils.dateparse import parse_datetime
from django.db import models 
from django.db.models import F, FloatField, ExpressionWrapper, Value, Max, Subquery, OuterRef
from django.db.models.functions import Coalesce, Cast
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from datetime import datetime, timedelta
from django.http import JsonResponse
import json
import os
import stripe
import json
import joblib

from django.conf import settings
from django.views import View
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt


class UserCreate(generics.CreateAPIView):
    """
    API view for creating a new user.

    This view handles the creation of new users. It inherits from Django Rest Framework's 
    `CreateAPIView`, which provides the `create` method for handling POST requests.

    Attributes:
        queryset (QuerySet): The queryset used for retrieving user instances.
        serializer_class (Serializer): 
                        The serializer class used for validating and deserializing input, 
                        and for serializing output.
        permission_classes (tuple): The permission classes that this view requires.

    Methods:
        create(request, *args, **kwargs):
            Handles POST requests to create a new user. Checks if a user with the given username 
            already exists before proceeding with creation. If the username already exists, 
            returns a 400 BAD REQUEST response with an appropriate error message.
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)

    def create(self, request, *args, **kwargs):
        """
        Handles POST requests to create a new user.

        Args:
            request (Request): The request object containing the new user data.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: A Response object containing the serialized data of the created user,
                      or an error message if the username already exists.
        """
        username = request.data.get("username")
        email = request.data.get("email")
        if CustomUser.objects.filter(username=username).exists():
            return Response(
                {"error": "A user with that username already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if CustomUser.objects.filter(email=email).exists():
            return Response(
                {"error": "A user with that email already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().create(request, *args, **kwargs)
    

class UpdateUserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = UpdateUserSerializer(user)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        user = request.user
        serializer = UpdateUserSerializer(user, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DropdownOptionsView(APIView):
    def get(self, request, *args, **kwargs):
        dropdown_options = {
            "nationalities": ["American", "British", "Canadian", "Irish", "French"],
            "industries": ["Technology", "Finance", "Healthcare", "Education", "Retail"],
            "business_sizes": ["Small", "Medium", "Large"],
            "budgets": ["< $50", "$50 - $100", "$100 - $500", "> $500"]
        }
        return Response(dropdown_options)

class MyTokenObtainPairView(TokenObtainPairView):
    """
    API view for obtaining a pair of access and refresh JSON web tokens.

    This view handles the generation of JWT tokens for authenticated users. It extends 
    `TokenObtainPairView` from Simple JWT to include user details in the response.

    Attributes:
        serializer_class (Serializer): The serializer class used for validating the user credentials 
                                       and generating the tokens.

    Methods:
        post(request, *args, **kwargs):
            Handles POST requests to authenticate a user and generate JWT tokens. Returns the 
            generated access token along with the authenticated user's details.
    """
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests to authenticate a user and generate JWT tokens.

        Args:
            request (Request): The request object containing the user credentials.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: A Response object containing the generated access token and the authenticated 
                      user's serialized data.
        """
        response = super().post(request, *args, **kwargs)
        token = response.data['access']
        user = CustomUser.objects.get(username=request.data['username'])

        login(request, user)

        return Response({
            'token': token,
            'user': UserSerializer(user).data,
            'sessionid': request.session.session_key
        })
    

class SearchAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SearchSerializer

    def get_cache_key(self, user_id):
        return f"user_searches_{user_id}"

    def get(self, request, *args, **kwargs):
        cache_key = self.get_cache_key(request.user.id)
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        searches = Search.objects.filter(user=request.user)
        serializer = self.serializer_class(searches, many=True)
        cache.set(cache_key, serializer.data, timeout=60 * 15)  # Cache for 15 minutes
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        user = request.user
        data = request.data

        # Error checking for dates
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        if not start_date or not end_date:
            return Response({"error": "Start date and end date are required."}, status=status.HTTP_400_BAD_REQUEST)

        start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_date, '%Y-%m-%d').date()

        if start_date >= end_date:
            return Response({"error": "Start date must be before end date."}, status=status.HTTP_400_BAD_REQUEST)

        search_duration = (end_date - start_date).days + 1  # Including both start and end date
        if search_duration > 14:
            return Response({"error": "Search duration cannot be more than 14 days."}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate required credits
        required_credits = 10 * search_duration

        # Check if the user has used their free search and has enough credits
        if not user.free_search and user.credits < required_credits:
            return Response({"error": "Insufficient credits"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            serializer.save(user=user)
            search_id = serializer.instance.id

            # Deduct credits and record usage if the user has used their free search
            if user.free_search:
                # Mark that the user has used their free search
                user.free_search = False
            else:
                user.credits -= required_credits
                CreditUsage.objects.create(user=user, credits_used=required_credits)
            
            user.save()

            print("search_id: ", search_id)
            background_task.delay(search_id)

            # Invalidate cache for the user
            cache_key = self.get_cache_key(request.user.id)
            cache.delete(cache_key)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SingleSearchAPIView(APIView):
    """
    API view for handling a single search instance based on the ID.

    This view handles GET requests for retrieving a single search instance.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, id, *args, **kwargs):
        """
        Handles GET requests and returns a single search instance for the authenticated user.
        """
        try:
            search = Search.objects.get(id=id, user=request.user)
            serializer = SearchSerializer(search)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Search.DoesNotExist:
            return Response({'error': 'Search not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, id, *args, **kwargs):
        """
        Handles DELETE requests and deletes a single search instance for the authenticated user.
        """
        try:
            search = Search.objects.get(id=id, user=request.user)
            search.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Search.DoesNotExist:
            return Response({'error': 'Search not found'}, status=status.HTTP_404_NOT_FOUND)

class InterestAPIView(APIView):
    """
    API view for handling interests.

    This view handles GET requests for the list of all interests.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = InterestSerializer

    def get(self, request, *args, **kwargs):
        """
        Handles GET requests and returns a list of all interests.
        """
        interests = Interest.objects.all()
        serializer = self.serializer_class(interests, many=True)
        return Response(serializer.data)

class ZoneListView(APIView):
    """
    API view to retrieve zone coordinates.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        cache_key = 'zones_data'
        cached_data = cache.get(cache_key)

        if cached_data is not None:
            return Response(cached_data, status=status.HTTP_200_OK)

        zones = Zone.objects.all()
        serializer = ZoneSerializer(zones, many=True)
        data = serializer.data
        cache.set(cache_key, data, timeout=60 * 60)  # Cache for 1 hour

        return Response(data, status=status.HTTP_200_OK)
    
class SearchScoresView(APIView):
    """
    API view to retrieve demographic and busyness scores for a search.
    """
    def get(self, request, search_id, *args, **kwargs):
        try:
            search = Search.objects.get(id=search_id)
        except Search.DoesNotExist:
            return Response({"error": "Search not found"}, status=status.HTTP_404_NOT_FOUND)

        zones = Zone.objects.all()
        data = []

        for zone in zones:
            try:
                demographic = Demographic.objects.get(search=search, zone=zone)
                busyness_scores = Busyness.objects.filter(zone=zone, datetime__range=[search.start_date, search.end_date])

                zone_data = {
                    'zone_id': zone.id,
                    'zone_name': zone.name,
                    'demographic_score': demographic.score,
                    'busyness_scores': BusynessSerializer(busyness_scores, many=True).data
                }
                data.append(zone_data)
            except Demographic.DoesNotExist:
                continue

        return Response({"zones": data}, status=status.HTTP_200_OK)


class ZoneDetailView(APIView):
    """
    API view to retrieve detailed information about a zone, including age demographics.
    """
    def get(self, request, zone_id, *args, **kwargs):
        try:
            zone = Zone.objects.get(id=zone_id)
        except Zone.DoesNotExist:
            return Response({'error': 'Zone not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ZoneDetailSerializer(zone)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TopNScoresView(APIView):
    """
    API view to retrieve top N combined demographic and busyness scores for a search.
    """
    def get(self, request, *args, **kwargs):
        search_id = request.query_params.get('search_id')
        top_n = int(request.query_params.get('top_n', 10))  # Default to top 10 if not specified
        date_str = request.query_params.get('date')

        # Validate and parse the date
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except (ValueError, TypeError):
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve the search object
        search = get_object_or_404(Search, id=search_id)
        top_n = min(top_n, 100)  # Limit to a maximum of 100

        # Create a subquery to retrieve the demographic score for each zone in the search
        demographic_subquery = Demographic.objects.filter(
            zone=OuterRef('zone_id'), search=search
        ).values('score')[:1]

        # Annotate the Busyness queryset with the demographic score and combined score
        top_scores = (
            Busyness.objects
            .filter(datetime__date=date)
            .annotate(
                demographic_score=Coalesce(Subquery(demographic_subquery), Value(0.0)),
                combined_score=ExpressionWrapper(
                    F('busyness_score') + Coalesce(Subquery(demographic_subquery), Value(0.0)),
                    output_field=FloatField()
                )
            )
            .order_by('-combined_score')[:top_n]
        )

        data = [
            {
                "zone_id": score.zone.id,
                "zone_name": score.zone.name,
                "datetime": score.datetime,
                "demographic_score": score.demographic_score,
                "busyness_score": score.busyness_score,
                "combined_score": score.combined_score
            }
            for score in top_scores
        ]

        return Response({"top_scores": data}, status=status.HTTP_200_OK)
    


class TopNScoresInZoneView(APIView):
    """
    API view to retrieve top N combined demographic and busyness scores for a certain zone on a certain date.
    """
    def get(self, request, *args, **kwargs):
        # Extract query parameters
        search_id = request.query_params.get('search_id')
        zone_id = request.query_params.get('zone_id')
        date_str = request.query_params.get('date')
        top_n = int(request.query_params.get('top_n', 10))  # Default to top 10 if not specified

        # Validate and parse the date
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except (ValueError, TypeError):
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve the search object
        search = get_object_or_404(Search, id=search_id)
        top_n = min(top_n, 100)  # Limit to a maximum of 100

        # Create a subquery to retrieve the demographic score for the zone in the search
        demographic_subquery = Demographic.objects.filter(
            zone=OuterRef('zone_id'), search=search
        ).values('score')[:1]

        # Filter and annotate the Busyness queryset
        top_scores = (
            Busyness.objects
            .filter(datetime__date=date, zone_id=zone_id)
            .annotate(
                demographic_score=Coalesce(Subquery(demographic_subquery), Value(0.0)),
                combined_score=ExpressionWrapper(
                    F('busyness_score') + Coalesce(Subquery(demographic_subquery), Value(0.0)),
                    output_field=FloatField()
                )
            )
            .order_by('-combined_score')[:top_n]
        )

        data = [
            {
                "zone_id": score.zone.id,
                "zone_name": score.zone.name,
                "datetime": score.datetime,
                "demographic_score": score.demographic_score,
                "busyness_score": score.busyness_score,
                "combined_score": score.combined_score
            }
            for score in top_scores
        ]

        return Response({"top_scores": data}, status=status.HTTP_200_OK)


class TopZonesView(APIView):
    """
    API view to retrieve top N zones based on combined demographic and max busyness scores
    and return the top 10 busyness scores and times for each zone.
    """
    def get(self, request, *args, **kwargs):
        search_id = request.GET.get('search_id')
        date_str = request.GET.get('date')
        top_n = int(request.GET.get('top_n', 10))  # Default to 10 if 'top_n' is not provided
        top_n = min(top_n, 60)  # Limit to a maximum of 60

        search = get_object_or_404(Search, id=search_id)
        date = parse_datetime(date_str)

        # Ensure the provided date is within the range of the search
        if not (search.start_date <= date.date() <= search.end_date):
            return Response({"error": "Date is out of range for the specified search."}, status=status.HTTP_400_BAD_REQUEST)

        cache_key = f"top_zones_{search_id}_{date_str}_{top_n}"
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data, status=status.HTTP_200_OK)

        # Step 3: Get busyness data for each zone for that day
        busyness_data = Busyness.objects.filter(datetime__date=date.date())

        # Step 4: Find the max busyness for each zone
        max_busyness_per_zone = busyness_data.values('zone_id').annotate(max_busyness=Max('busyness_score'))

        # Step 5: Get the demographic score for the search and every zone
        demographics = Demographic.objects.filter(search=search)

        # Create a dictionary for easy lookup of demographic scores
        demographic_scores = {d.zone_id: d.score for d in demographics}

        # Step 6: Calculate the total score (max busyness + demographic score) for each zone
        zone_scores = []
        for item in max_busyness_per_zone:
            zone_id = item['zone_id']
            max_busyness = item['max_busyness']
            demographic_score = demographic_scores.get(zone_id, 0)
            total_score = max_busyness + demographic_score
            zone_scores.append({
                'zone_id': zone_id,
                'zone_name': Zone.objects.get(id=zone_id).name,
                'total_score': total_score,
                'demographic_score': demographic_score
            })

        # Step 7: Find the top N zones with the highest total score
        top_zones = sorted(zone_scores, key=lambda x: x['total_score'], reverse=True)[:top_n]

        # Step 8: Return the top 10 busiest times and scores for these top N zones
        data = []
        for zone in top_zones:
            zone_id = zone['zone_id']
            busyness_scores = (
                busyness_data.filter(zone_id=zone_id)
                .order_by('-busyness_score')[:10]
                .values_list('datetime', 'busyness_score')
            )
            data.append({
                "zone_id": zone_id,
                "zone_name": zone['zone_name'],
                "demographic_score": zone['demographic_score'],
                "busyness_scores": list(busyness_scores)
            })

        cache.set(cache_key, data, timeout=60 * 60)  # Cache for 1 hour
        return Response(data, status=status.HTTP_200_OK)

class ZoneScoresByDatetimeView(APIView):
    """
    API view to retrieve the zone scores for a given datetime and search.
    """
    def get_cache_key(self, search_id, datetime_str):
        return f"zone_scores_{search_id}_{datetime_str}"

    def get(self, request, *args, **kwargs):
        # Extract query parameters
        search_id = request.query_params.get('search_id')
        datetime_str = request.query_params.get('datetime')

        # Validate and parse the datetime
        try:
            datetime_obj = datetime.strptime(datetime_str, '%Y-%m-%dT%H:%M:%SZ')
        except (ValueError, TypeError):
            return Response({"error": "Invalid datetime format. Use YYYY-MM-DDTHH:MM:SSZ."}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve the search object
        search = get_object_or_404(Search, id=search_id)

        # Generate cache key
        cache_key = self.get_cache_key(search_id, datetime_str)
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response({"zone_scores": cached_data}, status=status.HTTP_200_OK)

        # Create a subquery to retrieve the demographic score for each zone in the search
        demographic_subquery = Demographic.objects.filter(
            zone=OuterRef('zone_id'), search=search
        ).values('score')[:1]

        # Filter the Busyness queryset by the given datetime and search
        zone_scores = (
            Busyness.objects
            .filter(datetime=datetime_obj)
            .annotate(
                demographic_score=Coalesce(Subquery(demographic_subquery), Value(0.0))
            )
        )

        data = [
            {
                "zone_id": score.zone.id,
                "zone_name": score.zone.name,
                "demographic_score": score.demographic_score,
                "busyness_score": score.busyness_score,
                "total_score": score.busyness_score + score.demographic_score
            }
            for score in zone_scores
        ]

        # Cache the data for future requests
        cache.set(cache_key, data, timeout=60 * 15)  # Cache for 15 minutes
        return Response({"zone_scores": data}, status=status.HTTP_200_OK)


class ZoneDetailsBySearchDateZoneView(APIView):
    """
    API view to retrieve zone details for a given search ID, date, and zone ID.
    """
    def get(self, request, *args, **kwargs):
        # Extract query parameters
        search_id = request.query_params.get('search_id')
        date_str = request.query_params.get('date')
        zone_id = request.query_params.get('zone_id')

        # Validate and parse the date
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except (ValueError, TypeError):
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve the search object
        search = get_object_or_404(Search, id=search_id)
        zone_id = int(zone_id)

        # Create a subquery to retrieve the demographic score for the zone in the search
        demographic_subquery = Demographic.objects.filter(
            zone=OuterRef('zone_id'), search=search
        ).values('score')[:1]

        # Filter and annotate the Busyness queryset
        busyness_scores = (
            Busyness.objects
            .filter(datetime__date=date, zone_id=zone_id)
            .annotate(
                demographic_score=Coalesce(Subquery(demographic_subquery), Value(0.0))
            )
        )

        if not busyness_scores.exists():
            return Response({"error": "No busyness scores found for the specified parameters."}, status=status.HTTP_404_NOT_FOUND)

        # Assuming all busyness_scores have the same zone and demographic score, we get the first one for these details
        first_score = busyness_scores.first()

        data = {
            "zone_id": first_score.zone.id,
            "zone_name": first_score.zone.name,
            "demographic_score": first_score.demographic_score,
            "busyness_scores": [
                {
                    "time": score.datetime,
                    "busyness_score": score.busyness_score
                }
                for score in busyness_scores
            ]
        }

        return Response(data, status=status.HTTP_200_OK)

class BillboardsByZoneView(APIView):
    """
    API view to retrieve all billboards in a specific zone.
    """
    def get(self, request, zone_id, *args, **kwargs):
        billboards = Billboard.objects.filter(zone_id=zone_id)
        serializer = BillboardSerializer(billboards, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class InterestZoneCountByZoneView(APIView):
    """
    API view to retrieve all interest zone counts in a specific zone.
    """
    def get(self, request, zone_id, *args, **kwargs):
        interest_zone_counts = InterestZoneCount.objects.filter(zone_id=zone_id).select_related('interest')
        
        data = {item.interest.name: item.count for item in interest_zone_counts}
        
        return Response(data, status=status.HTTP_200_OK)
    

class UserCreditsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        return Response({'credits': user.credits}, status=status.HTTP_200_OK)
    
class CreditUsageAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        today = datetime.now().date()
        last_30_days = today - timedelta(days=30)

        # Calculate credits used today
        credits_used_today = CreditUsage.objects.filter(user=user, date_used__date=today).aggregate(total=models.Sum('credits_used'))['total'] or 0

        # Calculate credits used in the last 30 days
        credits_used_last_30_days = CreditUsage.objects.filter(user=user, date_used__date__gte=last_30_days).aggregate(total=models.Sum('credits_used'))['total'] or 0

        # Get all credit usage records for the user
        credit_usages = CreditUsage.objects.filter(user=user).order_by('-date_used')
        serializer = CreditUsageSerializer(credit_usages, many=True)

        return Response({
            'credits_used_today': credits_used_today,
            'credits_used_last_30_days': credits_used_last_30_days,
            'credit_usage_history': serializer.data
        }, status=status.HTTP_200_OK)

class PasswordResetRequestView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        try:
            user = CustomUser.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_url = f'http://34.252.245.42:3000/reset-password/{uid}/{token}/'
            send_mail(
                'Password Reset Request',
                f'Click the link to reset your password: {reset_url}',
                'noreply@example.com',
                [user.email],
            )
            return Response({'message': 'Password reset link sent'}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User with this email does not exist'}, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    permission_classes = (AllowAny,)  

    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid)
            if default_token_generator.check_token(user, token):
                password = request.data.get('password')
                user.set_password(password)
                user.save()
                return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Invalid user'}, status=status.HTTP_400_BAD_REQUEST)

import logging

logger = logging.getLogger(__name__)

class PredictBusynessAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # Validate the request using the serializer
        serializer = PredictionRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        prediction_time = serializer.validated_data['prediction_time']

        # Define the paths to the necessary files
        path_to_zones_csv = '../model_data/zones_df.csv'
        path_to_latest_historical_data_csv = '../model_data/latest_historical_data.csv'
        path_to_pickle_file = '../model_data/xgboost_busyness_model.pkl'

        # Make predictions
        #predictions = make_predictions(
            #prediction_time,
            #path_to_pickle_file,
            #path_to_zones_csv,
            #path_to_latest_historical_data_csv
        #)

        # Serialize the predictions DataFrame to JSON
        #predictions_serializer = PredictionSerializer(predictions, many=True)

        #return Response(predictions_serializer.data)


class CreatePaymentIntentView(APIView):
    def post(self, request, *args, **kwargs):
        amount = request.data.get('amount')
        if not amount:
            return Response({"error": "Amount is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            intent = stripe.PaymentIntent.create(
                amount=int(amount) * 100,  # Stripe works with cents
                currency='usd',
                metadata={'user_id': request.user.id}
            )
            return Response({"client_secret": intent['client_secret']})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

stripe.api_key = settings.STRIPE_SECRET_KEY

@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(View):
    def post(self, request, *args, **kwargs):
        
        payload = request.body
        print(payload)
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']
        endpoint_secret = 'your_endpoint_secret'

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError as e:
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError as e:
            return HttpResponse(status=400)

        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            user_id = payment_intent['metadata']['user_id']
            user = CustomUser.objects.get(id=user_id)
            user.credits += int(payment_intent['amount']) // 100  # Convert cents to dollars
            user.save()

        return HttpResponse(status=200)
    
class TestMethodAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return JsonResponse({'message': 'POST request received.'}, status=status.HTTP_200_OK)

    def get(self, request):
        return JsonResponse({'error': 'Invalid HTTP method. Only POST requests are allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)