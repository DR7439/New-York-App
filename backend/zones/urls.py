
from django.urls import path


from .views import InterestAPIView, ZoneListView,  ZoneDetailView, BillboardsByZoneView, InterestZoneCountByZoneView   


urlpatterns = [
    

    path('', ZoneListView.as_view(), name='zone-list'),
    path('<int:zone_id>/interests', InterestZoneCountByZoneView.as_view(), name='interest-zone-counts-by-zone'),
    path('<int:zone_id>/details/', ZoneDetailView.as_view(), name='zone-details'),
    path('<int:zone_id>/billboards/', BillboardsByZoneView.as_view(), name='billboards-by-zone'),
    path('interests/', InterestAPIView.as_view(), name='interests'),

    
]
