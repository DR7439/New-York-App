from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import (
    UserCreate, MyTokenObtainPairView, PasswordResetRequestView,
    PasswordResetConfirmView, UpdateUserProfileView, DropdownOptionsView,
    CreatePaymentIntentView, StripeWebhookView, CreditUsageAPIView,
    UserCreditsAPIView, UserFreeSearchAPIView
)

urlpatterns = [
    path('register/', UserCreate.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('reset-password/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('profile/', UpdateUserProfileView.as_view(), name='update-user-profile'),
    path('dropdown-options/', DropdownOptionsView.as_view(), name='dropdown-options'),
    path('create-payment-intent/', CreatePaymentIntentView.as_view(), name='create-payment-intent'),
    path('stripe-webhook', StripeWebhookView.as_view(), name='stripe-webhook'),
    path('credits/usage/', CreditUsageAPIView.as_view(), name='credit-usage'),
    path('credits/', UserCreditsAPIView.as_view(), name='user-credits'),
    path('free-search/', UserFreeSearchAPIView.as_view(), name='user-free-search'),
]
