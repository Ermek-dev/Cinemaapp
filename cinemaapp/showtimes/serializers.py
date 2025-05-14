from rest_framework import serializers
from .models import Session


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['id', 'movie', 'hall', 'startTime', 'price']


    def validate_price(self, value):
        if value<0:
            raise serializers.ValidationError("Цена не может быть отрицательной")
        return value