import { AppError } from "../utils/AppError.js";

export const validate = (schema) => (request, _response, next) => {
  const result = schema.safeParse(request.body);
  if (!result.success) return next(new AppError(result.error.issues[0].message, 400));
  request.body = result.data;
  next();
};
