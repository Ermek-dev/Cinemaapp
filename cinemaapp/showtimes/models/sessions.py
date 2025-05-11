from django.db import models
from halls.models import Hall
from .movies.models.movies import Movie


class Session(models.Model):
    movie = models.ForeignKey(
        Movie,
        on_delete=models.CASCADE,
        verbose_name='Фильм'
    )
    hall = models.ForeignKey(
        Hall,
        on_delete=models.CASCADE,
        verbose_name='Зал'
    )
    startTime = models.DateTimeField(
        verbose_name='Время начала сеанса'
    )
    price =models.DecimalField(
        max_digits=6,
        decimal_places=2,
        verbose_name='Стоимость билета'
    )


    def __str__(self):
        return f"{self.movie.title} at {self.startTime}"