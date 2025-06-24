import pytest
from rest_framework.test import APIClient
from movies.models import Movie

@pytest.mark.django_db
def test_movie_list_cache(monkeypatch):
    Movie.objects.create(title="Cached Movie",
            description="A mind-bending thriller",
            duration=148,
            posterUrl="http://example.com/inception.jpg")

    client = APIClient()

    first_response = client.get("/movies/?search=Cached")
    assert first_response.status_code == 200
    assert "Cached Movie" in str(first_response.data)

    second_response = client.get("/movies/?search=Cached")
    assert second_response.status_code == 200
    assert "Cached Movie" in str(second_response.data)