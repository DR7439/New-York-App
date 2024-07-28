from django.contrib.auth import get_user_model
from django.contrib.auth.middleware import get_user
from django.contrib.auth.models import AnonymousUser
from django.utils.functional import SimpleLazyObject
from rest_framework_simplejwt.authentication import JWTAuthentication

CustomUser = get_user_model()

def get_jwt_user(request):
    user = get_user(request)
    if user.is_authenticated:
        return user

    jwt_authentication = JWTAuthentication()
    try:
        user_auth_tuple = jwt_authentication.authenticate(request)
        if user_auth_tuple is not None:
            return user_auth_tuple[0]
    except Exception as e:
        pass

    return AnonymousUser()

class JWTSessionMiddleware:
    """
    Middleware that adds a user to the request based on JWT and creates a session for the user.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.user = SimpleLazyObject(lambda: get_jwt_user(request))
        response = self.get_response(request)

        if request.user.is_authenticated and not request.session.session_key:
            request.session.create()

        return response
