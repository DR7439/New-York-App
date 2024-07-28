from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from datetime import datetime

from .models import Search
from users.models import CreditUsage
from .serializers import SearchSerializer
from myapp.tasks import background_task


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

