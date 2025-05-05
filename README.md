# 🎬 CinemaApp

REST API для управления фильмами, с авторизацией, CRUD-операциями и проверкой прав доступа.

## 📦 Возможности

- Регистрация и аутентификация пользователей
- Просмотр всех фильмов
- Получение информации о конкретном фильме
- Добавление фильмов (POST)
- Обновление и удаление фильмов (доступно только администратору)
- Валидация данных (в том числе URL постера)

## 🚀 Технологии

- Python 3.10+
- Django
- Django REST Framework
- SQLite (по умолчанию)
- Postman (для ручного тестирования)

## 📂 Установка и запуск

```bash
git clone https://github.com/your-username/cinemaapp.git
cd cinemaapp
python -m venv venv
source venv/bin/activate  # для Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
🧪 Тестирование
bash
Copy
Edit
python manage.py test
🗂️ Эндпоинты

Метод	URL	Описание
GET	/movies/	Получить список фильмов
GET	/movies/<id>/	Получить фильм по ID
POST	/movies/create/	Создать фильм
PUT	/movies/<id>/update/	Обновить фильм (admin only)
DELETE	/movies/<id>/delete/	Удалить фильм (admin only)
📌 Авторизация
