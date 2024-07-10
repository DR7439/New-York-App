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

from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Search, AgeCategory, Interest, Zone, Busyness, Demographic, PopulationData, Billboard

CustomUser = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the CustomUser model.

    This serializer handles the serialization and deserialization of user data, including the 
    creation of new user instances.

    Meta:
        model (Model): The model class that this serializer is associated with.
        fields (tuple): The fields of the model to include in the serialized representation.

    Methods:
        create(validated_data):
            Creates and returns a new user instance, given the validated data.
    """
    class Meta:
        """
         Attributes:
            model (Model): The model class that this serializer is associated with.
            fields (tuple): The fields of the model to include in the serialized representation.
        """
        model = CustomUser
        fields = ('username', 'password', 'name', 'email')

    def create(self, validated_data):
        """
        Creates and returns a new user instance.

        Args:
            validated_data (dict): The validated data for creating a new user.

        Returns:
            CustomUser: The newly created user instance.
        """
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            name=validated_data.get('name', ''),
            credits=1000,
            email=validated_data['email']
        )
        return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializer for obtaining JWT tokens with custom claims.

    This serializer customizes the JWT token to include additional user information.

    Methods:
        get_token(cls, user):
            Generates a JWT token for the given user, adding custom claims.
    """
    @classmethod
    def get_token(cls, user):
        """
        Generates a JWT token for the given user, adding custom claims.

        Args:
            user (CustomUser): The user for whom the token is being generated.

        Returns:
            token (RefreshToken): The generated JWT token with custom claims.
        """
        token = super().get_token(user)
        # Add custom claims here
        token['name'] = user.name
        token['credits'] = user.credits
        return token
    
    def create(self, validated_data):
        """
        Create method to satisfy the abstract method requirement.
        """
        raise NotImplementedError("Create method is not implemented")

    def update(self, instance, validated_data):
        """
        Update method to satisfy the abstract method requirement.
        """
        raise NotImplementedError("Update method is not implemented")
    
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
    class Meta:
        model = Zone
        fields = ['id','name', 'boundary_coordinates']

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