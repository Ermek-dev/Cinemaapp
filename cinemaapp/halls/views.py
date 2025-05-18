from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Hall
from .serializers import HallSerializer
from accounts.permissions import IsAdmin
from rest_framework_simplejwt.authentication import JWTAuthentication


# Create your views here.
class HallListView(APIView):
    def get(self, request, *args, **kwargs):
        halls = Hall.objects.all()
        serializer = HallSerializer(halls, many=True)
        return Response(serializer.data)


class HallDetailView(APIView):
    def get(self,request,pk,*args,**kwargs):
        try:
            hall = Hall.objects.get(pk=pk)
            serializer = HallSerializer(hall)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Hall.DoesNotExist:
            return Response({'error': 'Зал не найден'}, status=status.HTTP_404_NOT_FOUND)


class HallCreateView(APIView):
    permission_classes = [IsAdmin]


    def post(self, request, *args, **kwargs):
        serializer = HallSerializer(data=request.data)
        if serializer.is_valid():
            hall = serializer.save()
            return Response({'message': 'Зал успешно создан', 'id':hall.id}, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class HallUpdateView(APIView):
    permission_classes =  [IsAdmin]
    authentication_classes = [JWTAuthentication]

    def put(self, request,pk,*args,**kwargs):
        try:
            hall = Hall.objects.get(pk=pk)
        except Hall.DoesNotExist:
            return Response({'error': 'Зал не найден'}, status=status.HTTP_404_NOT_FOUND)


        serializer = HallSerializer(hall, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Информация о зале обновлена'})
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class HallDeleteView(APIView):
    permission_classes = [IsAdmin]
    authentication_classes = [JWTAuthentication]

    def delete(self, request,pk,*args,**kwargs):
        try:
            hall = Hall.objects.get(pk=pk)
        except Hall.DoesNotExist:
            return Response({'error': 'Зал не найден'}, status=status.HTTP_404_NOT_FOUND)

        hall.delete()
        return Response({'message': 'Зал успешно удален'}, status=status.HTTP_204_NO_CONTENT)