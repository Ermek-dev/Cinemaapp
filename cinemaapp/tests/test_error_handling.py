import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
def test_validation_error_returns_json():
    client = APIClient()
    user = User.objects.create_user(
        username="testUser",
        email="test@example.com",
        password="1234",
        role="A")
    client.force_authenticate(user=user)
    response = client.post("/movies/create/", data={"title": ""}, format="json")
    assert response.status_code == 400
    assert "title" in response.json()


def test_internal_server_error_handled(monkeypatch):
    from movies.views import MovieListView

    def broken_method(*args, **kwargs):
        raise Exception("Критическая ошибка")

    monkeypatch.setattr(MovieListView, "get", broken_method)


    client = APIClient()
    response = client.get("/movies/")
    assert response.status_code == 500
    assert "критическая ошибка" in response.json()["error"].lower()