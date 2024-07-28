
from django.urls import path


from .views import PredictBusynessAPIView, TestMethodAPIView


urlpatterns = [

    
    path('predict_busyness/', PredictBusynessAPIView.as_view(), name='predict_busyness'),
    path('test_method/', TestMethodAPIView.as_view(), name='test_method'),

]
