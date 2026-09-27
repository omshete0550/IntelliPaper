import os
import secrets
from pathlib import Path

from fastapi import FastAPI, Header, HTTPException

from .schemas import AnalysisRequest, AnalysisResponse
from .tfidf_engine import analyse


app = FastAPI(title="IntelliPaper Similarity Service", version="1.0.0")
DEFAULT_CORPUS = Path(__file__).resolve().parent.parent / "data" / "corpus"


def token_required() -> bool:
    return os.getenv("SIMILARITY_REQUIRE_TOKEN", "false").lower() in {"1", "true", "yes"}


def verify_service_token(x_intellipaper_service_token: str | None = Header(default=None)):
    """Restrict analysis to the IntelliPaper API when deployed publicly."""
    if not token_required():
        return

    expected_token = os.getenv("SIMILARITY_SERVICE_TOKEN", "")
    if not expected_token:
        raise HTTPException(status_code=503, detail="Similarity service authentication is not configured.")
    if not x_intellipaper_service_token or not secrets.compare_digest(x_intellipaper_service_token, expected_token):
        raise HTTPException(status_code=401, detail="Unauthorized similarity-service request.")


@app.get("/health")
def health_check():
    return {"status": "ok", "engine": "tfidf"}


@app.post("/analyze", response_model=AnalysisResponse)
def analyze_paragraphs(
    payload: AnalysisRequest,
    x_intellipaper_service_token: str | None = Header(default=None),
):
    verify_service_token(x_intellipaper_service_token)
    corpus_directory = Path(os.getenv("CORPUS_DIRECTORY", str(DEFAULT_CORPUS)))
    try:
        return analyse(payload.text, corpus_directory, payload.references, payload.quality)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except RuntimeError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
