import { z } from "zod";

export const NutritionSupportSchema = z.object({
  dietary_focus: z.string().describe("Primary dietary theme based on skin concerns"),
  superfoods: z.array(z.object({
    name: z.string(),
    benefit: z.string(),
    reason: z.string()
  })),
  supplements: z.array(z.object({
    name: z.string(),
    benefit: z.string(),
    usage: z.string()
  })),
  herbal_support: z.array(z.object({
    name: z.string(),
    benefit: z.string()
  })),
  hydration_protocol: z.string(),
  lifestyle_adjustments: z.array(z.string()),
  narrative: z.string().describe("Encouraging, beauty-focused explanation of these choices")
});

export type NutritionSupport = z.infer<typeof NutritionSupportSchema>;
