import { z } from "zod";

export const skinAgeSchema = z.object({
  estimatedAge: z.number().int().min(10).max(120),
  confidence: z.enum(["low", "medium", "high"]),
  contributingFactors: z.array(z.string().min(1)),
  personalizedInsight: z.string().min(1)
});

export type SkinAgeResult = z.infer<typeof skinAgeSchema>;
