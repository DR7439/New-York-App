#from django.contrib.auth import authenticate
from rest_framework import generics, permissions, status  # Ensure this import
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import Search, Interest, Zone, Busyness, Demographic, Billboard, InterestZoneCount, AdvertisingLocation
from users.models import CreditUsage
from .serializers import  SearchSerializer, InterestSerializer, ZoneSerializer, BusynessSerializer, ZoneDetailSerializer, BillboardSerializer, PredictionRequestSerializer, PredictionSerializer

from .tasks import background_task


from django.core.cache import cache

from django.utils.dateparse import parse_datetime

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




class SearchAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SearchSerializer

    def get_cache_key(self, user_id):
        return f"user_searches_{user_id}"

    def get(self, request, *args, **kwargs):

        searches = Search.objects.filter(user=request.user)
        serializer = self.serializer_class(searches, many=True)
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

        if start_date > end_date:
            return Response({"error": "Start date must be before end date."}, status=status.HTTP_400_BAD_REQUEST)

        search_duration = (end_date - start_date).days + 1  # Including both start and end date
        if search_duration > 15:
            return Response({"error": "Search duration cannot be more than 15 days."}, status=status.HTTP_400_BAD_REQUEST)

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
            print(search.start_date , date.date() , search.end_date)
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
    

class RecommendAdvertisingLocationsView(APIView):
    """
    API view to recommend top N advertising locations based on combined demographic and busyness scores and cost per day.
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

        cache_key = f"recommend_advertising_locations_{search_id}_{date_str}_{top_n}"
        cached_data = cache.get(cache_key)

        # Step 3: Get busyness data for each zone for that day
        busyness_data = Busyness.objects.filter(datetime__date=date.date())

        # Step 4: Find the max busyness for each zone and corresponding time
        max_busyness_per_zone = busyness_data.values('zone_id').annotate(max_busyness=Max('busyness_score'))
        max_busyness_times = {item['zone_id']: busyness_data.filter(zone_id=item['zone_id'], busyness_score=item['max_busyness']).first().datetime for item in max_busyness_per_zone}

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
                'demographic_score': demographic_score,
                'max_busyness': max_busyness,
                'max_busyness_time': max_busyness_times[zone_id]
            })
        
        # Step 7: Get advertising locations for the zones
        advertising_locations = AdvertisingLocation.objects.filter(zone_id__in=[z['zone_id'] for z in zone_scores])

        # Step 8: Recommend top N advertising locations based on combined score and cost per day
        recommendations = []
        for location in advertising_locations:
            zone_score = next(z for z in zone_scores if z['zone_id'] == location.zone_id)

            total_score_with_cost = zone_score['total_score'] - (location.calculated_cpm / 10) + (location.views / 250000)
            if location.calculated_cpm == 0:
                total_score_with_cost -= 100

            if location.category_alias == 'Restaurant / Bar' or location.category_alias == 'Movie Theater':
                if 2 <= zone_score['max_busyness_time'].hour < 12:
                    total_score_with_cost = 0

           
            recommendations.append({
                'location': location.location,
                'format': location.format,
                'category_alias': location.category_alias,
                'market': location.market,
                'size': location.size,
                'description': location.description,
                'calculated_cpm': location.calculated_cpm,
                'views': location.views,
                'design_url': location.design_template_url,
                'cost_per_day': location.cost_per_day,
                'latitude': location.latitude,
                'longitude': location.longitude,
                'zone_id': location.zone_id,
                'zone_name': zone_score['zone_name'],
                'total_score': zone_score['total_score'],
                'total_score_with_cost': total_score_with_cost,
                'demographic_score': zone_score['demographic_score'],
                'max_busyness': zone_score['max_busyness'],
                'max_busyness_time': zone_score['max_busyness_time'],
                'property': location.property_id,
                'photo_url': location.photo_url
            })


        recommendations = sorted(recommendations, key=lambda x: -x['total_score_with_cost'])[:top_n]

        cache.set(cache_key, recommendations, timeout=60 * 60)  # Cache for 1 hour
        return Response(recommendations, status=status.HTTP_200_OK)

class InterestZoneCountByZoneView(APIView):
    """
    API view to retrieve all interest zone counts in a specific zone.
    """
    def get(self, request, zone_id, *args, **kwargs):
        interest_zone_counts = InterestZoneCount.objects.filter(zone_id=zone_id).select_related('interest')
        
        data = {item.interest.name: item.count for item in interest_zone_counts}
        
        return Response(data, status=status.HTTP_200_OK)
    

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

class TestMethodAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return JsonResponse({'message': 'POST request received.'}, status=status.HTTP_200_OK)

    def get(self, request):
        return JsonResponse({'error': 'Invalid HTTP method. Only POST requests are allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)