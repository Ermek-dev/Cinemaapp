from django.db import models

# Create your models here.

class Movie(models.Model):
    title = models.CharField(
        max_length=200,
        null = False,
        blank = False,
        verbose_name = 'Заголовок',
    )
    description = models.TextField(
        max_length=3000,
        null=False,
        blank=False,
        verbose_name='Описание'
    )
    duration = models.PositiveIntegerField(
        default=0
    )
    posterUrl = models.URLField()
    createdAt = models.DateTimeField(
        auto_now_add=True
    )


    def __str__(self):
        return self.title
