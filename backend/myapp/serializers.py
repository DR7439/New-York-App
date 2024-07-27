from rest_framework import serializers



 
class PredictionRequestSerializer(serializers.Serializer):
    prediction_time = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')

class PredictionSerializer(serializers.Serializer):
    timestamp = serializers.DateTimeField()
    zone_id = serializers.IntegerField()
    predicted_log_busyness_score = serializers.FloatField()
    predicted_busyness_score = serializers.FloatField()

