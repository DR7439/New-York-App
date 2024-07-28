from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CreditUsage

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
    
class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'username', 'email', 'first_name', 'last_name', 'date_of_birth', 'nationality',
            'industry', 'business_size', 'budget', 'business_description'
        ]

    def validate_email(self, value):
        """
        Check if the email is already in use by another user.
        """
        user = self.context['request'].user
        if CustomUser.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("This email address is already in use.")
        return value

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
    

class CreditUsageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditUsage
        fields = ['date_used', 'credits_used']


class UserFreeSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['free_search']