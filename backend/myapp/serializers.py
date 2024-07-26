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
from .models import Search, AgeCategory, Interest, Zone, Busyness, Demographic, PopulationData, Billboard


class AgeCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AgeCategory
        fields = ['age_range']

class SearchSerializer(serializers.ModelSerializer):
    """
    Serializer for the Search model.

    Converts Search instances to JSON representations and vice versa.

    Meta Attributes:
        model (Search): The model class being serialized.
        fields (list): The list of model fields to include in the serialization.
        read_only_fields (list): The list of fields that should be read-only.
    """
    target_age = serializers.PrimaryKeyRelatedField(queryset=AgeCategory.objects.all(), many=True)
    target_market_interests = serializers.SlugRelatedField(queryset=Interest.objects.all(), many=True, slug_field='name')

    class Meta:
        model = Search
        fields = ['id', 'name', 'user', 'start_date', 'end_date', 'date_search_made_on', 'target_market_interests', 'target_age', 'gender']
        read_only_fields = ['user']


class InterestSerializer(serializers.ModelSerializer):
    """
    Serializer for the Interest model.

    Converts Interest instances to JSON representations and vice versa.

    Meta Attributes:
        model (Interest): The model class being serialized.
        fields (list): The list of model fields to include in the serialization.
    """
    class Meta:
        model = Interest
        fields = ['name']

class ZoneSerializer(serializers.ModelSerializer):
    boundary_coordinates = serializers.SerializerMethodField()

    class Meta:
        model = Zone
        fields = ['id', 'name', 'boundary_coordinates']

    def get_boundary_coordinates(self, obj):
        coordinates = obj.boundary_coordinates['coordinates']
        if coordinates and isinstance(coordinates[0], list) and len(coordinates[0]) == 1:
            return coordinates[0][0]
        return coordinates

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


class ZoneDetailSerializer(serializers.ModelSerializer):
    age_demographics = serializers.SerializerMethodField()

    class Meta:
        model = Zone
        fields = ['id', 'name', 'age_demographics']

    def get_age_demographics(self, obj):
        demographics = PopulationData.objects.filter(zone=obj)
        return {data.age_category.age_range: data.population for data in demographics}
    

class BillboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Billboard
        fields = ['street_name', 'sign_illumination', 'sign_sq_footage', 'latitude', 'longitude', 'zone_id']
    
class PredictionRequestSerializer(serializers.Serializer):
    prediction_time = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')

class PredictionSerializer(serializers.Serializer):
    timestamp = serializers.DateTimeField()
    zone_id = serializers.IntegerField()
    predicted_log_busyness_score = serializers.FloatField()
    predicted_busyness_score = serializers.FloatField()

