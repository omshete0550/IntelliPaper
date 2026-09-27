import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";

const detailInclude = { matches: { orderBy: { similarityPercentage: "desc" } } };

const toMatch = (match) => ({
  id: match.id,
  submitted_text: match.submittedText,
  source_text: match.referenceText,
  source_name: match.sourceName,
  source_paragraph: match.sourceParagraph,
  source_url: match.sourceUrl,
  source_license: match.sourceLicense,
  source_provider: match.sourceProvider,
  lexical_score: match.lexicalScore,
  semantic_score: match.semanticScore,
  similarity_percentage: match.similarityPercentage,
  confidence: match.confidence,
  match_basis: match.matchBasis,
  excluded: match.excluded,
});

const reportResponse = (report, includeInput = true) => {
  const visibleMatches = report.matches.filter((match) => !match.excluded);
  const highestSimilarity = visibleMatches[0]?.similarityPercentage || 0;
  return {
    id: report.id,
    ...(includeInput ? { input_text: report.inputText } : {}),
    engine: report.engine,
    notice: "Similarity preview only. Review matching passages and citations manually.",
    matches: visibleMatches.map(toMatch),
    summary: {
      highest_passage_similarity: highestSimilarity,
      matched_passages: visibleMatches.length,
      corpus_paragraphs: report.localCorpusParagraphs + report.openAlexCorpusParagraphs,
      local_corpus_paragraphs: report.localCorpusParagraphs,
      openalex_corpus_paragraphs: report.openAlexCorpusParagraphs,
      review_level: highestSimilarity >= 55 ? "high" : highestSimilarity >= 30 ? "medium" : highestSimilarity ? "low" : "none",
    },
    semantic: { enabled: report.semanticEnabled, message: report.semanticMessage },
    reference_sources: { status: report.referenceStatus, message: report.referenceMessage },
    quality_controls: {
      lexical_threshold: report.lexicalThreshold,
      semantic_threshold: report.semanticThreshold,
      ignore_references: report.ignoreReferences,
    },
    created_at: report.createdAt,
  };
};

export const createReport = async (userId, inputText, analysis, referenceSources, controls) => {
  const report = await prisma.similarityReport.create({
    data: {
      userId,
      inputText,
      engine: analysis.engine,
      highestSimilarity: analysis.summary.highest_passage_similarity,
      localCorpusParagraphs: analysis.summary.local_corpus_paragraphs,
      openAlexCorpusParagraphs: analysis.summary.openalex_corpus_paragraphs,
      semanticEnabled: analysis.semantic.enabled,
      semanticMessage: analysis.semantic.message,
      referenceStatus: referenceSources.status,
      referenceMessage: referenceSources.message,
      lexicalThreshold: controls.lexicalThreshold,
      semanticThreshold: controls.semanticThreshold,
      ignoreReferences: controls.ignoreReferences,
      matches: {
        create: analysis.matches.map((match) => ({
          sourceName: match.source_name,
          sourceParagraph: match.source_paragraph,
          sourceUrl: match.source_url || "",
          sourceLicense: match.source_license || "",
          sourceProvider: match.source_provider,
          submittedText: match.submitted_text,
          referenceText: match.source_text,
          lexicalScore: match.lexical_score,
          semanticScore: match.semantic_score,
          similarityPercentage: match.similarity_percentage,
          confidence: match.confidence,
          matchBasis: match.match_basis,
        })),
      },
    },
    include: detailInclude,
  });
  return reportResponse(report);
};

export const listReports = async (userId) => {
  const reports = await prisma.similarityReport.findMany({ where: { userId }, include: detailInclude, orderBy: { createdAt: "desc" }, take: 20 });
  return reports.map((report) => reportResponse(report, false));
};

export const getReport = async (reportId, userId) => {
  const report = await prisma.similarityReport.findFirst({ where: { id: reportId, userId }, include: detailInclude });
  if (!report) throw new AppError("Similarity report not found.", 404);
  return reportResponse(report);
};

export const deleteReport = async (reportId, userId) => {
  const report = await prisma.similarityReport.findFirst({ where: { id: reportId, userId }, select: { id: true } });
  if (!report) throw new AppError("Similarity report not found.", 404);
  await prisma.similarityReport.delete({ where: { id: report.id } });
};

export const setMatchExcluded = async (reportId, matchId, userId, excluded) => {
  const match = await prisma.similarityMatch.findFirst({ where: { id: matchId, reportId, report: { userId } }, select: { id: true } });
  if (!match) throw new AppError("Similarity match not found.", 404);
  await prisma.similarityMatch.update({ where: { id: match.id }, data: { excluded } });
  return getReport(reportId, userId);
};
