# myapp/serializers.py
from rest_framework import serializers  
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['name'] = user.name
        token['credits'] = user.credits

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Add additional responses here
        data['user'] = UserSerializer(self.user).data

        return data



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('username', 'password', 'name', 'credits')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            name=validated_data.get('name', ''),
            credits=validated_data.get('credits', 0),
        )
        return user