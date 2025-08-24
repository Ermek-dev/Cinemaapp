
FROM python:3.11-slim

# Устанавливаем переменные окружения
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем зависимости и устанавливаем их
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем всё остальное внутрь контейнера
COPY . .

# Команда запуска сервера (можно заменить на gunicorn)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
