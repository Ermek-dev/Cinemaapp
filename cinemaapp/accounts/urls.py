from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView, ProtectedView, ProtectedUserView

urlpatterns = [
    path('register/',RegisterView.as_view(),name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected/', ProtectedView.as_view(), name='protected'),
    path('user-only/',ProtectedUserView.as_view(),name='user_only'),


]