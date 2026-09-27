import { AppError } from "../utils/AppError.js";

const openAlexSourcesUrl = "https://api.openalex.org/sources";

const toJournal = (source) => ({
  id: source.id,
  name: source.display_name || "Untitled journal",
  publisher: source.host_organization_name || source.host_organization?.display_name || "Publisher unavailable",
  issn: source.issn_l || "ISSN unavailable",
  websiteUrl: source.homepage_url || source.id,
  openAccess: Boolean(source.is_oa || source.is_in_doaj),
  worksCount: source.works_count || 0,
  citedByCount: source.cited_by_count || 0,
  hIndex: source.summary_stats?.h_index || null,
  topics: (source.topics || []).map((topic) => topic.display_name).filter(Boolean).slice(0, 3),
});

export const searchJournals = async ({ query = "", page = 1, perPage = 6 }) => {
  const params = new URLSearchParams({
    filter: "type:journal,is_in_doaj:true",
    sort: "works_count:desc",
    page: String(page),
    "per-page": String(perPage),
  });
  if (query.trim()) params.set("search", query.trim());
  if (process.env.OPENALEX_EMAIL) params.set("mailto", process.env.OPENALEX_EMAIL);
  if (process.env.OPENALEX_API_KEY) params.set("api_key", process.env.OPENALEX_API_KEY);

  let response;
  try {
    response = await fetch(`${openAlexSourcesUrl}?${params}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new AppError("The journal provider could not be reached. Please try again.", 502);
  }
  if (!response.ok) throw new AppError("The journal provider could not complete this search. Please try again.", 502);

  const payload = await response.json();
  return {
    journals: (payload.results || []).map(toJournal),
    meta: {
      page: payload.meta?.page || page,
      perPage,
      total: payload.meta?.count || 0,
    },
  };
};
