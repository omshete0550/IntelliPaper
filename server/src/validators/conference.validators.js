import { z } from "zod";

export const createConferenceBookmarkSchema = z.object({
  conferenceId: z.string().trim().min(1).max(120),
  name: z.string().trim().min(1).max(500),
  startDate: z.string().trim().min(1).max(40),
  location: z.string().trim().max(200).optional().default(""),
  link: z.union([z.literal(""), z.string().url("Enter a valid conference URL.")]).optional().default(""),
});
