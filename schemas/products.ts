import { z } from "zod";
import {
  SkinConcernEnum,
  SkinTypeEnum,
  ProductCategoryEnum,
} from "./skin-metrics";

// ============================================================
// ProductRecommendation
// ============================================================

export const ProductRecommendationSchema = z.object({
  productId: z
    .string()
    .uuid("Product ID must be a valid UUID")
    .describe("Unique identifier for the product"),
  name: z
    .string()
    .min(1, "Product name is required")
    .max(300)
    .describe("Product name"),
  brand: z
    .string()
    .min(1)
    .max(200)
    .describe("Brand name"),
  category: ProductCategoryEnum.optional().describe("Product category"),
  reason: z
    .string()
    .min(1)
    .max(1000)
    .describe("Why this product is recommended for the user"),
  matchScore: z
    .number()
    .min(0, "Match score must be at least 0")
    .max(100, "Match score must be at most 100")
    .describe(
      "How well this product matches the user's skin profile (0-100)"
    ),
  skinTargets: z
    .array(SkinConcernEnum)
    .min(1, "At least one skin target is required")
    .describe("Skin concerns this product addresses"),
  suitableFor: z
    .array(SkinTypeEnum)
    .optional()
    .describe("Skin types this product is suitable for"),
  imageUrl: z.string().url().optional().describe("Product image URL"),
  price: z
    .number()
    .min(0)
    .optional()
    .describe("Product price in the user's currency"),
  keyIngredients: z
    .array(z.string())
    .default([])
    .describe("Notable active ingredients"),
});

export type ProductRecommendation = z.infer<typeof ProductRecommendationSchema>;

// ============================================================
// ProductCompatibilityResult
// ============================================================

export const ProductCompatibilityResultSchema = z.object({
  compatible: z
    .boolean()
    .describe("Whether the product is compatible with the user's skin"),
  score: z
    .number()
    .min(0, "Compatibility score minimum is 0")
    .max(100, "Compatibility score maximum is 100")
    .describe("Numeric compatibility score from 0 to 100"),
  benefits: z
    .array(z.string().min(1))
    .describe("Benefits of using this product for the user's skin"),
  risks: z
    .array(z.string().min(1))
    .describe("Potential risks or downsides for the user's skin"),
  explanation: z
    .string()
    .min(1)
    .max(2000)
    .describe("Detailed explanation of the compatibility assessment"),
  alternativeIds: z
    .array(z.string().uuid())
    .default([])
    .describe("IDs of alternative products that may be a better fit"),
  skinType: SkinTypeEnum.optional().describe(
    "The skin type this assessment was made for"
  ),
});

export type ProductCompatibilityResult = z.infer<
  typeof ProductCompatibilityResultSchema
>;
