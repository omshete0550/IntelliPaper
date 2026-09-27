import os
from pathlib import Path

from fastapi import FastAPI, HTTPException

from .schemas import AnalysisRequest, AnalysisResponse
from .tfidf_engine import analyse


app = FastAPI(title="IntelliPaper Similarity Service", version="1.0.0")
DEFAULT_CORPUS = Path(__file__).resolve().parent.parent / "data" / "corpus"


@app.get("/health")
def health_check():
    return {"status": "ok", "engine": "tfidf"}


@app.post("/analyze", response_model=AnalysisResponse)
def analyze_paragraphs(payload: AnalysisRequest):
    corpus_directory = Path(os.getenv("CORPUS_DIRECTORY", str(DEFAULT_CORPUS)))
    try:
        return analyse(payload.text, corpus_directory, payload.references, payload.quality)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except RuntimeError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
