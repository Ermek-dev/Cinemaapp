from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient
from .models import Hall

User = get_user_model()
class MovieAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()


        self.admin_user = User.objects.create_superuser(
            username = 'admin',
            password = 'adminpassword',
            is_staff = True
        )
        self.regular_user = User.objects.create_user(
            username='user',
            password='userpassword'
        )


        self.hall1 = Hall.objects.create(title="Main Hall", rows=10, seatsPerRow=20)
        self.hall2 = Hall.objects.create(title="Second Hall", rows=5, seatsPerRow=15)


def test_get_hall_list(self):
    response = self.client.get('/halls/')
    self.assertEqual(response.status_code, 200)
    self.assertEqual(len(response.data), 2)


def test_get_hall_detail(self):
    response = self.client.get(f'/halls/{self.hall1.id}/')
    self.assertEqual(response.status_code, 200)
    self.assertEqual(response.data['title'], self.hall1.name)


def test_create_hall_unauthorized(self):
    data = {"title": "New Hall", "rows": 8, "seatsPerRow": 12}
    response = self.client.post('/halls/create/', data, format='json')
    self.assertIn(response.status_code, [401, 403])


def test_create_hall_as_admin(self):
    self.client.login(username='admin', password='adminpassword')
    data = {"title": "New Hall", "rows": 8, "seatsPerRow": 12}
    response = self.client.post('/halls/create/', data, format='json')
    self.assertEqual(response.status_code, 201)
    self.assertEqual(Hall.objects.count(), 3)
    self.assertEqual(Hall.objects.last().title, "New Hall")
    self.client.logout()


def test_update_hall_as_admin(self):
    self.client.login(username='admin', password='adminpassword')
    data = {"name": "Updated Hall", "rows": 12, "seatsPerRow": 25}
    response = self.client.put(f'/halls/{self.hall1.id}/update/', data, format='json')
    self.assertEqual(response.status_code, 200)
    self.hall1.refresh_from_db()
    self.assertEqual(self.hall1.name, "Updated Hall")
    self.client.logout()


def test_update_hall_as_user_forbidden(self):
    self.client.login(username='user', password='userpassword')
    data = {"name": "Fail Update", "rows": 1, "seatsPerRow": 1}
    response = self.client.put(f'/halls/{self.hall1.id}/update/', data, format='json')
    self.assertEqual(response.status_code, 403)
    self.client.logout()


def test_delete_hall_as_admin(self):
    self.client.login(username='admin', password='adminpassword')
    response = self.client.delete(f'/halls/{self.hall2.id}/delete/')
    self.assertEqual(response.status_code, 204)
    self.assertFalse(Hall.objects.filter(id=self.hall2.id).exists())
    self.client.logout()


def test_delete_hall_as_user_forbidden(self):
    self.client.login(username='user', password='userpassword')
    response = self.client.delete(f'/halls/{self.hall1.id}/delete/')
    self.assertEqual(response.status_code, 403)
    self.client.logout()

