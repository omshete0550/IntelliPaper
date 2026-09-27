# IntelliPaper similarity service

This service compares pasted text with local `.txt` reference paragraphs and any permitted OpenAlex full-text candidates sent by the Node API. It uses TF-IDF lexical similarity plus a Sentence Transformer semantic-embedding signal, and is a similarity preview, not a plagiarism verdict.

## Deployment security

When this is deployed as a public Render Web Service, set these environment variables:

```text
SIMILARITY_REQUIRE_TOKEN=true
SIMILARITY_SERVICE_TOKEN=<a-long-random-secret>
SEMANTIC_ENABLED=false
```

Set the same `SIMILARITY_SERVICE_TOKEN` on the Node API. The API sends it in the `X-IntelliPaper-Service-Token` header, and `/analyze` rejects requests without it. Keep `SEMANTIC_ENABLED=false` on Render's 512 MB free instance; this uses the reliable TF-IDF baseline without loading the much larger embedding model.

## Run locally

```powershell
cd ml-service
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

Open `http://localhost:8000/docs` to test the service directly. Keep the main Node API running too; it calls this service at `http://localhost:8000` by default.

To include OpenAlex candidate paragraphs, add `OPENALEX_API_KEY` to `server/.env`; the Node API fetches and caches the source documents before calling this service.

## Add reference material

Add permitted `.txt` documents to `data/corpus`. Separate paragraphs with a blank line. The filename is shown as the source name in the app.

## Tests

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
```
