import { Prisma } from "@prisma/client";

export const notFound = (request, _response, next) => {
  const error = new Error(`Route ${request.method} ${request.originalUrl} was not found.`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, _request, response, _next) => {
  const statusCode = error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002" ? 409 : error.statusCode || 500;
  const message = statusCode === 500 && process.env.NODE_ENV === "production" ? "An unexpected error occurred." : error.message;
  response.status(statusCode).json({ error: message });
};
