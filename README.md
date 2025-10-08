# RadioHack2.0_TMK

Монорепозиторий, содержащий backend (ASP.NET Core / .NET 8) и frontend (Next.js / TypeScript) для проекта RadioHack.

Этот README объясняет, как запустить полный стек с помощью Docker Compose, как запускать backend и frontend локально для разработки, какие переменные окружения нужны и где найти важные эндпоинты.

## Содержание

- `backend/` - ASP.NET Core Web API (EF Core + PostgreSQL)
- `frontend/` - Next.js (React + TypeScript) приложение
- `docker-compose.yml` - конфигурация Docker Compose для БД, backend, frontend, nginx, pgAdmin
- `.env.example` - пример переменных окружения (скопируйте в .env и отредактируйте)

---

## Быстрый старт

Самый простой способ запустить весь стек локально — использовать **Docker Compose**. Репозиторий включает `docker-compose.yml`, который поднимает PostgreSQL, backend, frontend и nginx.

1. Скопируйте пример файла окружения и отредактируйте секреты:

```bash
cp .env.example .env
# отредактируйте .env, чтобы задать JWT_KEY, TELEGRAM_BOT_TOKEN_SECRET и т.д.
```

2. Запустите стек (из корня репозитория):

```bash
docker compose up --build
```

3. Сервисы (порты по умолчанию):

- Backend: http://localhost:8080
- Frontend (через nginx): http://localhost (nginx проксирует на frontend/backend)
- PostgreSQL: 5432 (контейнер `db`) — используйте хост `localhost:5432` if running locally, если работаете локально, или используйте сетевой хост контейнера при работе внутри других контейнеров.
- pgAdmin: http://localhost:8081 (установите учетные данные из `.env`)

Примечания:
- Docker Compose передаёт `JWT__KEY` из `.env` в окружение `backend`. Не коммитьте секреты в репозиторий.
- Если вы меняете миграции БД, возможно, придётся запускать EF команды внутри контейнера `backend` или делать пересборку.