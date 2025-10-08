# frontend/Dockerfile

# Stage 1: билд приложения
FROM node:18 AS build

WORKDIR /app

# Копируем только package-файлы для установки зависимостей
COPY package.json package-lock.json ./
RUN npm install

# Копируем весь остальной код и собираем проект
COPY . .
RUN npm run build

# Stage 2: финальный образ для запуска
FROM node:18

WORKDIR /app

# Копируем из стадии сборки готовое приложение
COPY --from=build /app ./

# Открываем порт для Node.js
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "start"]
