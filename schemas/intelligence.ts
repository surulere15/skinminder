import { z } from "zod";

export const skinIntelligenceSchema = z.object({
  skinScore: z.number().int().min(0).max(100),
  estimatedSkinAge: z.number().int().min(10).max(120).optional(), // Some old prompts return this
  primaryConcerns: z.array(z.string().min(1)),
  summary: z.string().min(1)
});

export type SkinIntelligenceResult = z.infer<typeof skinIntelligenceSchema>;
