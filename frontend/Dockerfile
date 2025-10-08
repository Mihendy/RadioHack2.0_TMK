# frontend/Dockerfile

# Stage 1: Устанавливаем Node.js и зависимости
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# Копируем остальной код и собираем приложение
COPY . .
RUN npm run build

# Stage 2: Раздача приложения через Node.js
FROM node:18

WORKDIR /app

COPY --from=build /app ./

EXPOSE 3000

CMD ["npm", "start"]