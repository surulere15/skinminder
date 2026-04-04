import { z } from "zod";
import { SkinTypeEnum, SkinConcernEnum, ProductCategoryEnum } from "./skin-metrics";

// ============================================================
// IngredientAnalysisInput
// ============================================================

export const IngredientAnalysisInputSchema = z.object({
  ingredients: z
    .array(z.string().min(1).max(200))
    .min(1, "At least one ingredient is required")
    .max(100, "Maximum 100 ingredients per analysis")
    .describe("List of ingredient names to analyze"),
  skinType: SkinTypeEnum.optional().describe(
    "User's skin type for compatibility scoring"
  ),
  skinConcerns: z
    .array(SkinConcernEnum)
    .optional()
    .describe("User's skin concerns for relevance scoring"),
  productCategory: ProductCategoryEnum.optional().describe(
    "The product type these ingredients are from"
  ),
  productName: z
    .string()
    .max(200)
    .optional()
    .describe("Name of the product being analyzed"),
});

export type IngredientAnalysisInput = z.infer<typeof IngredientAnalysisInputSchema>;

// ============================================================
// IngredientDetail
// ============================================================

export const IngredientDetailSchema = z.object({
  name: z
    .string()
    .min(1, "Ingredient name is required")
    .max(200)
    .describe("Name of the ingredient (e.g. 'Niacinamide', 'Hyaluronic Acid')"),
  function: z
    .string()
    .min(1)
    .max(500)
    .describe("Primary function of the ingredient (e.g. 'humectant', 'antioxidant')"),
  benefits: z
    .array(z.string().min(1).max(300))
    .describe("List of skin benefits this ingredient provides"),
  isIrritant: z
    .boolean()
    .describe("Whether this ingredient is a known irritant"),
  irritantSeverity: z
    .enum(["none", "mild", "moderate", "severe"])
    .describe("Severity of irritation potential"),
  comedogenicRating: z
    .number()
    .int()
    .min(0, "Comedogenic rating minimum is 0")
    .max(5, "Comedogenic rating maximum is 5")
    .describe("Comedogenic rating: 0 = non-comedogenic, 5 = highly comedogenic"),
  suitableFor: z
    .array(SkinTypeEnum)
    .describe("Skin types this ingredient is suitable for"),
  concentration: z
    .string()
    .optional()
    .describe("Typical effective concentration range (e.g. '2-5%')"),
  warnings: z
    .array(z.string())
    .default([])
    .describe("Any warnings or contraindications"),
  pairsWith: z
    .array(z.string())
    .default([])
    .describe("Ingredients that work well in combination"),
  avoidWith: z
    .array(z.string())
    .default([])
    .describe("Ingredients to avoid combining with"),
});

export type IngredientDetail = z.infer<typeof IngredientDetailSchema>;

// ============================================================
// IngredientAnalysisResult
// ============================================================

export const IngredientAnalysisResultSchema = z.object({
  ingredients: z
    .array(IngredientDetailSchema)
    .min(1)
    .describe("Detailed analysis of each ingredient"),
  benefits: z
    .array(z.string().min(1))
    .describe("Overall combined benefits of the ingredient list"),
  possibleIrritants: z
    .array(z.string().min(1))
    .describe("Ingredients identified as potential irritants"),
  overallCompatibility: z
    .number()
    .min(0, "Compatibility score minimum is 0")
    .max(100, "Compatibility score maximum is 100")
    .describe(
      "Overall compatibility score for the user's skin type (0 = incompatible, 100 = perfect match)"
    ),
  redundancies: z
    .array(z.string())
    .default([])
    .describe("Ingredients that serve overlapping functions"),
  conflictingIngredients: z
    .array(
      z.object({
        ingredientA: z.string(),
        ingredientB: z.string(),
        reason: z.string(),
      })
    )
    .default([])
    .describe("Pairs of ingredients that may interact negatively"),
  summary: z
    .string()
    .max(2000)
    .describe("Human-readable summary of the ingredient analysis"),
});

export type IngredientAnalysisResult = z.infer<typeof IngredientAnalysisResultSchema>;

// ============================================================
// ProductComparisonResult
// ============================================================

export const ProductComparisonResultSchema = z.object({
  products: z
    .array(
      z.object({
        name: z.string().min(1),
        brand: z.string().optional(),
        ingredientCount: z.number().int().min(0),
        compatibility: z.number().min(0).max(100),
        irritantCount: z.number().int().min(0),
        keyBenefits: z.array(z.string()),
        keyRisks: z.array(z.string()),
      })
    )
    .min(2, "At least two products are required for comparison")
    .max(5, "Maximum 5 products per comparison")
    .describe("Analyzed products being compared"),
  recommendation: z
    .string()
    .min(1)
    .max(2000)
    .describe("AI recommendation on which product to choose and why"),
  bestFor: z
    .record(z.string(), z.string())
    .describe(
      "Map of concern -> recommended product name (e.g. { 'hydration': 'Product A' })"
    ),
  overallWinner: z
    .string()
    .optional()
    .describe("Name of the overall best product, if one clearly stands out"),
});

export type ProductComparisonResult = z.infer<typeof ProductComparisonResultSchema>;
