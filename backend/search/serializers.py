from rest_framework import serializers
from .models import Search
from zones.models import AgeCategory, Interest

class SearchSerializer(serializers.ModelSerializer):
    """
    Serializer for the Search model.

    Converts Search instances to JSON representations and vice versa.

    Meta Attributes:
        model (Search): The model class being serialized.
        fields (list): The list of model fields to include in the serialization.
        read_only_fields (list): The list of fields that should be read-only.
    """
    target_age = serializers.PrimaryKeyRelatedField(queryset=AgeCategory.objects.all(), many=True)
    target_market_interests = serializers.SlugRelatedField(queryset=Interest.objects.all(), many=True, slug_field='name')

    class Meta:
        model = Search
        fields = ['id', 'name', 'user', 'start_date', 'end_date', 'date_search_made_on', 'target_market_interests', 'target_age', 'gender']
        read_only_fields = ['user']

