#from django.contrib.auth import authenticate
from rest_framework import generics, permissions, status  # Ensure this import
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import CustomUser
from .serializers import UserSerializer, MyTokenObtainPairSerializer

class UserCreate(generics.CreateAPIView):
    """
    API view for creating a new user.

    This view handles the creation of new users. It inherits from Django Rest Framework's 
    `CreateAPIView`, which provides the `create` method for handling POST requests.

    Attributes:
        queryset (QuerySet): The queryset used for retrieving user instances.
        serializer_class (Serializer): 
                        The serializer class used for validating and deserializing input, 
                        and for serializing output.
        permission_classes (tuple): The permission classes that this view requires.

    Methods:
        create(request, *args, **kwargs):
            Handles POST requests to create a new user. Checks if a user with the given username 
            already exists before proceeding with creation. If the username already exists, 
            returns a 400 BAD REQUEST response with an appropriate error message.
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)

    def create(self, request, *args, **kwargs):
        """
        Handles POST requests to create a new user.

        Args:
            request (Request): The request object containing the new user data.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: A Response object containing the serialized data of the created user,
                      or an error message if the username already exists.
        """
        username = request.data.get("username")
        if CustomUser.objects.filter(username=username).exists():
            return Response(
                {"error": "A user with that username already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().create(request, *args, **kwargs)

class MyTokenObtainPairView(TokenObtainPairView):
    """
    API view for obtaining a pair of access and refresh JSON web tokens.

    This view handles the generation of JWT tokens for authenticated users. It extends 
    `TokenObtainPairView` from Simple JWT to include user details in the response.

    Attributes:
        serializer_class (Serializer): The serializer class used for validating the user credentials 
                                       and generating the tokens.

    Methods:
        post(request, *args, **kwargs):
            Handles POST requests to authenticate a user and generate JWT tokens. Returns the 
            generated access token along with the authenticated user's details.
    """
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests to authenticate a user and generate JWT tokens.

        Args:
            request (Request): The request object containing the user credentials.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: A Response object containing the generated access token and the authenticated 
                      user's serialized data.
        """
        response = super().post(request, *args, **kwargs)
        token = response.data['access']
        user = CustomUser.objects.get(username=request.data['username'])
        return Response({
            'token': token,
            'user': UserSerializer(user).data
        })
