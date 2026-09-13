import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { createToken } from "../utils/token.js";

const safeUser = (user) => ({ id: user.id, name: user.name, email: user.email, interests: user.interests, affiliation: user.affiliation, degree: user.degree, researchStage: user.researchStage, linkedin: user.linkedin, collaboration: user.collaboration });

export const register = asyncHandler(async (request, response) => {
  const existingUser = await prisma.user.findUnique({ where: { email: request.body.email } });
  if (existingUser) throw new AppError("An account with this email already exists.", 409);
  const passwordHash = await bcrypt.hash(request.body.password, 12);
  const user = await prisma.user.create({ data: { name: request.body.name, email: request.body.email, passwordHash } });
  response.status(201).json({ token: createToken(user.id), user: safeUser(user) });
});

export const login = asyncHandler(async (request, response) => {
  const user = await prisma.user.findUnique({ where: { email: request.body.email } });
  if (!user || !(await bcrypt.compare(request.body.password, user.passwordHash))) throw new AppError("Email or password is incorrect.", 401);
  response.json({ token: createToken(user.id), user: safeUser(user) });
});

export const me = asyncHandler(async (request, response) => {
  const user = await prisma.user.findUnique({ where: { id: request.auth.userId } });
  if (!user) throw new AppError("User not found.", 404);
  response.json({ user: safeUser(user) });
});
