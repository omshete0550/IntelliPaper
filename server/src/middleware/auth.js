import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

export const requireAuth = (request, _response, next) => {
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return next(new AppError("Authentication is required.", 401));
  try {
    request.auth = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    next(new AppError("Your session is invalid or has expired.", 401));
  }
};
