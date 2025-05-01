from django.core.validators import URLValidator
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import Movie


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ('id','title','description','duration','posterUrl','createdAt')
        read_only_fields = ('id','createdAt')


    def validate_title(self, value):
        if not value:
            raise serializers.ValidationError("Название фильма не может быть пустым")
        return value


    def validate_duration(self, value):
        if value <=0:
            raise serializers.ValidationError("Продолжительность фильма не может быть больше 0 минут")
        return value


    def validate_posterUrl(self,value):
        validator = URLValidator()
        try:
            validator(value)
        except ValidationError:
            raise serializers.ValidationError("Пожалуйста введите корректный URL адрес")
        return value

