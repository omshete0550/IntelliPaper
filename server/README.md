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
- `POST /api/similarity/check`
- `GET /api/similarity/reports`
- `GET` / `DELETE /api/similarity/reports/:id`
- `PATCH /api/similarity/reports/:id/matches/:matchId`

Authenticated endpoints require an `Authorization: Bearer <token>` header. Paper search is powered by the public OpenAlex works index. Set `OPENALEX_EMAIL` in `.env` to identify your application to the provider; it is optional for local development but recommended.

## Local similarity service

The text-only similarity checker compares pasted paragraphs against the permitted local `.txt` files in `../ml-service/data/corpus`. When `OPENALEX_API_KEY` is set, it also finds up to three CC-BY OpenAlex full-text candidates, caches their TEI XML in PostgreSQL, and compares their extracted paragraphs. It is a TF-IDF lexical-similarity preview, not a plagiarism verdict.

1. From `ml-service`, create and activate a Python virtual environment.
2. Run `pip install -r requirements.txt`.
3. Run `uvicorn app.main:app --reload --port 8000`.
4. Keep the Node API running normally. It forwards authenticated checks to the ML service.

Set `OPENALEX_API_KEY` in `.env` to enable OpenAlex full-text retrieval. Without it, checks continue using only the local corpus.
