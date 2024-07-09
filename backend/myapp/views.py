#from django.contrib.auth import authenticate
from rest_framework import generics, permissions, status  # Ensure this import
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import CustomUser, Search, Interest, Zone, Busyness, Demographic
from .serializers import UserSerializer, MyTokenObtainPairSerializer, SearchSerializer, InterestSerializer, ZoneSerializer, BusynessSerializer, ZoneDetailSerializer, PredictionRequestSerializer, PredictionSerializer

from .tasks import background_task
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.db.models import F, FloatField, ExpressionWrapper, Value
from django.db.models.functions import Coalesce, Cast
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
import json
import os
import json
import joblib

from predictions_function import make_predictions

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
        return Response({
            'token': token,
            'user': UserSerializer(user).data
        })
    

class SearchAPIView(APIView):
    """
    API view for handling searches related to the authenticated user.

    This view handles GET, POST, and DELETE requests for searches associated with the current user.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SearchSerializer

    def get(self, request, *args, **kwargs):
        """
        Handles GET requests and returns a list of searches for the authenticated user.
        """
        searches = Search.objects.filter(user=request.user)
        serializer = self.serializer_class(searches, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests and creates a new search for the authenticated user.
        """
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            search_id = serializer.instance.id
            print("search_id: ", search_id)
            background_task.delay(search_id)
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
        zones = Zone.objects.all()
        serializer = ZoneSerializer(zones, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
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
            demographic = Demographic.objects.get(search=search, zone=zone)
            busyness_scores = Busyness.objects.filter(zone=zone, datetime__range=[search.start_date, search.end_date])

            zone_data = {
                'zone_id': zone.id,
                'demographic_score': demographic.score,
                'busyness_scores': BusynessSerializer(busyness_scores, many=True).data
            }
            data.append(zone_data)

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
    def get(self, request, search_id, top_n, *args, **kwargs):
        search = get_object_or_404(Search, id=search_id)
        top_n = min(top_n, 100)
        
        top_scores = (
            Busyness.objects
            .filter(datetime__range=[search.start_date, search.end_date])
            .annotate(
                demographic_score=Coalesce(Cast(F('zone__demographic__score'), FloatField()), Value(0.0)),
                combined_score=ExpressionWrapper(
                    Cast(F('busyness_score'), FloatField()) + Coalesce(Cast(F('zone__demographic__score'), FloatField()), Value(0.0)), 
                    output_field=FloatField()
                )
            )
            .order_by('-combined_score')[:top_n]
        )

        data = [
            {
                "zone_id": score.zone.id,
                "datetime": score.datetime,
                "demographic_score": score.demographic_score,
                "busyness_score": score.busyness_score,
                "combined_score": score.combined_score
            }
            for score in top_scores
        ]

        return Response({"top_scores": data}, status=status.HTTP_200_OK)

class PasswordResetRequestView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        try:
            user = CustomUser.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_url = f'http://localhost:3000/reset-password/{uid}/{token}/'
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
        predictions = make_predictions(
            prediction_time,
            path_to_pickle_file,
            path_to_zones_csv,
            path_to_latest_historical_data_csv
        )

        # Serialize the predictions DataFrame to JSON
        predictions_serializer = PredictionSerializer(predictions, many=True)

        return Response(predictions_serializer.data)
    
class TestMethodAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return JsonResponse({'message': 'POST request received.'}, status=status.HTTP_200_OK)

    def get(self, request):
        return JsonResponse({'error': 'Invalid HTTP method. Only POST requests are allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)