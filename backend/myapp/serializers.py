"""
Serializers for the 'myapp' application.

This module defines the serializers used for serializing and deserializing user data and handling 
JWT token generation with custom claims.

Classes:
    UserSerializer: Serializer for the CustomUser model, handling user creation and serialization.
    MyTokenObtainPairSerializer: Serializer for customizing JWT token claims.
    SearchSerializer: Serializer for the Search model, handling the conversion between 
                      Search instances and JSON representations.

"""

from rest_framework import serializers
from .models import  Busyness, Demographic


class BusynessSerializer(serializers.ModelSerializer):
    time = serializers.DateTimeField(source='datetime')
    score = serializers.FloatField(source='busyness_score')

    class Meta:
        model = Busyness
        fields = ['time', 'score']

class DemographicSerializer(serializers.ModelSerializer):
    demographic_score = serializers.FloatField(source='score')

    class Meta:
        model = Demographic
        fields = ['demographic_score']

class ZoneScoresSerializer(serializers.Serializer):
    zone_id = serializers.IntegerField(source='zone.id')
    demographic_score = serializers.FloatField()
    busyness_scores = BusynessSerializer(many=True)

 
class PredictionRequestSerializer(serializers.Serializer):
    prediction_time = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')

class PredictionSerializer(serializers.Serializer):
    timestamp = serializers.DateTimeField()
    zone_id = serializers.IntegerField()
    predicted_log_busyness_score = serializers.FloatField()
    predicted_busyness_score = serializers.FloatField()

