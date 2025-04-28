from rest_framework import serializers
from .models import Movie


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ('id','title','description','duration','posterUrl','createdAt')
        read_only_fields = ('id','createdAt')
