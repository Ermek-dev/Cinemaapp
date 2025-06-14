from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework_simplejwt.tokens import RefreshToken
from django.test import TestCase
from rest_framework.test import APIClient
from accounts.models import User
from .models import Movie


class MovieAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.admin_user = User.objects.create_user(
            username='admin',
            password='adminpassword',
            role='A'
        )

        # Генерируем JWT токен для тестового пользователя
        refresh = RefreshToken.for_user(self.admin_user)
        access_token = str(refresh.access_token)

        # Добавляем токен в заголовок Authorization
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

        self.movie = Movie.objects.create(
            title="Inception",
            description="A mind-bending thriller",
            duration=148,
            posterUrl="http://example.com/inception.jpg"
        )
        self.movie2 = Movie.objects.create(
            title = "Batman Begins",
            description = "The origin of Batman",
            duration = 140,
            posterUrl = "http://example.com/batman.jpg",
        )


    def test_search_movie_by_title(self):
        url = reverse('movie_list') + '?search=Batman'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any('Batman' in movie['title'] for movie in response.data))


    def test_search_movie_empty_result(self):
        url = reverse('movie_list') + '?search=NoSuchMovieTitle'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)