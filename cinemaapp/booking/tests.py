from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from movies.models import Movie
from halls.models import Hall
from showtimes.models import Session
from booking.models import Booking
from datetime import timedelta
from django.utils import timezone


User = get_user_model()
class BookingTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='username',password='password')
        self.client.force_authenticate(user=self.user)


        self.movie = Movie.objects.create(title='Test Movie', description='Test',duration=120)
        self.hall = Hall.objects.create(title='Main', rows=5, seatsPerRow=5)
        self.session = Session.objects.create(movie=self.movie, hall=self.hall,startTime=timezone.now() + timedelta(hours=1),price=125)

    def test_create_booking_success(self):
            data = {
                "sessionId": self.session.id,
                "seats":[{"row": 1,"seat":1},{"row":1,"seat":2}]
            }

            response = self.client.post("/bookings/create/",data,format="json")
            self.assertEqual(response.status_code, 201)
            self.assertEqual(Booking.objects.count(),1)


    def test_booking_conflict(self):
        Booking.objects.create(
            user=self.user,
            session=self.session,
            seats=[{"row": 1, "seat": 1}]
        )

        data = {
            "sessionId": self.session.id,
            "seats": [{"row": 1, "seat": 1}, {"row": 1, "seat": 2}]
        }

        response = self.client.post("/bookings/create/", data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("уже занято", response.json()["error"])


    def test_get_user_bookings(self):
        Booking.objects.create(
            user=self.user,
            session=self.session,
            seats=[{"row": 2, "seat": 3}]
        )

        response = self.client.get("/bookings/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()),1)
        self.assertEqual(response.json()[0]["sessionId"],self.session.id)


    def test_get_taken_seats(self):
        Booking.objects.create(
            user=self.user,
            session=self.session,
            seats=[{"row": 3, "seat": 4}]
        )

        response = self.client.get(f"/sessions/{self.session.id}/seats/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["sessionId"], self.session.id)
        self.assertIn({"row": 3, "seat": 4}, response.json()["takenSeats"])


