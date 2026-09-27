from functools import lru_cache


MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


class SemanticEngineError(RuntimeError):
    """Raised when the optional embedding model cannot be loaded."""


@lru_cache(maxsize=1)
def get_model():
    try:
        from sentence_transformers import SentenceTransformer
        return SentenceTransformer(MODEL_NAME)
    except Exception as error:
        raise SemanticEngineError("Semantic model is unavailable.") from error


def semantic_similarity_matrix(submitted_paragraphs: list[str], corpus_paragraphs: list[str]) -> list[list[float]]:
    """Return cosine-like dot-product scores from normalized sentence embeddings."""
    try:
        model = get_model()
        submitted_embeddings = model.encode(submitted_paragraphs, normalize_embeddings=True, show_progress_bar=False)
        corpus_embeddings = model.encode(corpus_paragraphs, normalize_embeddings=True, show_progress_bar=False)
        return (submitted_embeddings @ corpus_embeddings.T).tolist()
    except SemanticEngineError:
        raise
    except Exception as error:
        raise SemanticEngineError("Semantic comparison could not be completed.") from error
