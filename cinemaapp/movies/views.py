import logging
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Movie
from .serializers import MovieSerializer
from accounts.permissions import IsAdmin
import time
from django.http import Http404

logger = logging.getLogger('cinemaapp')
CACHE_TTL = 60
movie_cache = {}


class MovieListView(APIView):
    def get(self, request, *args, **kwargs):
        search = request.query_params.get("search", "").strip()

        if len(search)>100:
            raise ValidationError("Слишком длинный поисковый запрос")

        cache_key = search.lower()
        now = time.time()

        if cache_key in movie_cache:
            cached = movie_cache[cache_key]
            if now - cached["timestamp"] < CACHE_TTL:
                return Response(cached["data"], status=status.HTTP_200_OK)

        queryset = Movie.objects.all()
        if search:
            queryset = queryset.filter(title__icontains=search)
        serializer = MovieSerializer(queryset, many=True)
        movie_cache[cache_key] = {
            "data": serializer.data,
            "timestamp": now
        }
        logger.info(f"Фильмы загружены из базы:{len(serializer.data)} запись")
        return Response(serializer.data, status=status.HTTP_200_OK)


class MovieDetailView(APIView):
    def get(self, request, pk, *args, **kwargs):
        try:
            movie = Movie.objects.get(pk=pk)
        except Movie.DoesNotExist:
            raise Http404('Фильм не найден')

        serializer = MovieSerializer(movie)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MovieCreateView(APIView):
    permission_classes = [IsAdmin]
    authentication_classes = [JWTAuthentication]


    def post(self, request, *args, **kwargs):
        serializer = MovieSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        movie = serializer.save()
        movie_cache.clear()
        return Response(
            {'message': 'Фильм успешно создан','id': movie.id},
            status=status.HTTP_201_CREATED
        )



class MovieUpdateView(APIView):
    permission_classes = [IsAdmin]
    authentication_classes = [JWTAuthentication]

    def put(self, request,pk,*args, **kwargs):
        try:
            movie = Movie.objects.get(pk=pk)
        except Movie.DoesNotExist:
            raise Http404('Фильм не найден')


        serializer = MovieSerializer(movie, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        movie_cache.clear()
        return Response({'message': 'Фильм успешно обновлен',})


class MovieDeleteView(APIView):
    permission_classes = [IsAdmin]
    authentication_classes = [JWTAuthentication]

    def delete(self, request,pk,*args, **kwargs):
        try:
            movie = Movie.objects.get(pk=pk)
        except Movie.DoesNotExist:
            raise Http404('Фильм не найден')

        movie.delete()
        movie_cache.clear()
        return Response(
            {'message': 'Фильм успешно удален',},
            status=status.HTTP_204_NO_CONTENT
        )