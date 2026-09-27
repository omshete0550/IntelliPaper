import { prisma } from "../lib/prisma.js";

const worksUrl = "https://api.openalex.org/works";
const maxCandidates = 3;
const maxContentCharacters = 700_000;

const getWorkId = (work) => String(work.id || "").split("/").pop();

const requestUrl = (url) => {
  const value = new URL(url);
  value.searchParams.set("api_key", process.env.OPENALEX_API_KEY);
  return value;
};

const searchCandidates = async (text) => {
  const searchText = text.replace(/\s+/g, " ").trim().slice(0, 500);
  const params = new URLSearchParams({
    search: searchText,
    filter: "has_content.grobid_xml:true,best_oa_location.license:cc-by",
    "per-page": String(maxCandidates),
    select: "id,title,content_urls,best_oa_location,open_access",
    api_key: process.env.OPENALEX_API_KEY,
  });
  if (process.env.OPENALEX_EMAIL) params.set("mailto", process.env.OPENALEX_EMAIL);

  const response = await fetch(`${worksUrl}?${params}`, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(12_000) });
  if (!response.ok) throw new Error("OpenAlex could not find reference candidates.");
  const payload = await response.json();
  return (payload.results || []).filter((work) => getWorkId(work));
};

const contentUrlFor = (work) => work.content_urls?.grobid_xml || `https://content.openalex.org/works/${getWorkId(work)}.grobid-xml`;

const downloadTei = async (work) => {
  const response = await fetch(requestUrl(contentUrlFor(work)), { headers: { Accept: "application/xml" }, signal: AbortSignal.timeout(18_000) });
  if (!response.ok) return null;
  const contentLength = Number(response.headers.get("content-length") || 0);
  if (contentLength > maxContentCharacters) return null;
  const content = await response.text();
  if (content.length > maxContentCharacters || !content.includes("<")) return null;
  return content;
};

const toReference = (record) => ({
  source_id: record.externalId,
  title: record.title,
  source_url: record.sourceUrl,
  license: record.license,
  content: record.content,
});

const fetchAndCache = async (work) => {
  const externalId = getWorkId(work);
  const content = await downloadTei(work);
  if (!content) return null;
  const record = await prisma.referenceDocument.upsert({
    where: { externalId },
    update: {
      title: work.title || "Untitled OpenAlex work",
      sourceUrl: work.best_oa_location?.landing_page_url || work.open_access?.oa_url || work.id,
      license: work.best_oa_location?.license || "CC-BY",
      content,
      fetchedAt: new Date(),
    },
    create: {
      externalId,
      title: work.title || "Untitled OpenAlex work",
      sourceUrl: work.best_oa_location?.landing_page_url || work.open_access?.oa_url || work.id,
      license: work.best_oa_location?.license || "CC-BY",
      content,
    },
  });
  return toReference(record);
};

export const getOpenAlexReferences = async (text) => {
  if (!process.env.OPENALEX_API_KEY) {
    return { references: [], status: "disabled", message: "Add OPENALEX_API_KEY to enable open-access reference retrieval." };
  }

  try {
    const candidates = await searchCandidates(text);
    if (!candidates.length) return { references: [], status: "ready", message: "No licensed OpenAlex full-text candidates were found for this text." };

    const externalIds = candidates.map(getWorkId);
    const cachedRecords = await prisma.referenceDocument.findMany({ where: { externalId: { in: externalIds } } });
    const cachedById = new Map(cachedRecords.map((record) => [record.externalId, record]));
    const missingCandidates = candidates.filter((candidate) => !cachedById.has(getWorkId(candidate)));
    const downloaded = await Promise.all(missingCandidates.map(fetchAndCache));
    const references = [...cachedRecords.map(toReference), ...downloaded.filter(Boolean)];

    return {
      references,
      status: "ready",
      message: references.length ? `Compared against ${references.length} cached OpenAlex open-access document${references.length === 1 ? "" : "s"}.` : "OpenAlex candidates could not be downloaded as machine-readable text.",
    };
  } catch {
    return { references: [], status: "unavailable", message: "OpenAlex references are temporarily unavailable; local sources were still checked." };
  }
};
