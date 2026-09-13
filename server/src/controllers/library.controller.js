import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

const ownershipFilter = (id, userId) => ({ id, userId });

export const listSavedPapers = asyncHandler(async (request, response) => {
  const status = request.query.status;
  const savedPapers = await prisma.savedPaper.findMany({ where: { userId: request.auth.userId, ...(status ? { status } : {}) }, orderBy: { savedAt: "desc" } });
  response.json({ papers: savedPapers });
});

export const createSavedPaper = asyncHandler(async (request, response) => {
  const paper = await prisma.savedPaper.create({ data: { ...request.body, userId: request.auth.userId } });
  response.status(201).json({ paper });
});

export const updateSavedPaper = asyncHandler(async (request, response) => {
  const exists = await prisma.savedPaper.findFirst({ where: ownershipFilter(request.params.id, request.auth.userId) });
  if (!exists) throw new AppError("Saved paper not found.", 404);
  const paper = await prisma.savedPaper.update({ where: { id: exists.id }, data: request.body });
  response.json({ paper });
});

export const deleteSavedPaper = asyncHandler(async (request, response) => {
  const exists = await prisma.savedPaper.findFirst({ where: ownershipFilter(request.params.id, request.auth.userId) });
  if (!exists) throw new AppError("Saved paper not found.", 404);
  await prisma.savedPaper.delete({ where: { id: exists.id } });
  response.status(204).send();
});
