# myapp/urls.py

from django.urls import path
from .views import UserCreate, MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', UserCreate.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
