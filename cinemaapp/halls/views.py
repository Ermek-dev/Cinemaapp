import logging
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Hall
from .serializers import HallSerializer
from accounts.permissions import IsAdmin
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import Http404


logger = logging.getLogger('cinemaapp')


class HallListView(APIView):
    def get(self, request, *args, **kwargs):
        halls = Hall.objects.all()
        serializer = HallSerializer(halls, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)


class HallDetailView(APIView):
    def get(self,request,pk,*args,**kwargs):
        try:
            hall = Hall.objects.get(pk=pk)
        except Hall.DoesNotExist:
            raise Http404("Зал не найден")

        serializer = HallSerializer(hall)
        return Response(serializer.data, status=status.HTTP_200_OK)


class HallCreateView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, *args, **kwargs):
        serializer = HallSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        hall = serializer.save()
        logger.info(f"Зал создан: ID={hall.id}")
        return Response(
            {'message': 'Зал успешно создан', 'id':hall.id},
            status=status.HTTP_201_CREATED
        )



class HallUpdateView(APIView):
    permission_classes =  [IsAdmin]
    authentication_classes = [JWTAuthentication]


    def put(self, request,pk,*args,**kwargs):
        try:
            hall = Hall.objects.get(pk=pk)
        except Hall.DoesNotExist:
            raise Exception("Зал не найден")

        serializer = HallSerializer(hall, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        logger.info(f"Зал обновлен: ID={hall.id}")
        return Response({'message': 'Информация о зале обновлена'})


class HallDeleteView(APIView):
    permission_classes = [IsAdmin]
    authentication_classes = [JWTAuthentication]


    def delete(self, request,pk,*args,**kwargs):
        try:
            hall = Hall.objects.get(pk=pk)
        except Hall.DoesNotExist:
            raise Exception("Зал не найден")
        hall.delete()
        logger.info(f"Зал удален: ID={pk}")
        return Response(
            {'message':'Зал успешно удален'},
            status=status.HTTP_204_NO_CONTENT
        )