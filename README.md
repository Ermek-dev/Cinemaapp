🎬 CinemaApp
REST API для онлайн-бронирования фильмов с JWT-аутентификацией, ролевой системой и CRUD-операциями для фильмов, залов и сеансов.

---

📦 Возможности
- 🔐 Регистрация и вход с использованием JWT
- 👤 Роли пользователей (`user` и `admin`)
- 🎞️ Просмотр фильмов, залов и сеансов
- 🔍 Поиск фильмов по названию (`search`)
- 🎯 Фильтрация сеансов по параметрам `movieId`, `hallId`, `date`
- 🛠️ Добавление, редактирование и удаление фильмов (только админ)
- 🏛️ Управление залами и сеансами (только админ)
- ✅ Валидация данных и централизованная обработка ошибок
- 🎟️ **Бронирование мест на сеанс**:
  - ➕ Создание и просмотр бронирований
  - 🧠 Проверка доступности мест (атомарно)
  - 🔄 WebSocket-уведомления о занятых местах
- 🚫 Rate limit: не более 2 бронирований в минуту
- ⚡ In-memory кэш для `/movies/`
- 📋 Логирование ошибок и запросов
- 🧪 Юнит-тесты и коллекция Postman

---

🚀 Технологии
- 🐍 Python 3.10+
- 🌐 Django, Django REST Framework
- 🛡️ Simple JWT
- 🧪 Pytest
- 💾 SQLite (по умолчанию)
- 📡 Django Channels (WebSocket)
- 🧪 Postman (ручное тестирование)

---

📂 Установка и запуск
```
git clone https://github.com/your-username/cinemaapp.git
cd cinemaapp
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

🧪 Тестирование (юнит-тесты 5 недели)
```
pytest
```

📁 Структура `tests/`:
- ✅ `test_cache.py` — Кэширование GET `/movies/`
- ✅ `test_ratelimit.py` — Ограничение на бронирование
- ✅ `test_logging.py` — Логирование ошибок
- ✅ `test_error_handling.py` — Централизованная обработка

📌 Файл `pytest.ini`:
```
[pytest]
DJANGO_SETTINGS_MODULE = cinemaapp.settings
python_files = tests/test_*.py
addopts = --tb=short
```

---

🔐 Аутентификация
- `POST /auth/register` — регистрация
- `POST /auth/login` — получить access и refresh токены
- `POST /auth/refresh` — обновление access токена

---

🗂️ Эндпоинты
| Метод | URL                             | Описание                              | Доступ             |
|-------|----------------------------------|----------------------------------------|--------------------|
| GET   | /movies/                         | Список фильмов                         | Все                |
| GET   | /movies/<id>/                    | Фильм по ID                            | Все                |
| POST  | /movies/create/                  | Создать фильм                          | Только админ       |
| PUT   | /movies/<id>/update/             | Обновить фильм                         | Только админ       |
| DELETE| /movies/<id>/delete/             | Удалить фильм                          | Только админ       |
| GET   | /halls/                          | Список залов                           | Все                |
| POST  | /halls/                          | Создать зал                            | Только админ       |
| PUT   | /halls/<id>/                     | Обновить зал                           | Только админ       |
| DELETE| /halls/<id>/                     | Удалить зал                            | Только админ       |
| GET   | /sessions/                       | Список сеансов (фильтрация)            | Все                |
| GET   | /sessions/<id>/                  | Сеанс по ID                            | Все                |
| POST  | /sessions/create/                | Создать сеанс                          | Только админ       |
| PUT   | /sessions/<id>/update/           | Обновить сеанс                         | Только админ       |
| DELETE| /sessions/<id>/delete/           | Удалить сеанс                          | Только админ       |
| GET   | /bookings/                       | Мои бронирования                       | Только пользователь|
| POST  | /bookings/create/                | Создать бронирование                   | Только пользователь|
| GET   | /sessions/<id>/seats             | Занятые места на сеанс                 | Все                |
| WS    | /ws/session/<id>/seats           | Подписка на обновления мест (WebSocket)| Все                |

---

⚙️ Middleware
Файл `LoggingMiddleware` добавлен в `MIDDLEWARE` в `settings.py`:
```
'your_app.middleware.LoggingMiddleware',  # до DRF middleware
```

---

📌 Примечания
Для запросов `POST`/`PUT`/`DELETE`, требующих авторизации, необходимо передавать заголовок:
```
Authorization: Bearer <your_access_token>
```

Также рекомендуется протестировать WebSocket через браузерные расширения или Postman с поддержкой WS.
