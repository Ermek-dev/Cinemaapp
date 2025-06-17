from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .permissions import IsAdmin, IsUser
from .serializers import RegisterSerializer


class ProtectedView(APIView):
    permission_classes = [IsAdmin]
    def get(self, request):
        return Response({'message': 'Привет,Админ.Доступ разрешен!'}, status=status.HTTP_200_OK)


class ProtectedUserView(APIView):
    permission_classes = [IsUser]

    def get(self, request):
        return Response({'message': 'Привет,пользователь'},status=status.HTTP_200_OK)


class RegisterView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if User.objects.filter(email=email).exists():
            raise Exception('Пользователь с таким email уже существует!')

        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
                'message': 'Пользователь успешно зарегистрирован.',
                'accessToken': str(refresh.access_token),
                'refreshToken': str(refresh)
            }, status=status.HTTP_201_CREATED)


class  LoginView(APIView):
    def post(self, request):
            email =request.data.get('email')
            password = request.data.get('password')
            if not email or not password:
                raise Exception("Email и пароль обязательны")

            user = get_user_model().objects.filter(email=email).first()
            if user is None or not user.check_password(password):
                raise Exception('Неверный email или пароль,попробуйте еще раз!!!')

            refresh = RefreshToken.for_user(user)
            return Response({
                        'message': 'Вход успешно выполнен.',
                        'accessToken': str(refresh.access_token),
                        'refreshToken': str(refresh)
                    }, status=status.HTTP_200_OK)


