from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient
from .models import Movie


User = get_user_model()
class MovieAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()


        self.admin_user = User.objects.create_superuser(
            username = 'admin',
            password = 'adminpassword',
            is_staff = True
        )
        self.client.login(username='admin', password='adminpassword')
        self.movie = Movie.objects.create(
            title="Inception",
            description="A mind-bending thriller",
            duration=148,
            posterUrl="http://example.com/inception.jpg"
        )


    def test_get_movies_list(self):
        response = self.client.get('/movies/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data),1)
        self.assertEqual(response.data[0]['title'], "Inception")


    def test_get_movie_detail(self):
        response = self.client.get(f'/movies/{self.movie.id}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], self.movie.id)
        self.assertEqual(response.data['title'], "Inception")


    def test_create_movie(self):
        data = {
            "title": "Deadpool",
            "description": "A fantasy movie",
            "duration": 155,
            "posterUrl": "http://example.com/deadpool.jpg"
        }
        response = self.client.post('/movies/create/',data,format='json')
        self.assertEqual(response.status_code,201)
        self.assertEqual(Movie.objects.count(),2)
        self.assertEqual(Movie.objects.last().title, "Deadpool")



    def test_update_movie(self):
        data = {
            "title": "Inception part first",
            "description": "Science movie",
            "duration": 172,
            "posterUrl": "http://example.com/inception-part-first.jpg"
        }
        response = self.client.put(f'/movies/{self.movie.id}/update/',data,format='json')
        self.assertEqual(response.status_code, 200)
        update_movie = Movie.objects.get(id=self.movie.id)
        self.assertEqual(update_movie.title, "Inception part first")


    def test_delete_movie(self):
        response = self.client.delete(f'/movies/{self.movie.id}/delete/')
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Movie.objects.count(), 0)








