from django.urls import path
from .views import HallListView, HallDetailView, HallCreateView, HallDeleteView, HallUpdateView

urlpatterns = [
    path('halls/', HallListView.as_view(), name='hall_list'),
    path('halls/<int:pk>/', HallDetailView.as_view(), name='hall_detail'),
    path('halls/create/', HallCreateView.as_view(), name='hall_create'),
    path('halls/<int:pk>/update/', HallUpdateView.as_view(), name='hall_update'),
    path('halls/<int:pk>/delete/', HallDeleteView.as_view(), name='hall_delete')
]
