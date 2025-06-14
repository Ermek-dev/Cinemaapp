from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    sessionId = serializers.IntegerField(source='session.id',read_only=True)
    class Meta:
        model = Booking
        fields = ['id', 'user', 'sessionId','seats','createdAt']

    def validate_seats(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Поле 'seats' должно быть списком!!!")
        for seat in value:
            if not isinstance(seat, dict) or 'row' not in seat or 'seat' not in seat:
                raise serializers.ValidationError("Каждое место должно быть словарем с ключами 'rows' и 'seat'")