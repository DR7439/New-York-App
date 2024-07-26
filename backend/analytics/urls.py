
from django.urls import path


from .views import TopZonesView,  ZoneScoresByDatetimeView, ZoneDetailsBySearchDateZoneView, RecommendAdvertisingLocationsView


urlpatterns = [


    path('analytics/top-zones/', TopZonesView.as_view(), name='top-zones'), 
    path('analytics/zone-scores-by-datetime/', ZoneScoresByDatetimeView.as_view(), name='zone-scores-by-datetime'), #think used for map
    path('analytics/zone-details-by-search-date-zone/', ZoneDetailsBySearchDateZoneView.as_view(), name='zone-details-by-search-date-zone'),   #used for line chart
    path('analytics/recommend-advertising-locations/', RecommendAdvertisingLocationsView.as_view(), name='recommend-advertising-locations'),
    

]
