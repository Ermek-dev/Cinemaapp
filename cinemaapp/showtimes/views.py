from django.utils.dateparse import parse_date
from rest_framework import status, filters
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Session
from .serializers import SessionSerializer
from accounts.permissions import IsAdmin


# Create your views here.
class SessionListView(ListAPIView):
        serializer_class = SessionSerializer

        def get_queryset(self):
            queryset = Session.objects.select_related('movie', 'hall').all()

            movie_id = self.request.query_params.get('movieId')
            hall_id = self.request.query_params.get('hallId')
            date = self.request.query_params.get('date')

            if movie_id and movie_id.isdigit():
                queryset = queryset.filter(movie_id=int(movie_id))
            if hall_id and hall_id.isdigit():
                queryset = queryset.filter(hall_id=int(hall_id))
            if date:
                parsed_date = parse_date(date)
                if parsed_date:
                    queryset = queryset.filter(startTime__date = parsed_date)
            return queryset


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
    authentication_classes = [JWTAuthentication]


    def post(self, request, *args, **kwargs):
        serializer = SessionSerializer(data=request.data)
        if serializer.is_valid():
            session = serializer.save()
            return Response({'message': 'Сессия успешно создана', 'id':session.id}, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class SessionUpdateView(APIView):
    permission_classes =  [IsAdmin]
    authentication_classes = [JWTAuthentication]

    def put(self, request,pk,*args,**kwargs):
        try:
            session = Session.objects.get(pk=pk)
        except Session.DoesNotExist:
            return Response({'error': 'Сессия не найдена'}, status=status.HTTP_404_NOT_FOUND)


        serializer = SessionSerializer(session, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Информация о сессии обновлена'})
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class SessionDeleteView(APIView):
    permission_classes = [IsAdmin]
    authentication_classes = [JWTAuthentication]


    def delete(self, request,pk,*args,**kwargs):
        try:
            session = Session.objects.get(pk=pk)
        except Session.DoesNotExist:
            return Response({'error': 'Сессия не найдена'}, status=status.HTTP_404_NOT_FOUND)

        session.delete()
        return Response({'message': 'Сессия успешно удалена'}, status=status.HTTP_204_NO_CONTENT)