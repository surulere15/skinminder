import { z } from "zod";

export const ProductComparisonSchema = z.object({
  synergy_score: z.number().min(0).max(100),
  collision_risks: z.array(z.object({
    ingredients: z.array(z.string()),
    issue: z.string(),
    severity: z.enum(["low", "medium", "high"])
  })),
  combined_benefits: z.array(z.string()),
  recommendation: z.string().describe("Specific combined usage advice"),
  is_compatible: z.boolean(),
  skin_type_suitability: z.record(z.string(), z.boolean())
});

export type ProductComparison = z.infer<typeof ProductComparisonSchema>;
