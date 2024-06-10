"""
Serializers for the 'myapp' application.

This module defines the serializers used for serializing and deserializing user data and handling 
JWT token generation with custom claims.

Classes:
    UserSerializer: Serializer for the CustomUser model, handling user creation and serialization.
    MyTokenObtainPairSerializer: Serializer for customizing JWT token claims.

"""

from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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
        fields = ('username', 'password', 'name', 'credits')

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
            credits=validated_data.get('credits', 0)
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
