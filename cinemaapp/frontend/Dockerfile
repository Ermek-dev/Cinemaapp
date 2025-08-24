FROM node:20-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine

# Копируем собранный фронт
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем шаблон env-конфига
COPY public/env-config.js.template /usr/share/nginx/html/env-config.js.template

# Копируем кастомный nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Указываем переменные окружения
ENV API_URL=http://127.0.0.1:8000
ENV WS_URL=ws://127.0.0.1:8000/ws

# Генерируем env-config.js из шаблона и запускаем nginx
CMD ["/bin/sh", "-c", "envsubst '${API_URL} ${WS_URL}' < /usr/share/nginx/html/env-config.js.template > /usr/share/nginx/html/env-config.js && nginx -g 'daemon off;'"]