import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

export const listBookmarks = asyncHandler(async (request, response) => {
  const conferences = await prisma.conferenceBookmark.findMany({ where: { userId: request.auth.userId }, orderBy: { savedAt: "desc" } });
  response.json({ conferences });
});

export const createBookmark = asyncHandler(async (request, response) => {
  const conference = await prisma.conferenceBookmark.create({ data: { ...request.body, userId: request.auth.userId } });
  response.status(201).json({ conference });
});

export const deleteBookmark = asyncHandler(async (request, response) => {
  const conference = await prisma.conferenceBookmark.findFirst({ where: { id: request.params.id, userId: request.auth.userId } });
  if (!conference) throw new AppError("Saved conference not found.", 404);
  await prisma.conferenceBookmark.delete({ where: { id: conference.id } });
  response.status(204).send();
});
