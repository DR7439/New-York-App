"""
URL Configuration for the 'myapp' application.
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import UserCreate, MyTokenObtainPairView, SearchCreate, SearchList, PasswordResetRequestView, PasswordResetConfirmView

urlpatterns = [
    path('register/', UserCreate.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('search/', SearchCreate.as_view(), name='search_create'),
    path('search/list/', SearchList.as_view(), name='search_list'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('reset-password/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]