🎬 **CinemaApp**
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
- 🎟️ Бронирование мест на сеанс:
  - ➕ Создание и просмотр бронирований
  - 🧠 Проверка доступности мест (атомарно)
  - 🔄 WebSocket-уведомления о занятых местах
- 🚫 Rate limit: не более 2 бронирований в минуту
- ⚡ In-memory кэш для `/movies/`
- 📋 Логирование ошибок и запросов
- 🧪 Юнит-тесты и коллекция Postman
- 📄 Интерактивная Swagger-документация (без авторизации)
- 🐳 Docker-контейнеризация
- ⚙️ GitLab CI/CD пайплайн

---

🚀 Технологии
- 🐍 Python 3.10+
- 🌐 Django, Django REST Framework
- 🛡️ Simple JWT
- 💾 SQLite (по умолчанию)
- 🌊 Django Channels (WebSocket)
- 🧪 Pytest
- 🧰 Docker, Docker Compose
- 🔧 GitLab CI/CD

---

📂 Установка и запуск без Docker
git clone https://github.com/your-username/cinemaapp.git
cd cinemaapp
python -m venv venv
source venv/bin/activate # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

---

🐳 Запуск с Docker
docker-compose up --build

Swagger и остальные маршруты будут доступны на:
- http://localhost:8000/docs/
- http://localhost:8000/redoc/
- http://localhost:8000/swagger.json

---

📄 Документация API (Swagger / ReDoc)

- Swagger UI: `/docs/`
- ReDoc: `/redoc/`
- JSON-схема: `/swagger.json`

🔓 Доступ к документации открыт — авторизация не требуется. Настроен middleware, который пропускает запросы к документации.

---

🧪 Тестирование (юнит-тесты 5 недели)
pytest

📁 Структура `tests/`:
- `test_cache.py` — Кэширование GET `/movies/`
- `test_ratelimit.py` — Ограничение на бронирование
- `test_logging.py` — Логирование ошибок
- `test_error_handling.py` — Централизованная обработка

📌 Файл `pytest.ini`:
[pytest]
DJANGO_SETTINGS_MODULE = cinemaapp.settings
python_files = tests/test_*.py
addopts = --tb=short


---

🔐 Аутентификация
- `POST /auth/register` — регистрация
- `POST /auth/login` — получение access и refresh токенов
- `POST /auth/refresh` — обновление access токена

---

🗂️ Эндпоинты
| Метод | URL                                  | Описание                               | Доступ             |
|-------|--------------------------------------|----------------------------------------|--------------------|
| GET   | /movies/                             | Список фильмов                         | Все                |
| GET   | /movies/<id>/                        | Фильм по ID                            | Все                |
| POST  | /movies/create/                      | Создать фильм                          | Только админ       |
| PUT   | /movies/<id>/update/                 | Обновить фильм                         | Только админ       |
| DELETE| /movies/<id>/delete/                 | Удалить фильм                          | Только админ       |
| GET   | /halls/                              | Список залов                           | Все                |
| POST  | /halls/                              | Создать зал                            | Только админ       |
| PUT   | /halls/<id>/                         | Обновить зал                           | Только админ       |
| DELETE| /halls/<id>/                         | Удалить зал                            | Только админ       |
| GET   | /sessions/                           | Список сеансов (фильтрация)            | Все                |
| GET   | /sessions/<id>/                      | Сеанс по ID                            | Все                |
| POST  | /sessions/create/                    | Создать сеанс                          | Только админ       |
| PUT   | /sessions/<id>/update/               | Обновить сеанс                         | Только админ       |
| DELETE| /sessions/<id>/delete/               | Удалить сеанс                          | Только админ       |
| GET   | /bookings/                           | Мои бронирования                       | Только пользователь|
| POST  | /bookings/create/                    | Создать бронирование                   | Только пользователь|
| GET   | /sessions/<id>/seats                 | Занятые места на сеанс                 | Все                |
| WS    | /ws/session/<id>/seats               | Подписка на обновления мест (WebSocket)| Все                |

---

⚙️ Middleware

Добавлены middleware:
- `JWTAuthenticationMiddleware` — Пропускает документацию без авторизации, валидирует роль на защищённых маршрутах
- `LoggingMiddleware` — Логирует входящие запросы и ошибки

```python
MIDDLEWARE = [
    ...,
    'your_app.middleware.JWTAuthenticationMiddleware',
    'your_app.middleware.LoggingMiddleware',
    ...,
]

⚙️ CI/CD

Файл .gitlab-ci.yml запускает пайплайн:

Установка зависимостей

Миграции

Юнит-тесты

Сборка Docker-образа

📌 Примечание
Для авторизованных запросов необходимо передавать токен:
Authorization: Bearer <access_token>

🧑‍💻 Автор
Разработано как pet-проект в рамках учебной практики.
