import { prisma } from "../lib/prisma.js";
import { syncOpenReviewConferenceEvents } from "./openReviewConference.service.js";

// Dates are intentionally blank where an organiser has not published them yet.
const verifiedEvents = [
  { externalId: "iclr-2027", name: "International Conference on Learning Representations 2027", acronym: "ICLR 2027", topics: ["Artificial Intelligence", "Machine Learning", "Deep Learning"], submissionDeadline: "2026-09-25 AOE", location: "To be announced", mode: "To be announced", websiteUrl: "https://iclr.cc/Conferences/2027", sourceUrl: "https://iclr.cc/Conferences/2027/AuthorGuidelines" },
  { externalId: "neurips-2026", name: "Conference on Neural Information Processing Systems 2026", acronym: "NeurIPS 2026", topics: ["Artificial Intelligence", "Machine Learning", "Neural Networks"], location: "To be announced", mode: "Hybrid", websiteUrl: "https://neurips.cc/", sourceUrl: "https://neurips.cc/?event=14542" },
  { externalId: "cvpr-2027", name: "IEEE/CVF Conference on Computer Vision and Pattern Recognition 2027", acronym: "CVPR 2027", topics: ["Computer Vision", "Artificial Intelligence", "Machine Learning"], location: "To be announced", websiteUrl: "https://cvpr.thecvf.com/", sourceUrl: "https://cvpr.thecvf.com/" },
  { externalId: "icml-2027", name: "International Conference on Machine Learning 2027", acronym: "ICML 2027", topics: ["Machine Learning", "Artificial Intelligence"], location: "To be announced", websiteUrl: "https://icml.cc/", sourceUrl: "https://icml.cc/" },
  { externalId: "aaai-2027", name: "AAAI Conference on Artificial Intelligence 2027", acronym: "AAAI 2027", topics: ["Artificial Intelligence", "Machine Learning"], location: "To be announced", websiteUrl: "https://aaai.org/conference/aaai/", sourceUrl: "https://aaai.org/conference/aaai/" },
  { externalId: "acl-2027", name: "Annual Meeting of the Association for Computational Linguistics 2027", acronym: "ACL 2027", topics: ["Natural Language Processing", "Artificial Intelligence"], location: "To be announced", websiteUrl: "https://www.aclweb.org/portal/", sourceUrl: "https://www.aclweb.org/portal/" },
];

export const syncVerifiedConferenceCatalog = async () => {
  const events = await Promise.all(verifiedEvents.map((event) => prisma.conferenceEvent.upsert({ where: { externalId: event.externalId }, update: { ...event, provider: "Verified catalog", verificationStatus: "verified", verifiedAt: new Date() }, create: { ...event, provider: "Verified catalog", verificationStatus: "verified" } })));
  return events;
};

export const syncConferenceSources = async ({ force = false } = {}) => {
  const verifiedEventsResult = await syncVerifiedConferenceCatalog();
  const openReview = await syncOpenReviewConferenceEvents({ force });
  return { verifiedCount: verifiedEventsResult.length, openReview };
};

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const displayKeyFor = (event) => normalize(event.acronym || event.name);
const providerPriority = (event) => event.provider.includes("Verified catalog") ? 2 : 1;

const mergeDuplicateEvents = (events) => {
  const byDisplayKey = new Map();
  for (const event of events) {
    const key = displayKeyFor(event);
    const existing = byDisplayKey.get(key);
    if (!existing) {
      byDisplayKey.set(key, event);
      continue;
    }

    const preferred = providerPriority(existing) >= providerPriority(event) ? existing : event;
    const secondary = preferred === existing ? event : existing;
    const providers = [...new Set([preferred.provider, secondary.provider])];
    byDisplayKey.set(key, { ...preferred, provider: providers.join(" + ") });
  }
  return [...byDisplayKey.values()];
};

export const listConferenceEvents = async (interests = []) => {
  await syncConferenceSources();
  const events = await prisma.conferenceEvent.findMany({ orderBy: [{ verifiedAt: "desc" }, { name: "asc" }] });
  const normalizedInterests = interests.map(normalize);
  return mergeDuplicateEvents(events)
    .map((event) => ({ ...event, relevance: event.topics.reduce((score, topic) => score + Number(normalizedInterests.some((interest) => normalize(topic).includes(interest) || interest.includes(normalize(topic)))), 0) }))
    .sort((a, b) => b.relevance - a.relevance || a.name.localeCompare(b.name));
};
