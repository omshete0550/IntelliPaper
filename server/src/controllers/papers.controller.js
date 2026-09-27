import { searchPapers } from "../services/paperSearch.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const search = asyncHandler(async (request, response) => {
  const result = await searchPapers({ query: String(request.query.q || ""), topic: String(request.query.topic || ""), year: String(request.query.year || ""), page: Math.max(1, Number(request.query.page) || 1) });
  response.json({ provider: "OpenAlex", ...result });
});
