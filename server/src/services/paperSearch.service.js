import { AppError } from "../utils/AppError.js";

const openAlexUrl = "https://api.openalex.org/works";

const abstractFromIndex = (index) => {
  if (!index) return "Abstract unavailable.";
  const words = Object.entries(index).flatMap(([word, positions]) => positions.map((position) => [position, word]));
  return words.sort(([left], [right]) => left - right).map(([, word]) => word).join(" ");
};

const normalizeWork = (work) => {
  const source = work.primary_location?.source?.display_name || work.locations?.find((location) => location.source)?.source?.display_name || "Academic publication";
  const topicNames = [work.primary_topic?.display_name, ...(work.topics || []).map((topic) => topic.display_name), ...(work.concepts || []).slice(0, 3).map((concept) => concept.display_name)].filter(Boolean);
  return { externalId: work.id, title: work.title || "Untitled research work", authors: work.authorships?.map((authorship) => authorship.author?.display_name).filter(Boolean) || [], venue: source, year: String(work.publication_year || ""), citations: work.cited_by_count || 0, abstract: abstractFromIndex(work.abstract_inverted_index), topics: [...new Set(topicNames)].slice(0, 3), link: work.open_access?.oa_url || work.doi || work.primary_location?.landing_page_url || work.id };
};

export const searchPapers = async ({ query, topic, year, page = 1, perPage = 12 }) => {
  const search = [query, topic].filter(Boolean).join(" ") || "research";
  const params = new URLSearchParams({ search, page: String(page), "per-page": String(perPage), sort: "relevance_score:desc" });
  if (year) params.set("filter", `publication_year:${year}`);
  if (process.env.OPENALEX_EMAIL) params.set("mailto", process.env.OPENALEX_EMAIL);
  let response;
  try { response = await fetch(`${openAlexUrl}?${params}`, { signal: AbortSignal.timeout(10000), headers: { Accept: "application/json" } }); }
  catch { throw new AppError("The academic search provider could not be reached. Please try again.", 502); }
  if (!response.ok) throw new AppError("The academic search provider could not complete this search. Please try again.", 502);
  const payload = await response.json();
  return { papers: payload.results.map(normalizeWork), meta: { page: payload.meta?.page || page, perPage, total: payload.meta?.count || 0 } };
};
