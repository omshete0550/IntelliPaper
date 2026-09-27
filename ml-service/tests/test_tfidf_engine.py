import tempfile
import unittest
from unittest.mock import patch
from pathlib import Path

from app.tfidf_engine import analyse
from app.embedding_engine import SemanticEngineError
from app.schemas import ReferenceDocument


class TfidfEngineTests(unittest.TestCase):
    def setUp(self):
        self.semantic_patcher = patch("app.tfidf_engine.semantic_similarity_matrix", side_effect=SemanticEngineError("Disabled in unit tests."))
        self.semantic_patcher.start()

    def tearDown(self):
        self.semantic_patcher.stop()

    def test_returns_a_match_for_similar_paragraphs(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            corpus_directory = Path(temporary_directory)
            (corpus_directory / "source.txt").write_text(
                "Machine learning systems learn patterns from training examples and use those patterns for new predictions.",
                encoding="utf-8",
            )
            result = analyse(
                "Machine learning systems learn patterns from training examples before making predictions for new inputs.",
                corpus_directory,
            )

        self.assertEqual(result["matches"][0]["source_name"], "Source")
        self.assertGreater(result["summary"]["highest_passage_similarity"], 50)

    def test_returns_no_match_for_unrelated_paragraph(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            corpus_directory = Path(temporary_directory)
            (corpus_directory / "source.txt").write_text(
                "Marine biology studies living organisms in oceans, coral reefs, and coastal habitats.",
                encoding="utf-8",
            )
            result = analyse(
                "A violin concerto can use changing rhythm and harmony to create tension for listeners in a concert hall.",
                corpus_directory,
            )

        self.assertEqual(result["matches"], [])

    def test_compares_openalex_tei_paragraphs(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            result = analyse(
                "Object detection in aerial images is challenging because objects have varied scales, orientations, and shapes.",
                Path(temporary_directory),
                [ReferenceDocument(
                    source_id="W123",
                    title="Aerial Object Detection",
                    source_url="https://example.org/paper",
                    license="CC-BY",
                    content="<TEI><text><body><p>Object detection in aerial images is challenging because objects have varied scales, orientations, and shapes.</p></body></text></TEI>",
                )],
            )

        self.assertEqual(result["matches"][0]["source_provider"], "OpenAlex open access")
        self.assertEqual(result["summary"]["openalex_corpus_paragraphs"], 1)

    @patch("app.tfidf_engine.semantic_similarity_matrix", return_value=[[0.86]])
    def test_keeps_a_semantic_only_match(self, _semantic_similarity_matrix):
        with tempfile.TemporaryDirectory() as temporary_directory:
            corpus_directory = Path(temporary_directory)
            (corpus_directory / "source.txt").write_text(
                "An unrelated reference paragraph that uses completely different wording from the submitted passage.",
                encoding="utf-8",
            )
            result = analyse(
                "This paragraph has different vocabulary but represents an equivalent conceptual meaning for the model.",
                corpus_directory,
            )

        self.assertEqual(result["matches"][0]["match_basis"], "semantic")
        self.assertEqual(result["matches"][0]["semantic_score"], 0.86)
        self.assertTrue(result["semantic"]["enabled"])

    def test_ignores_a_references_section_when_requested(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            corpus_directory = Path(temporary_directory)
            (corpus_directory / "source.txt").write_text(
                "Smith, J. An exact reference title that should not be analysed as submitted writing.",
                encoding="utf-8",
            )
            result = analyse(
                "This research paragraph explains an original observation in sufficient detail for a similarity check.\n\nReferences\nSmith, J. An exact reference title that should not be analysed as submitted writing.",
                corpus_directory,
                quality={"ignore_references": True},
            )

        self.assertEqual(result["matches"], [])
