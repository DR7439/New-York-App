#from django.contrib.auth import authenticate
from rest_framework import permissions, status  # Ensure this import
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import   PredictionRequestSerializer
from django.http import JsonResponse
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
