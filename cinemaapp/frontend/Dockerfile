FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

ENV API_URL=http://localhost:3000

CMD ["/bin/sh", "-c", "envsubst '${API_URL}' < /usr/share/nginx/html/env-config.js.template > /usr/share/nginx/html/env-config.js && nginx -g 'daemon off;'"]