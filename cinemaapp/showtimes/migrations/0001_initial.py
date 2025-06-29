# Generated by Django 5.2 on 2025-05-11 10:49

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('halls', '0001_initial'),
        ('movies', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Session',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('startTime', models.DateTimeField(verbose_name='Время начала сеанса')),
                ('price', models.DecimalField(decimal_places=2, max_digits=6, verbose_name='Стоимость билета')),
                ('hall', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='halls.hall', verbose_name='Зал')),
                ('movie', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='movies.movie', verbose_name='Фильм')),
            ],
        ),
    ]
