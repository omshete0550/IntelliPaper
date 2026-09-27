import { checkSimilarity } from "../services/similarity.service.js";
import { getOpenAlexReferences } from "../services/openAlexReference.service.js";
import { createReport, deleteReport as removeReport, getReport, listReports, setMatchExcluded } from "../services/similarityReport.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const check = asyncHandler(async (request, response) => {
  const referenceResult = await getOpenAlexReferences(request.body.text);
  const analysis = await checkSimilarity(request.body.text, referenceResult.references, request.body);
  const report = await createReport(request.auth.userId, request.body.text, analysis, referenceResult, request.body);
  response.status(201).json(report);
});

export const list = asyncHandler(async (request, response) => response.json({ reports: await listReports(request.auth.userId) }));
export const get = asyncHandler(async (request, response) => response.json(await getReport(request.params.id, request.auth.userId)));
export const remove = asyncHandler(async (request, response) => { await removeReport(request.params.id, request.auth.userId); response.status(204).send(); });
export const updateMatch = asyncHandler(async (request, response) => response.json(await setMatchExcluded(request.params.id, request.params.matchId, request.auth.userId, request.body.excluded)));
