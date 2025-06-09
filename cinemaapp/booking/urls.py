from django.urls import path
from .views import BookingListView, BookingCreateView, TakenSeatsView

urlpatterns = [
    path('bookings/', BookingListView.as_view(), name='booking_list'),
    path('bookings/create/', BookingCreateView.as_view(), name='booking_create'),
    path('sessions/<int:session_id>/seats/', TakenSeatsView.as_view(), name='taken_seats')

]
