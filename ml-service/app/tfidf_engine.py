from dataclasses import dataclass
import os
from pathlib import Path
from xml.etree import ElementTree

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from .cleaning import clean_text, remove_reference_section, split_paragraphs
from .embedding_engine import MODEL_NAME, SemanticEngineError, semantic_similarity_matrix


MATCH_THRESHOLD = 0.18
SEMANTIC_MATCH_THRESHOLD = 0.70
MAX_MATCHES = 5


def semantic_enabled() -> bool:
    return os.getenv("SEMANTIC_ENABLED", "true").lower() in {"1", "true", "yes"}


@dataclass
class CorpusParagraph:
    text: str
    source_name: str
    paragraph_number: int
    source_url: str = ""
    source_license: str = ""
    source_provider: str = "Local corpus"


def load_corpus(corpus_directory: Path) -> list[CorpusParagraph]:
    paragraphs: list[CorpusParagraph] = []
    for source_file in sorted(corpus_directory.glob("*.txt")):
        source_paragraphs = split_paragraphs(source_file.read_text(encoding="utf-8"))
        paragraphs.extend(
            CorpusParagraph(
                text=paragraph,
                source_name=source_file.stem.replace("-", " ").title(),
                paragraph_number=index + 1,
            )
            for index, paragraph in enumerate(source_paragraphs)
        )
    return paragraphs


def paragraphs_from_tei(content: str) -> list[str]:
    """Extract paragraph text from OpenAlex's GROBID TEI XML, with plain-text fallback."""
    try:
        root = ElementTree.fromstring(content)
        paragraphs = [
            clean_text(" ".join(element.itertext()))
            for element in root.iter()
            if element.tag.rsplit("}", 1)[-1].lower() == "p"
        ]
        meaningful = [paragraph for paragraph in paragraphs if len(paragraph) >= 40]
        if meaningful:
            return meaningful
    except ElementTree.ParseError:
        pass
    return split_paragraphs(content)


def load_openalex_references(references: list) -> list[CorpusParagraph]:
    paragraphs: list[CorpusParagraph] = []
    for reference in references:
        for index, paragraph in enumerate(paragraphs_from_tei(reference.content)):
            paragraphs.append(
                CorpusParagraph(
                    text=paragraph,
                    source_name=reference.title,
                    paragraph_number=index + 1,
                    source_url=reference.source_url,
                    source_license=reference.license,
                    source_provider="OpenAlex open access",
                )
            )
    return paragraphs


def confidence_for(score: float) -> str:
    if score >= 0.55:
        return "high"
    if score >= 0.30:
        return "medium"
    return "low"


def match_basis_for(lexical_score: float, semantic_score: float | None, lexical_threshold: float, semantic_threshold: float) -> str:
    lexical_match = lexical_score >= lexical_threshold
    semantic_match = semantic_score is not None and semantic_score >= semantic_threshold
    if lexical_match and semantic_match:
        return "lexical and semantic"
    if semantic_match:
        return "semantic"
    return "lexical"


def analyse(text: str, corpus_directory: Path, references: list = None, quality=None) -> dict:
    quality = quality or {}
    lexical_threshold = getattr(quality, "lexical_threshold", quality.get("lexical_threshold", MATCH_THRESHOLD) if isinstance(quality, dict) else MATCH_THRESHOLD)
    semantic_threshold = getattr(quality, "semantic_threshold", quality.get("semantic_threshold", SEMANTIC_MATCH_THRESHOLD) if isinstance(quality, dict) else SEMANTIC_MATCH_THRESHOLD)
    ignore_references = getattr(quality, "ignore_references", quality.get("ignore_references", True) if isinstance(quality, dict) else True)
    text_to_analyse = remove_reference_section(text) if ignore_references else text
    submitted_paragraphs = split_paragraphs(text_to_analyse)
    if not submitted_paragraphs:
        raise ValueError("Add at least one paragraph with 40 or more characters.")

    local_corpus = load_corpus(corpus_directory)
    openalex_corpus = load_openalex_references(references or [])
    corpus = local_corpus + openalex_corpus
    if not corpus:
        raise RuntimeError("The local reference corpus is empty.")

    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), lowercase=True)
    vectors = vectorizer.fit_transform(submitted_paragraphs + [item.text for item in corpus])
    submitted_vectors = vectors[: len(submitted_paragraphs)]
    corpus_vectors = vectors[len(submitted_paragraphs) :]
    scores = cosine_similarity(submitted_vectors, corpus_vectors)

    semantic_scores = None
    semantic_message = "Semantic embeddings are disabled; lexical TF-IDF matching was used."
    if semantic_enabled():
        semantic_message = "Semantic model is unavailable; lexical TF-IDF matching was used."
        try:
            semantic_scores = semantic_similarity_matrix(submitted_paragraphs, [item.text for item in corpus])
            semantic_message = f"Semantic embeddings enabled with {MODEL_NAME}."
        except SemanticEngineError:
            pass

    candidates = []
    for submitted_index, row in enumerate(scores):
        for corpus_index, score in enumerate(row):
            score = float(score)
            semantic_score = max(0.0, float(semantic_scores[submitted_index][corpus_index])) if semantic_scores else None
            if score < lexical_threshold and (semantic_score is None or semantic_score < semantic_threshold):
                continue
            source = corpus[corpus_index]
            ranking_score = max(score, semantic_score or 0)
            candidates.append(
                {
                    "submitted_text": submitted_paragraphs[submitted_index],
                    "source_text": source.text,
                    "source_name": source.source_name,
                    "source_paragraph": source.paragraph_number,
                    "source_url": source.source_url,
                    "source_license": source.source_license,
                    "source_provider": source.source_provider,
                    "lexical_score": round(score, 3),
                    "semantic_score": round(semantic_score, 3) if semantic_score is not None else None,
                    "similarity_percentage": round(ranking_score * 100),
                    "confidence": confidence_for(ranking_score),
                    "match_basis": match_basis_for(score, semantic_score, lexical_threshold, semantic_threshold),
                    "ranking_score": ranking_score,
                }
            )

    matches = sorted(candidates, key=lambda item: item["ranking_score"], reverse=True)[:MAX_MATCHES]
    for match in matches:
        match.pop("ranking_score")
    highest_score = matches[0]["similarity_percentage"] if matches else 0
    review_level = confidence_for(highest_score / 100) if matches else "none"

    return {
        "engine": "TF-IDF + sentence embeddings" if semantic_scores else "TF-IDF cosine similarity",
        "matches": matches,
        "summary": {
            "highest_passage_similarity": highest_score,
            "matched_passages": len(matches),
            "corpus_paragraphs": len(corpus),
            "local_corpus_paragraphs": len(local_corpus),
            "openalex_corpus_paragraphs": len(openalex_corpus),
            "review_level": review_level,
        },
        "semantic": {
            "enabled": semantic_scores is not None,
            "model": MODEL_NAME if semantic_scores else None,
            "message": semantic_message,
        },
        "quality": {
            "lexical_threshold": lexical_threshold,
            "semantic_threshold": semantic_threshold,
            "ignore_references": ignore_references,
        },
    }
