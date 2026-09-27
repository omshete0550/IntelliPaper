from pydantic import BaseModel, Field


class QualityControls(BaseModel):
    lexical_threshold: float = Field(default=0.18, ge=0.05, le=0.8)
    semantic_threshold: float = Field(default=0.70, ge=0.45, le=0.95)
    ignore_references: bool = True


class AnalysisRequest(BaseModel):
    text: str = Field(min_length=80, max_length=20_000)
    references: list["ReferenceDocument"] = Field(default_factory=list, max_length=3)
    quality: QualityControls = Field(default_factory=QualityControls)


class ReferenceDocument(BaseModel):
    source_id: str = Field(max_length=200)
    title: str = Field(max_length=500)
    source_url: str = Field(max_length=2_000)
    license: str = Field(default="", max_length=100)
    content: str = Field(max_length=700_000)


class SimilarityMatch(BaseModel):
    submitted_text: str
    source_text: str
    source_name: str
    source_paragraph: int
    source_url: str = ""
    source_license: str = ""
    source_provider: str
    lexical_score: float
    semantic_score: float | None = None
    similarity_percentage: int
    confidence: str
    match_basis: str


class AnalysisSummary(BaseModel):
    highest_passage_similarity: int
    matched_passages: int
    corpus_paragraphs: int
    local_corpus_paragraphs: int
    openalex_corpus_paragraphs: int
    review_level: str


class SemanticSummary(BaseModel):
    enabled: bool
    model: str | None = None
    message: str


class AnalysisResponse(BaseModel):
    engine: str = "TF-IDF cosine similarity"
    notice: str = "Similarity preview only. Review matching passages and citations manually."
    matches: list[SimilarityMatch]
    summary: AnalysisSummary
    semantic: SemanticSummary
    quality: QualityControls
