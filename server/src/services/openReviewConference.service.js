import { prisma } from "../lib/prisma.js";

const openReviewGroupsUrl = "https://api2.openreview.net/groups";
const cacheDurationMs = 6 * 60 * 60 * 1000;
const maximumVenues = 120;

const knownVenueNames = {
  "aaai.org": "AAAI Conference on Artificial Intelligence",
  "aclweb.org": "Annual Meeting of the Association for Computational Linguistics",
  "emnlp.org": "Conference on Empirical Methods in Natural Language Processing",
  "iclr.cc": "International Conference on Learning Representations",
  "icml.cc": "International Conference on Machine Learning",
  "neurips.cc": "Conference on Neural Information Processing Systems",
  "openreview.net": "OpenReview Conference",
};

const acronymFor = (organization) => organization.replace(/\.org$|\.cc$|\.net$/i, "").replace(/[^a-z0-9]/gi, "").toUpperCase();

const topicsFor = (venueId) => {
  const value = venueId.toLowerCase();
  if (/(cvpr|iccv|eccv|wacv|vision)/.test(value)) return ["Computer Vision", "Artificial Intelligence"];
  if (/(acl|emnlp|naacl|eacl|nlp|language)/.test(value)) return ["Natural Language Processing", "Artificial Intelligence"];
  if (/(iclr|icml|neurips|aaai|aistats|uai|learning|ml)/.test(value)) return ["Machine Learning", "Artificial Intelligence"];
  if (/(robot|iros|icra)/.test(value)) return ["Robotics", "Artificial Intelligence"];
  return ["Academic Research"];
};

const requestGroups = async (parameters) => {
  const params = new URLSearchParams(parameters);
  const response = await fetch(`${openReviewGroupsUrl}?${params}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`OpenReview returned ${response.status}.`);
  return response.json();
};

const activeVenueIds = async () => {
  const payload = await requestGroups({ id: "active_venues", select: "id,members" });
  return [...new Set((payload.groups || []).flatMap((group) => group.members || []))];
};

const conferenceDetails = (venueId) => {
  const match = venueId.match(/^([^/]+)\/(20\d{2})\/Conference$/i);
  if (!match) return null;

  const [, organization, year] = match;
  const normalizedOrganization = organization.toLowerCase();
  const acronym = acronymFor(organization);
  const conferenceName = knownVenueNames[normalizedOrganization] || `${acronym} Conference`;

  return {
    venueId,
    year,
    name: `${conferenceName} ${year}`,
    acronym: `${acronym} ${year}`,
    topics: topicsFor(venueId),
    sourceUrl: `https://openreview.net/group?id=${encodeURIComponent(venueId)}`,
  };
};

const externalIdFor = (details) => `openreview:${details.venueId.toLowerCase()}`;

const hasFreshOpenReviewCache = async () => {
  const recentEvent = await prisma.conferenceEvent.findFirst({
    where: { provider: { contains: "OpenReview" }, verifiedAt: { gte: new Date(Date.now() - cacheDurationMs) } },
    select: { id: true },
  });
  return Boolean(recentEvent);
};

export const syncOpenReviewConferenceEvents = async ({ force = false } = {}) => {
  if (!force && await hasFreshOpenReviewCache()) {
    return { status: "cached", count: 0, message: "Live OpenReview venues were refreshed recently." };
  }

  try {
    const currentYear = new Date().getUTCFullYear();
    const venues = (await activeVenueIds())
      .map(conferenceDetails)
      .filter(Boolean)
      .filter((conference) => Number(conference.year) >= currentYear && Number(conference.year) <= currentYear + 2)
      .sort((first, second) => first.name.localeCompare(second.name))
      .slice(0, maximumVenues);

    await Promise.all(venues.map(async (conference) => {
      const externalId = externalIdFor(conference);
      await prisma.conferenceEvent.upsert({
        where: { externalId },
        update: {
          provider: "OpenReview",
          name: conference.name,
          acronym: conference.acronym,
          topics: conference.topics,
          sourceUrl: conference.sourceUrl,
          websiteUrl: conference.sourceUrl,
          verificationStatus: "provider-listed",
          verifiedAt: new Date(),
        },
        create: {
          externalId,
          provider: "OpenReview",
          name: conference.name,
          acronym: conference.acronym,
          topics: conference.topics,
          sourceUrl: conference.sourceUrl,
          websiteUrl: conference.sourceUrl,
          verificationStatus: "provider-listed",
        },
      });
    }));

    return {
      status: "ready",
      count: venues.length,
      message: venues.length
        ? `Imported ${venues.length} active conference venues from OpenReview.`
        : "OpenReview did not list any upcoming conference venues in the selected date range.",
    };
  } catch {
    return { status: "unavailable", count: 0, message: "OpenReview is temporarily unavailable; verified catalog events are still shown." };
  }
};
