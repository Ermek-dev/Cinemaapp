from django.urls import path
from .views import MovieListView, MovieDetailView, MovieCreateView

urlpatterns = [
    path('movies/',MovieListView.as_view(),name='movie_list'),



]