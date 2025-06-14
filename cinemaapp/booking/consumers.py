from channels.generic.websocket import AsyncJsonWebsocketConsumer

class SessionSeatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.session_id = self.scope['url_route']['kwargs']['session_id']
        self.room_group_name = f'session_{self.session_id}'


        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )


    async def seat_update(self, event):
        await self.send_json({
            'type': 'seat_update',
            'sessionId': int(self.session_id),
            'takenSeats': event['takenSeats'],
        })