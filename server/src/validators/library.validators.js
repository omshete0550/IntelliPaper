import { z } from "zod";

const paperFields = {
  externalId: z.string().trim().min(1).max(160),
  title: z.string().trim().min(1).max(500),
  authors: z.array(z.string().trim().min(1).max(160)).max(30).default([]),
  venue: z.string().trim().max(200).optional().default(""),
  year: z.string().regex(/^\d{4}$/, "Year must use YYYY format.").optional().default(""),
  citations: z.number().int().min(0).max(10000000).optional().default(0),
  abstract: z.string().trim().max(10000).optional().default(""),
  topics: z.array(z.string().trim().min(1).max(80)).max(15).default([]),
  link: z.string().url("Enter a valid paper URL."),
};

export const createSavedPaperSchema = z.object(paperFields);
export const updateSavedPaperSchema = z.object({
  status: z.enum(["UNREAD", "READING", "FINISHED"]).optional(),
  notes: z.string().max(10000).optional(),
});
