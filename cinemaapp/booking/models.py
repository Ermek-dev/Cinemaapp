from django.db import models
from showtimes.models import Session
from accounts.models import User


# Create your models here.
class Booking(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Пользователь'
    )
    session = models.ForeignKey(
        Session,
        on_delete=models.CASCADE,
        verbose_name='Сессия'
    )
    seats = models.JSONField(
        verbose_name='Выбранные места',
        help_text='массив объектов с координатами: [ { "row": 1, "seat": 2 }, ... ]'
    )
    createdAt = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Время создания'
    )


    def __str__(self):
        return f"Бронь #{self.id} пользователя {self.user.username} на сеанс {self.session.id} ({self.createdAt.strftime('%Y-%m-%d %H:%M')})"
