🎬 **CinemaApp**
REST API для онлайн-бронирования фильмов с JWT-аутентификацией, ролевой системой и CRUD-операциями для фильмов, залов и сеансов.

---

📦 **Возможности**
- Регистрация и вход с использованием JWT
- Роли пользователей (`user` и `admin`)
- Просмотр фильмов, залов и сеансов
- Поиск фильмов по названию (`search`)
- Фильтрация сеансов по параметрам `movieId`, `hallId`, `date`
- Добавление, редактирование и удаление фильмов (только админ)
- Управление залами и сеансами (только админ)
- Валидация данных
- **Бронирование мест на сеанс**:
  - Создание и просмотр бронирований
  - Проверка доступности мест (атомарно)
  - WebSocket-уведомления о занятых местах
- Тесты API и коллекция Postman

---

🚀 **Технологии**
- Python 3.10+
- Django
- Django REST Framework
- Simple JWT
- SQLite (по умолчанию)
- Postman (ручное тестирование)
- WebSocket (через Django Channels)

---

📂 **Установка и запуск**
```bash
git clone https://github.com/your-username/cinemaapp.git
cd cinemaapp
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

🧪 **Тестирование**
```bash
python manage.py test
```

---

🔐 **Аутентификация**
JWT-токены используются для доступа к защищённым маршрутам:

- `POST /auth/register` — регистрация
- `POST /auth/login` — получить access и refresh токены
- `POST /auth/refresh` — обновление access токена

---

🗂️ **Эндпоинты**
| Метод | URL | Описание | Доступ |
|-------|-----|----------|--------|
| GET | /movies/ | Список фильмов | Все |
| GET | /movies/<id>/ | Фильм по ID | Все |
| POST | /movies/create/ | Создать фильм | Admin |
| PUT | /movies/<id>/update/ | Обновить фильм | Admin |
| DELETE | /movies/<id>/delete/ | Удалить фильм | Admin |
| GET | /halls/ | Список залов | Все |
| POST | /halls/ | Создать зал | Admin |
| PUT | /halls/<id>/ | Обновить зал | Admin |
| DELETE | /halls/<id>/ | Удалить зал | Admin |
| GET | /sessions/ | Список сеансов (фильтрация: movieId, hallId, date) | Все |
| GET | /sessions/<id>/ | Сеанс по ID | Все |
| POST | /sessions/create/ | Создать сеанс | Admin |
| PUT | /sessions/<id>/update/ | Обновить сеанс | Admin |
| DELETE | /sessions/<id>/delete/ | Удалить сеанс | Admin |
| GET | /bookings/ | Список бронирований пользователя | Только пользователь |
| POST | /bookings/create/ | Создать бронирование | Только пользователь |
| GET | /sessions/<id>/seats | Занятые места на сеанс | Все |
| WebSocket | /ws/session/<id>/seats | Подписка на обновления мест | Все |

---

📌 **Примечания**
Для запросов `POST`/`PUT`/`DELETE`, требующих авторизации, необходимо передавать заголовок:
```
Authorization: Bearer <your_access_token>
```

Также рекомендуется протестировать WebSocket через браузерные расширения или Postman с поддержкой WS.

