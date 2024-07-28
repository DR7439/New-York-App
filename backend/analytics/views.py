from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from django.db.models import Max, OuterRef, Subquery, Value
from django.db.models.functions import Coalesce
from django.utils.dateparse import parse_datetime
from datetime import datetime

from search.models import Search
from zones.models import Zone, AdvertisingLocation
from .models import Busyness, Demographic, Zone




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

