# Blog API

Учебный проект на [NestJS](https://nestjs.com/) + [Prisma](https://www.prisma.io/).  
Реализованы базовые функции для блога: регистрация, авторизация, создание постов и пагинация.

## Стек

- [TypeScript](https://www.typescriptlang.org/)
- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)

## Возможности

- Регистрация и авторизация пользователей (JWT access token в cookie).
- CRUD для постов.
- Пагинация списка постов.
- Относительно чистая структура проекта.
- Есть разделение по ролям

## Установка и запуск

```bash
# клонировать проект
git clone https://github.com/DarkMonarch-DN/pet-blog.git
cd pet-blog

# установить зависимости
npm install

# настроить .env файл (пример ниже)
cp .env.example .env

# применить миграции для базы данных
npx prisma migrate dev

# запустить проект
npm run start:dev

```

## Пример настроек .env

```

  ALLOWED_PORT=3000

  DATABASE_URL="your database url"

  COOKIE_SECRET="secret"

  JWT_SECRET="secret"

```

## Некоторые задачи на будущее

- Добавить реакции к постам.
- ~~Усилить безопасность, а именно проверку email адресов и добавить refresh токены при авторизации.~~
- ~~Добавить возможность смены пароля~~
- Добавить каналы для пользователей.
- Написать тесты.
