from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    class RoleChoices(models.TextChoices):
        USER = "U", "Пользователь"
        ADMIN = "A", "Администратор"

    username = None  # Убираем username

    email = models.EmailField(
        verbose_name='Электронная почта',
        unique=True,
        blank=False,
        null=False
    )
    role = models.CharField(
        max_length=10,
        choices=RoleChoices.choices,
        blank=False,
        null=False,
        default=RoleChoices.USER
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # username больше не требуется

    objects = CustomUserManager()  # <-- ВАЖНО: Привязка менеджера

    def __str__(self):
        return self.email
