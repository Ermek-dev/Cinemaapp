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
        return Response({'message': 'Привет,пользователь'})


class RegisterView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if User.objects.filter(email=email).exists():
            return Response({'errors': 'Пользователь с таким email уже существует!'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            return Response({
                'message': 'Пользователь успешно зарегистрирован.',
                'accessToken': access_token,
                'refreshToken': str(refresh)
            }, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class  LoginView(APIView):
    def post(self, request):
            email =request.data.get('email')
            password = request.data.get('password')
            user = get_user_model().objects.filter(email=email).first()

            if user is not None and user.check_password(password):
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                return Response({
                        'message': 'Вход успешно выполнен.',
                        'accessToken': access_token,
                        'refreshToken': str(refresh)
                    }, status=status.HTTP_200_OK)
            else:
                return Response({'errors': 'Неверный email или пароль,попробуйте еще раз!!!'}, status=status.HTTP_400_BAD_REQUEST)


