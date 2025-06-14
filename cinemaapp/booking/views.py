from django.db import transaction
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Booking
from .serializers import BookingSerializer
from accounts.permissions import IsAdmin
from .models import Session
from accounts.permissions import IsUser

from .utils import notify_seat_update


class BookingListView(APIView):
    permission_classes = [IsAuthenticated,IsUser]
    def get(self,request):
        bookings = Booking.objects.filter(user=request.user)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)


class TakenSeatsView(APIView):
    permission_classes = [IsAuthenticated]
    permission_classes = [IsUser]
    def get(self,request,session_id,*args,**kwargs):
        try:
            session = Session.objects.get(id=session_id)
        except Session.DoesNotExist:
            return Response({"error": "Сеанс не найден!!!"},status=status.HTTP_404_NOT_FOUND)


        bookings = Booking.objects.filter(session=session)
        taken_seats = []
        for booking in bookings:
            taken_seats.extend(booking.seats)


        return Response(
            {
                "sessionId": session.id,
                "takenSeats": taken_seats
            }, status = status.HTTP_200_OK
        )



class BookingCreateView(APIView):
    permission_classes = [IsAuthenticated,IsUser]

    def post(self,request, *args, **kwargs):
        session_id = request.data.get("sessionId")
        seats = request.data.get("seats")

        if not session_id or not seats:
            return Response({"error": "sessionId и seats обязательны"}, status=status.HTTP_400_BAD_REQUEST)

        # Проверка на существование сеанса
        try:
            session = Session.objects.get(id=session_id)
        except Session.DoesNotExist:
            return Response({"error": "Сеанс не найден"}, status=status.HTTP_404_NOT_FOUND)

        try:
            with transaction.atomic():
                bookings = Booking.objects.select_for_update().filter(session=session)

                taken_seats = []
                for booking in bookings:
                    taken_seats.extend(booking.seats)
                occupied = []
                for seat in seats:
                    if seat in taken_seats:
                            occupied.append(seat)

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

        except Exception as e:
            return Response({'error': str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                #Обновление списка занятых мест
        all_taken = Booking.objects.filter(session=session).values_list("seats", flat=True)
        merged = []
        for taken in all_taken:
            merged.extend(taken)
        notify_seat_update(session_id,merged)

        return Response(
                    {"message": "Бронирование успешно создано", "bookingId": booking.id},
                    status=status.HTTP_201_CREATED
                )

