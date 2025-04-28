from django.urls import path
from .views import MovieListView, MovieDetailView, MovieCreateView

urlpatterns = [
    path('movies/',MovieListView.as_view(),name='movie_list'),
    path('movies/<int:pk>/',MovieDetailView.as_view(),name='movie_detail'),
    path('movies/create/', MovieCreateView.as_view(), name='movie_create'),




]