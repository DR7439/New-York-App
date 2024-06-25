"""
URL Configuration for the 'myapp' application.
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import UserCreate, MyTokenObtainPairView, SearchAPIView, PasswordResetRequestView, PasswordResetConfirmView, InterestAPIView, SingleSearchAPIView, ZoneListView, SearchScoresView

SingleSearchAPIView
urlpatterns = [
    path('register/', UserCreate.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('search/', SearchAPIView.as_view(), name='search_api'),
    path('search/<int:id>/', SingleSearchAPIView.as_view(), name='single_search_api'),
    path('interests/', InterestAPIView.as_view(), name='interests'),
    path('zones/', ZoneListView.as_view(), name='zone-list'),
    path('searches/<int:search_id>/scores/', SearchScoresView.as_view(), name='search-scores'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('reset-password/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
