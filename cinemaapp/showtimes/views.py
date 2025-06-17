import logging
from django.utils.dateparse import parse_date
from rest_framework import status, filters
from rest_framework.generics import ListAPIView, get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Session
from .serializers import SessionSerializer
from accounts.permissions import IsAdmin

logger = logging.getLogger('cinemaapp')


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
            logger.info(f"Получен список сессий: фильтры — movieId={movie_id}, hallId={hall_id}, date={date}")
            return queryset


class SessionDetailView(APIView):
    def get(self,request,pk,*args,**kwargs):
        session = get_object_or_404(Session,pk=pk)
        serializer = SessionSerializer(session)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SessionCreateView(APIView):
    permission_classes = [IsAdmin]
    authentication_classes = [JWTAuthentication]


    def post(self, request, *args, **kwargs):
        serializer = SessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        session = serializer.save()
        logger.info(f"Сессия создана: ID={session.id}")
        return Response(
            {'message': 'Сессия успешно создана','id':session.id},
            status=status.HTTP_201_CREATED
        )



class SessionUpdateView(APIView):
    permission_classes =  [IsAdmin]
    authentication_classes = [JWTAuthentication]


    def put(self, request,pk):
        session = get_object_or_404(Session,pk=pk)
        serializer = SessionSerializer(session, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        logger.info(f"Сессия обновлена: ID={session.id}")
        return Response({'message': 'Информация о сессии обновлена'})



class SessionDeleteView(APIView):
    permission_classes = [IsAdmin]
    authentication_classes = [JWTAuthentication]


    def delete(self, request,pk):
        session = get_object_or_404(Session,pk=pk)
        session.delete()
        logger.info(f"Сессия удалена: ID={pk}")
        return Response(
            {'message': 'Сессия успешно удалена'},
            status=status.HTTP_204_NO_CONTENT
        )