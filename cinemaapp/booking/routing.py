from django.urls import re_path
from booking import consumers


websocket_urlpatterns = [
    re_path(r'ws/session/(?P<session_id>\d+)/seats/$',consumers.SessionSeatConsumer.as_asgi()),
]