from datetime import datetime, timedelta
import pytest
from django.utils.timezone import make_aware
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from halls.models import Hall
from movies.models import Movie
from showtimes.models import Session

User = get_user_model()

@pytest.mark.django_db
def test_rate_limit_booking():
    user = User.objects.create_user(
        username = "testUser",
        email="test@example.com",
        password="1234",
        role="U")
    client = APIClient()
    client.force_authenticate(user=user)

    movie = Movie.objects.create(title="Test Movie",duration=120)
    hall = Hall.objects.create(title="Test Hall", rows=5, seatsPerRow=5)
    session =  Session.objects.create(movie=movie, hall=hall, startTime=make_aware(datetime.now() + timedelta(days=1)),price=1000)

    url = '/bookings/create/'
    data = {"sessionId": session.id, "seats": [{"row":1, "seat": 1}]}

    for i in range(2):
        seat = [{"row": 1, "seat": i +1}]
        res = client.post(url, {"sessionId": session.id, "seats": seat}, format="json")
        assert res.status_code == 201


    res = client.post(url, data,format="json")
    assert res.status_code == 429
    assert "Слишком много запросов" in res.json()["error"]