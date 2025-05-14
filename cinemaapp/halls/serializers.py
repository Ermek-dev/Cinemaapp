from rest_framework import serializers
from .models import Hall


class HallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hall
        fields = ('id','title','rows','seatsPerRow')


    def validate_title(self, value):
        if not value:
            raise serializers.ValidationError("Название зала не может быть пустым")
        return value


    def validate_rows(self,value):
        if value<=0:
            raise serializers.ValidationError("Количество рядов должно быть больше нуля ")
        return value


    def validate_seatsPerRow(self, value):
        if value<=0:
            raise serializers.ValidationError("Количество мест в ряду должно быть больше нуля ")
        return value

