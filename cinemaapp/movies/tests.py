from rest_framework_simplejwt.tokens import RefreshToken
from django.test import TestCase
from rest_framework.test import APIClient

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
