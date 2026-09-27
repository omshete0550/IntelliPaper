import { AppError } from "../utils/AppError.js";

const serviceUrl = () => (process.env.SIMILARITY_SERVICE_URL || "http://localhost:8000").replace(/\/$/, "");

export const checkSimilarity = async (text, references = [], controls = {}) => {
  try {
    const headers = { "Content-Type": "application/json" };
    if (process.env.SIMILARITY_SERVICE_TOKEN) {
      headers["X-IntelliPaper-Service-Token"] = process.env.SIMILARITY_SERVICE_TOKEN;
    }

    const response = await fetch(`${serviceUrl()}/analyze`, {
      method: "POST",
      headers,
      body: JSON.stringify({ text, references, quality: { lexical_threshold: controls.lexicalThreshold, semantic_threshold: controls.semanticThreshold, ignore_references: controls.ignoreReferences } }),
      signal: AbortSignal.timeout(30_000),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new AppError(body.detail || "The similarity service could not analyze this text.", response.status === 400 ? 400 : 503);
    return body;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Similarity service is unavailable. Start the local ML service and try again.", 503);
  }
};
