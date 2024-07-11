
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import UserCreate, MyTokenObtainPairView, SearchAPIView, PasswordResetRequestView, PasswordResetConfirmView, InterestAPIView, SingleSearchAPIView, ZoneListView, SearchScoresView, ZoneDetailView, TopNScoresView, TopZonesView, BillboardsByZoneView, InterestZoneCountByZoneView, TopNScoresInZoneView, ZoneScoresByDatetimeView, ZoneDetailsBySearchDateZoneView, PredictBusynessAPIView, TestMethodAPIView

urlpatterns = [
    path('register/', UserCreate.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('searches/top-scores/', TopNScoresView.as_view(), name='top-scores'),
    path('top-zones/', TopZonesView.as_view(), name='top-zones'),
    path('search/', SearchAPIView.as_view(), name='search_api'),
    path('search/<int:id>/', SingleSearchAPIView.as_view(), name='single_search_api'),
    path('interests/', InterestAPIView.as_view(), name='interests'),
    path('zones/', ZoneListView.as_view(), name='zone-list'),
    path('zones/<int:zone_id>/interests', InterestZoneCountByZoneView.as_view(), name='interest-zone-counts-by-zone'),
    path('zones/<int:zone_id>/details/', ZoneDetailView.as_view(), name='zone-details'),
    path('searches/<int:search_id>/scores/', SearchScoresView.as_view(), name='search-scores'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('reset-password/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('billboards/zone/<int:zone_id>/', BillboardsByZoneView.as_view(), name='billboards-by-zone'),
    path('top-scores-in-zone/', TopNScoresInZoneView.as_view(), name='top-scores-in-zone'),
    path('zone-scores-by-datetime/', ZoneScoresByDatetimeView.as_view(), name='zone-scores-by-datetime'),
    path('zone-details-by-search-date-zone/', ZoneDetailsBySearchDateZoneView.as_view(), name='zone-details-by-search-date-zone'),   
    path('predict_busyness/', PredictBusynessAPIView.as_view(), name='predict_busyness'),
    path('test_method/', TestMethodAPIView.as_view(), name='test_method'),

]
