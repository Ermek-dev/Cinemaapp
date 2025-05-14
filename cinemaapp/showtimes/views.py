from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Session
from .serializers import SessionSerializer
from accounts.permissions import IsAdmin


# Create your views here.
class SessionListView(APIView):
    def get(self, request, *args, **kwargs):
        sessions = Session.objects.all()
        serializer = SessionSerializer(sessions, many=True)
        return Response(serializer.data)


class SessionDetailView(APIView):
    def get(self,request,pk,*args,**kwargs):
        try:
            session = Session.objects.get(pk=pk)
            serializer = SessionSerializer(session)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Session.DoesNotExist:
            return Response({'error': 'Сессия не найдена'}, status=status.HTTP_404_NOT_FOUND)


class SessionCreateView(APIView):
    permission_classes = [IsAdmin]


    def post(self, request, *args, **kwargs):
        serializer = SessionSerializer(data=request.data)
        if serializer.is_valid():
            session = serializer.save()
            return Response({'message': 'Сессия успешно создана', 'id':session.id}, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class SessionUpdateView(APIView):
    permission_classes =  [IsAdmin]

    def put(self, request,pk,*args,**kwargs):
        try:
            session = Session.objects.get(pk=pk)
        except Session.DoesNotExist:
            return Response({'error': 'Сессия не найдена'}, status=status.HTTP_404_NOT_FOUND)


        serializer = SessionSerializer(session, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Информация о сессии обновлена'})
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class SessionDeleteView(APIView):
    permission_classes = [IsAdmin]


    def delete(self, request,pk,*args,**kwargs):
        try:
            session = Session.objects.get(pk=pk)
        except Session.DoesNotExist:
            return Response({'error': 'Сессия не найдена'}, status=status.HTTP_404_NOT_FOUND)

        session.delete()
        return Response({'message': 'Сессия успешно удалена'}, status=status.HTTP_204_NO_CONTENT)