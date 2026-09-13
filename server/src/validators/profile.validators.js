import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  interests: z.array(z.string().trim().min(1).max(50)).max(12).optional(),
  affiliation: z.string().trim().max(120).optional(),
  degree: z.string().trim().max(120).optional(),
  researchStage: z.enum(["Idea", "Writing", "Reviewing", "Publishing"]).optional(),
  linkedin: z.union([z.literal(""), z.string().url("Enter a valid profile URL.")]).optional(),
  collaboration: z.boolean().optional(),
});
