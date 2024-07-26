
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
