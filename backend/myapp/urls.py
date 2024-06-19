"""
URL Configuration for the 'myapp' application.
"""


from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import UserCreate, MyTokenObtainPairView, SearchCreate

urlpatterns = [
    path('register/', UserCreate.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('search/', SearchCreate.as_view(), name='search_create'),
]
