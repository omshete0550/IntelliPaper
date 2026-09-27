# IntelliPaper

IntelliPaper is a research workspace built to help students and early researchers discover literature, organize saved papers, check text similarity, prepare for publishing, and track relevant conferences.

## Features

- Account registration, login, researcher profile, and preferences
- OpenAlex-powered paper discovery with saved papers, reading status, and notes
- Text similarity checking with TF-IDF and optional sentence-transformer embeddings
- OpenAlex open-access reference retrieval and persisted similarity-report history
- CSV export, `.txt` support, and text-based PDF extraction for similarity checks
- OpenReview conference discovery with saved conference bookmarks
- OpenAlex + DOAJ open-access journal discovery
- Publishing workflow guide with downloadable Markdown and LaTeX starter templates

> The similarity feature is a research-assistance preview, not a plagiarism verdict. Review citations and sources manually.

## Architecture

```text
React + Vite client
        |
Express API + Prisma -------- PostgreSQL
        |
FastAPI similarity service -- TF-IDF + sentence-transformers
        |
OpenAlex and OpenReview public APIs
```

## Local development

Prerequisites: Node.js 20+, Python 3.10+, and PostgreSQL 16+.

### 1. API and database

```powershell
cd server
Copy-Item .env.example .env
# Set DATABASE_URL and JWT_SECRET in .env
npm install
npm run db:push
npm run dev
```

The API starts at `http://localhost:5000`.

### 2. Similarity service

Open a second terminal:

```powershell
cd ml-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The first semantic similarity request downloads the `all-MiniLM-L6-v2` model. The service is available at `http://localhost:8000/docs`.

### 3. Client

Open a third terminal:

```powershell
cd client
npm install
npm run dev
```

Open the Vite URL printed in the terminal, normally `http://localhost:5173`.

## Environment variables

Copy `server/.env.example` for local API development. Important values:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Long, private token-signing secret |
| `CLIENT_ORIGIN` | Allowed frontend origin(s) |
| `SIMILARITY_SERVICE_URL` | Similarity service URL, normally `http://localhost:8000` |
| `OPENALEX_EMAIL` | Recommended contact email for OpenAlex requests |
| `OPENALEX_API_KEY` | Enables higher OpenAlex limits and full-text similarity retrieval |

Never commit `.env` files or deployment secrets.

## Docker deployment

Docker Compose runs the API, similarity service, and PostgreSQL together. Run the Vite client separately during local Docker testing, or deploy it as a Render Static Site.

```powershell
Copy-Item .env.production.example .env
# Replace POSTGRES_PASSWORD and JWT_SECRET with strong values.
docker compose up --build -d
```

Start the client in another terminal with `cd client; npm run dev`, then open its Vite URL, normally `http://localhost:5173`. The Compose API startup command initializes the Prisma schema with `prisma db push`; once you introduce formal Prisma migrations, use `prisma migrate deploy` instead.

Useful commands:

```powershell
docker compose logs -f api
docker compose logs -f ml-service
docker compose down
```

For a public deployment, put the frontend behind HTTPS, change `CLIENT_ORIGIN` to your real domain, use managed PostgreSQL with backups, and store secrets in your hosting provider rather than a checked-in file.

## Verification

```powershell
cd client
npm run lint
npm run build

cd ..\ml-service
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
```

## Project layout

```text
client/      React + Vite interface
server/      Express API, Prisma schema, PostgreSQL integration
ml-service/  FastAPI TF-IDF and semantic-similarity service
```
