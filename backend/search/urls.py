
from django.urls import path
from .views import SearchAPIView,  SingleSearchAPIView


urlpatterns = [

    path('', SearchAPIView.as_view(), name='search_api'),
    path('<int:id>/', SingleSearchAPIView.as_view(), name='single_search_api'),
]
