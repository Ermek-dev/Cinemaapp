from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class RoleChoices(models.TextChoices):
        USER = "U", "Пользователь"
        ADMIN = "A", "Администратор"
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


    def __str__(self):
        return self.username