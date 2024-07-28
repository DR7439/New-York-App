from rest_framework import serializers
from .models import AgeCategory, Interest, Zone, PopulationData, Billboard


class AgeCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AgeCategory
        fields = ['age_range']


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
   