import { searchPapers } from "../services/paperSearch.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const search = asyncHandler(async (request, response) => {
  const papers = await searchPapers({ query: String(request.query.q || ""), topic: String(request.query.topic || ""), year: String(request.query.year || "") });
  response.json({ provider: "demo", papers });
});
