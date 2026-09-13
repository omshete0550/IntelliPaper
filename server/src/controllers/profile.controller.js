import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

const profileFields = { id: true, name: true, email: true, interests: true, affiliation: true, degree: true, researchStage: true, linkedin: true, collaboration: true, createdAt: true };

export const getProfile = asyncHandler(async (request, response) => {
  const user = await prisma.user.findUnique({ where: { id: request.auth.userId }, select: profileFields });
  if (!user) throw new AppError("User not found.", 404);
  response.json({ user });
});

export const updateProfile = asyncHandler(async (request, response) => {
  const user = await prisma.user.update({ where: { id: request.auth.userId }, data: request.body, select: profileFields });
  response.json({ user });
});
