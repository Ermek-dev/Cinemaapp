from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.models import User
from .models import Session, Hall, Movie
from datetime import datetime, timedelta
from django.utils.timezone import make_aware


class SessionAPITestCase(APITestCase):

    def setUp(self):
        # Создаем пользователей
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='adminpassword',
            role='A'  # роль админа
        )
        self.regular_user = User.objects.create_user(
            username='user',
            email='user@example.com',
            password='userpassword',
            role='U'  # роль пользователя
        )

        # Токены для аутентификации
        self.admin_token = str(RefreshToken.for_user(self.admin_user).access_token)
        self.user_token = str(RefreshToken.for_user(self.regular_user).access_token)

        # Создаем объекты для связи
        self.hall = Hall.objects.create(title="Main Hall", rows=10, seatsPerRow=20)
        self.movie = Movie.objects.create(title="Test Movie", description="Test", duration=120)

        # Создаем сессию для тестов
        self.session = Session.objects.create(
            movie=self.movie,
            hall=self.hall,
            startTime=make_aware(datetime.now() + timedelta(days=1)),
            price=1000
        )

    def test_get_sessions_list(self):
        url = reverse('session_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) >= 1)

    def test_get_session_detail(self):
        url = reverse('session_detail', args=[self.session.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], self.session.id)

    def test_create_session_as_admin(self):
        url = reverse('session_create')
        data = {
            "movie": self.movie.id,
            "hall": self.hall.id,
            "startTime": (datetime.now() + timedelta(days=2)).isoformat(),
            "price": 1200
        }
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['message'], 'Сессия успешно создана')

    def test_create_session_as_user_forbidden(self):
        url = reverse('session_create')
        data = {
            "movie": self.movie.id,
            "hall": self.hall.id,
            "startTime": (datetime.now() + timedelta(days=2)).isoformat(),
            "price": 1200
        }
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 403)

    def test_update_session_as_admin(self):
        url = reverse('session_update', args=[self.session.id])
        data = {
            "movie": self.movie.id,
            "hall": self.hall.id,
            "startTime": (datetime.now() + timedelta(days=3)).isoformat(),
            "price": 1500
        }
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['message'], 'Информация о сессии обновлена')

    def test_update_session_as_user_forbidden(self):
        url = reverse('session_update', args=[self.session.id])
        data = {
            "movie": self.movie.id,
            "hall": self.hall.id,
            "startTime": (datetime.now() + timedelta(days=3)).isoformat(),
            "price": 1500
        }
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, 403)

    def test_delete_session_as_admin(self):
        url = reverse('session_delete', args=[self.session.id])
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Session.objects.filter(id=self.session.id).exists())

    def test_delete_session_as_user_forbidden(self):
        url = reverse('session_delete', args=[self.session.id])
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 403)


class SessionFilterTests(APITestCase):
    def setUp(self):
        self.hall1 = Hall.objects.create(title='Hall1',rows=6, seatsPerRow=11)
        self.hall2 = Hall.objects.create(title='Hall2', rows=7, seatsPerRow=12)
        self.movie1 = Movie.objects.create(title='Movie A',description='Test Desc A', duration=100)
        self.movie2 = Movie.objects.create(title='Movie B', description='Test Desc B', duration=120)

        self.session1 = Session.objects.create(
            movie = self.movie1,
            hall = self.hall1,
            startTime=make_aware(datetime(2025,6,1,18,0)),
            price=1200
        )
        self.session2 = Session.objects.create(
            movie = self.movie2,
            hall = self.hall2,
            startTime=make_aware(datetime(2025,6,2,20,0)),
            price=1200
        )

    def test_filter_by_movie(self):
        url = reverse('session_list') + f'?movieId={self.movie1.id}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(all(session['movie'] == self.movie1.id for session in response.data))


    def test_filter_by_hall(self):
        url = reverse('session_list') + f'?hallId={self.hall2.id}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(all(session['hall'] == self.hall2.id for session in response.data))


    def test_filter_by_date(self):
        url = reverse('session_list') + '?date=2025-06-01'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(all(session['startTime'].startswith('2025-06-01') for session in response.data))


    def test_filter_by_result(self):
        url = reverse('session_list') + '?movieId=9999&hallId=9999&date=2023-01-01'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)



