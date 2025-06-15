from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Movie
from .serializers import MovieSerializer
from accounts.permissions import IsAdmin
import time


CACHE_TTL = 60
movie_cache = {}


class MovieListView(APIView):
    def get(self, request, *args, **kwargs):
        search = request.query_params.get("search", "").strip()

        if len(search)>100:
            return Response({"error": "Слишком длинный поисковый запрос"})

        cache_key = search.lower()
        now = time.time()

        if cache_key in movie_cache:
            cached = movie_cache[cache_key]
            if now - cached["timestamp"] < CACHE_TTL:
                print("Ответ из кэша")
                return Response(cached["data"], status=status.HTTP_200_OK)



        queryset = Movie.objects.all()
        if search and len(search) <= 100:
            queryset = queryset.filter(title__icontains=search)
            print("Ответ из базы")
        serializer = MovieSerializer(queryset, many=True)
        movie_cache[cache_key] = {
            "data": serializer.data,
            "timestamp": now
        }
        return Response(serializer.data, status=status.HTTP_200_OK)


class MovieDetailView(APIView):
    def get(self, request, pk, *args, **kwargs):
        try:
            movie = Movie.objects.get(pk=pk)
            serializer = MovieSerializer(movie)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Movie.DoesNotExist:
            return Response({'error': 'Фильм не найден'}, status=status.HTTP_404_NOT_FOUND)


class MovieCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = MovieSerializer(data=request.data)
        if serializer.is_valid():
            movie = serializer.save()
            movie_cache.clear()
            return Response({'message': 'Фильм успешно создан','id': movie.id}, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class MovieUpdateView(APIView):
    permission_classes = [IsAdmin]
    authentication_classes = [JWTAuthentication]

    def put(self, request,pk,*args, **kwargs):
        try:
            movie = Movie.objects.get(pk=pk)
        except Movie.DoesNotExist:
            return Response({'error': 'Фильм не найден'}, status=status.HTTP_404_NOT_FOUND)

        serializer = MovieSerializer(movie, data=request.data)
        if serializer.is_valid():
            serializer.save()
            movie_cache.clear()
            return Response({'message': 'Фильм успешно обновлен',})
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class MovieDeleteView(APIView):
    permission_classes = [IsAdmin]
    authentication_classes = [JWTAuthentication]

    def delete(self, request,pk,*args, **kwargs):
        try:
            movie = Movie.objects.get(pk=pk)
        except Movie.DoesNotExist:
            return Response({'error': 'Фильм не найден'}, status=status.HTTP_404_NOT_FOUND)

        movie.delete()
        movie_cache.clear()
        return Response({'message': 'Фильм успешно удален',}, status=status.HTTP_204_NO_CONTENT)