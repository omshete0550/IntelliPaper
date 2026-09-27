# IntelliPaper API

## Local setup

1. Copy `.env.example` to `.env` and set a real `DATABASE_URL` and long `JWT_SECRET`.
2. Create the PostgreSQL database named in `DATABASE_URL`.
3. Run `npm run db:push` to create the tables from `prisma/schema.prisma`.
4. Run `npm run dev` to start the API at `http://localhost:5000`.

## Available endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET` / `PUT /api/profile`
- `GET /api/papers/search?q=&topic=&year=`
- `GET` / `POST /api/library`
- `PATCH` / `DELETE /api/library/:id`
- `GET` / `POST /api/conferences`
- `DELETE /api/conferences/:id`

Authenticated endpoints require an `Authorization: Bearer <token>` header. Paper search is powered by the public OpenAlex works index. Set `OPENALEX_EMAIL` in `.env` to identify your application to the provider; it is optional for local development but recommended.
