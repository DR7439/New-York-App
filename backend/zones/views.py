from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from django.core.cache import cache

from .models import Zone, Interest, InterestZoneCount, Billboard
from .serializers import ZoneSerializer, ZoneDetailSerializer, BillboardSerializer, InterestSerializer


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
    
class InterestZoneCountByZoneView(APIView):
    """
    API view to retrieve all interest zone counts in a specific zone.
    """
    def get(self, request, zone_id, *args, **kwargs):
        interest_zone_counts = InterestZoneCount.objects.filter(zone_id=zone_id).select_related('interest')
        
        data = {item.interest.name: item.count for item in interest_zone_counts}
        
        return Response(data, status=status.HTTP_200_OK)
    

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

class BillboardsByZoneView(APIView):
    """
    API view to retrieve all billboards in a specific zone.
    """
    def get(self, request, zone_id, *args, **kwargs):
        billboards = Billboard.objects.filter(zone_id=zone_id)
        serializer = BillboardSerializer(billboards, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


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
