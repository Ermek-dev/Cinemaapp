from django.db import models


class Hall(models.Model):
    name = models.CharField(
        max_length=100,
        verbose_name='Название зала'
    )
    rows = models.PositiveIntegerField(
        verbose_name='Количество рядов'
    )
    seatsPerRow = models.PositiveIntegerField(
        verbose_name='Количество мест в ряду'
    )


    def __str__(self):
        return self.name