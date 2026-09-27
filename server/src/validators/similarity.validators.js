import { z } from "zod";

export const similarityCheckSchema = z.object({
  text: z.string().trim().min(80, "Paste at least 80 characters to run a similarity check.").max(20_000, "Keep a single check under 20,000 characters."),
  lexicalThreshold: z.number().min(0.05).max(0.8).optional().default(0.18),
  semanticThreshold: z.number().min(0.45).max(0.95).optional().default(0.7),
  ignoreReferences: z.boolean().optional().default(true),
});

export const matchExclusionSchema = z.object({ excluded: z.boolean() });
