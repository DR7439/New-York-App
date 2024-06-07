"""
Utility functions for the 'myapp' application.

This module contains utility functions that assist with common tasks within the 'myapp' application.

Functions:
    my_jwt_response_handler: Custom handler for JWT responses, including the token and serialized user data.

"""

from myapp.serializers import UserSerializer

def my_jwt_response_handler(token, user=None, request=None):
    """
    Custom handler for JWT responses.

    This function generates a response containing the JWT token and the serialized user data.
    It is typically used to customize the response format for JWT authentication.

    Args:
        token (str): The JWT token generated for the authenticated user.
        user (CustomUser, optional): The authenticated user. Defaults to None.
        request (Request, optional): The HTTP request object. Defaults to None.

    Returns:
        dict: A dictionary containing the JWT token and the serialized user data.
    """
    return {
        'token': token,
        'user': UserSerializer(user, context={'request': request}).data
    }
