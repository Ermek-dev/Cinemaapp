import logging

from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Booking
from .serializers import BookingSerializer
from accounts.permissions import IsAdmin,IsUser
from .models import Session
from .utils import notify_seat_update
import time

logger = logging.getLogger('cinemaapp')


rate_limit_storage = {}
RATE_LIMIT = 2
WINDOW_SECONDS = 60


def is_rate_limited(user_id):
    now = time.time()
    timestamps = rate_limit_storage.get(user_id,[])
    timestamps = [ts for ts in timestamps if now - ts <WINDOW_SECONDS]

    if len(timestamps)>=RATE_LIMIT:
        return True

    timestamps.append(now)
    rate_limit_storage[user_id] = timestamps
    return False

def get_taken_seats(session):
   return [
       seat
       for booking in Booking.objects.filter(session=session)
       for seat in booking.seats
   ]


class BookingListView(APIView):
    permission_classes = [IsAuthenticated,IsUser]

    def get(self,request):
        bookings = Booking.objects.filter(user=request.user)
        serializer = BookingSerializer(bookings, many=True)
        logger.info(f"Пользователь {request.user.id} запросил свои бронирования")
        return Response(serializer.data)


class TakenSeatsView(APIView):
    permission_classes = [IsAuthenticated,IsUser]

    def get(self,request,session_id,*args,**kwargs):
        session = get_object_or_404(Session, id=session_id)
        taken_seats = get_taken_seats(session)
        logger.info(f"Пользователь {request.user.id} запросил занятые места для сеанса {session_id}")
        return Response({
            "sessionId": session.id,
            "takenSeats": taken_seats
        }, status=status.HTTP_200_OK)



class BookingCreateView(APIView):
    permission_classes = [IsAuthenticated,IsUser]

    def post(self,request, *args, **kwargs):
        user_id = request.user.id
        if is_rate_limited(user_id):
            return Response(
                {"error": "Слишком много запросов, попробуйте позже"},
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )

        session_id = request.data.get("sessionId")
        seats = request.data.get("seats")

        if not session_id or not seats:
            return Response(
                {"error":"sessionId и seats обязательны"},
                status=status.HTTP_400_BAD_REQUEST
            )

        session = get_object_or_404(Session, id=session_id)


        with transaction.atomic():
                bookings = Booking.objects.select_for_update().filter(session=session)

                taken_seats = [seat for booking in bookings for seat in booking.seats]
                occupied = [seat for seat in seats if seat in taken_seats]

                if occupied:
                    first = occupied[0]
                    return Response(
                        {"error": f"Место row={first['row']}, seat={first['seat']} уже занято"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Всё свободно — создаём бронирование
                booking = Booking.objects.create(
                    user=request.user,
                    session=session,
                    seats=seats
                )
        notify_seat_update(session_id,get_taken_seats(session))
        logger.info(f"Пользователь {request.user.id} забронировал места в сеансе {session_id}, бронирование ID={booking.id}")

        return Response(
                    {"message": "Бронирование успешно создано", "bookingId": booking.id},
                    status=status.HTTP_201_CREATED
                )

