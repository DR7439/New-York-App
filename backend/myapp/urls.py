
from django.urls import path


from .views import SearchAPIView, InterestAPIView, SingleSearchAPIView, ZoneListView,  ZoneDetailView, TopZonesView, BillboardsByZoneView, InterestZoneCountByZoneView, ZoneScoresByDatetimeView, ZoneDetailsBySearchDateZoneView, PredictBusynessAPIView, TestMethodAPIView, RecommendAdvertisingLocationsView


urlpatterns = [
    # path('users/register/', UserCreate.as_view(), name='register'),
    # path('users/login/', MyTokenObtainPairView.as_view(), name='login'),
    # path('users/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('users/password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    # path('users/reset-password/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    # path('users/profile/', UpdateUserProfileView.as_view(), name='update-user-profile'),
    # path('users/dropdown-options/', DropdownOptionsView.as_view(), name='dropdown-options'),#_____________________________________________________________Didnt find in FE
    # path('users/create-payment-intent/', CreatePaymentIntentView.as_view(), name='create-payment-intent'), 
    # path('users/stripe-webhook', StripeWebhookView.as_view(), name='stripe-webhook'),
    # path('users/credits/usage/', CreditUsageAPIView.as_view(), name='credit-usage'),
    # path('users/credits/', UserCreditsAPIView.as_view(), name='user-credits'),
    # path('users/free-search/', UserFreeSearchAPIView.as_view(), name='user-free-search'),


    path('analytics/top-zones/', TopZonesView.as_view(), name='top-zones'), #used to populate the table
    #path('searches/top-scores/', TopNScoresView.as_view(), name='top-scores'),
    path('analytics/zone-scores-by-datetime/', ZoneScoresByDatetimeView.as_view(), name='zone-scores-by-datetime'), #think used for map
    path('analytics/zone-details-by-search-date-zone/', ZoneDetailsBySearchDateZoneView.as_view(), name='zone-details-by-search-date-zone'),   #used for line chart
    path('analytics/recommend-advertising-locations/', RecommendAdvertisingLocationsView.as_view(), name='recommend-advertising-locations'),
    

    path('search/', SearchAPIView.as_view(), name='search_api'),
    path('search/<int:id>/', SingleSearchAPIView.as_view(), name='single_search_api'),


    path('zones/', ZoneListView.as_view(), name='zone-list'),
    path('zones/<int:zone_id>/interests', InterestZoneCountByZoneView.as_view(), name='interest-zone-counts-by-zone'),
    path('zones/<int:zone_id>/details/', ZoneDetailView.as_view(), name='zone-details'),
    path('zones/<int:zone_id>/billboards', BillboardsByZoneView.as_view(), name='billboards-by-zone'),
    path('zones/interests/', InterestAPIView.as_view(), name='interests'),

    #path('top-scores-in-zone/', TopNScoresInZoneView.as_view(), name='top-scores-in-zone'), #not used by frontend
    #path('searches/<int:search_id>/scores/', SearchScoresView.as_view(), name='search-scores'), #not used by frontend, good for testing
    
    path('predict_busyness/', PredictBusynessAPIView.as_view(), name='predict_busyness'),
    path('test_method/', TestMethodAPIView.as_view(), name='test_method'),

]
