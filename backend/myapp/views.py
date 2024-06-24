#from django.contrib.auth import authenticate
from rest_framework import generics, permissions, status  # Ensure this import
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import CustomUser, Search, Interest
from .serializers import UserSerializer, MyTokenObtainPairSerializer, SearchSerializer, InterestSerializer
from .tasks import background_task
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny


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
        email = request.data.get("email")
        if CustomUser.objects.filter(username=username).exists():
            return Response(
                {"error": "A user with that username already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if CustomUser.objects.filter(email=email).exists():
            return Response(
                {"error": "A user with that email already exists."},
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
    

class SearchAPIView(APIView):
    """
    API view for handling searches related to the authenticated user.

    This view handles GET, POST, and DELETE requests for searches associated with the current user.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SearchSerializer

    def get(self, request, *args, **kwargs):
        """
        Handles GET requests and returns a list of searches for the authenticated user.
        """
        searches = Search.objects.filter(user=request.user)
        serializer = self.serializer_class(searches, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests and creates a new search for the authenticated user.
        """
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            search_id = serializer.instance.id
            print("search_id: ", search_id)
            background_task.delay(search_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class InterestAPIView(APIView):
    """
    API view for handling interests.

    This view handles GET requests for the list of all interests.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = InterestSerializer

    def get(self, request, *args, **kwargs):
        """
        Handles GET requests and returns a list of all interests.
        """
        interests = Interest.objects.all()
        serializer = self.serializer_class(interests, many=True)
        return Response(serializer.data)


        
class PasswordResetRequestView(APIView):
    permission_classes = (AllowAny,)  # Add this line

    def post(self, request):
        email = request.data.get('email')
        try:
            user = CustomUser.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_url = f'http://localhost:3000/reset-password/{uid}/{token}/'
            send_mail(
                'Password Reset Request',
                f'Click the link to reset your password: {reset_url}',
                'noreply@example.com',
                [user.email],
            )
            return Response({'message': 'Password reset link sent'}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User with this email does not exist'}, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    permission_classes = (AllowAny,)  # Add this line

    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid)
            if default_token_generator.check_token(user, token):
                password = request.data.get('password')
                user.set_password(password)
                user.save()
                return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Invalid user'}, status=status.HTTP_400_BAD_REQUEST)

