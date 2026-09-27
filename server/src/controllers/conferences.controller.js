import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { listConferenceEvents, syncConferenceSources } from "../services/conferenceCatalog.service.js";

export const listEvents = asyncHandler(async (request, response) => {
  const user = await prisma.user.findUnique({ where: { id: request.auth.userId }, select: { interests: true } });
  response.json({ conferences: await listConferenceEvents(user?.interests || []) });
});

export const syncEvents = asyncHandler(async (request, response) => {
  const user = await prisma.user.findUnique({ where: { id: request.auth.userId }, select: { interests: true } });
  const sync = await syncConferenceSources({ force: true });
  response.json({ sync, conferences: await listConferenceEvents(user?.interests || []) });
});

export const listBookmarks = asyncHandler(async (request, response) => {
  const conferences = await prisma.conferenceBookmark.findMany({ where: { userId: request.auth.userId }, orderBy: { savedAt: "desc" } });
  response.json({ conferences });
});

export const createBookmark = asyncHandler(async (request, response) => {
  const event = request.body.eventId ? await prisma.conferenceEvent.findUnique({ where: { id: request.body.eventId } }) : null;
  if (request.body.eventId && !event) throw new AppError("Conference event not found.", 404);
  const conference = await prisma.conferenceBookmark.create({ data: { ...request.body, eventId: event?.id, conferenceId: event?.externalId || request.body.conferenceId, name: event?.name || request.body.name, startDate: event?.startDate || request.body.startDate, location: event?.location || request.body.location, link: event?.websiteUrl || request.body.link, userId: request.auth.userId } });
  response.status(201).json({ conference });
});

export const deleteBookmark = asyncHandler(async (request, response) => {
  const conference = await prisma.conferenceBookmark.findFirst({ where: { id: request.params.id, userId: request.auth.userId } });
  if (!conference) throw new AppError("Saved conference not found.", 404);
  await prisma.conferenceBookmark.delete({ where: { id: conference.id } });
  response.status(204).send();
});
