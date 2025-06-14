
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def notify_seat_update(session_id, taken_seats):
    """
    taken_seats: список словарей типа {"row": int, "seat": int}
    """
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'session_{session_id}',
        {
            "type": "seat_update",
            "takenSeats": taken_seats
        }
    )