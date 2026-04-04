import { z } from "zod";

// ============================================================
// Enums
// ============================================================

export const SkinTypeEnum = z.enum([
  "oily",
  "dry",
  "combination",
  "normal",
  "sensitive",
]);
export type SkinType = z.infer<typeof SkinTypeEnum>;

export const BodyAreaEnum = z.enum([
  "face",
  "forehead",
  "cheeks",
  "chin",
  "nose",
  "neck",
  "chest",
  "back",
  "arms",
  "hands",
  "legs",
  "full_body",
]);
export type BodyArea = z.infer<typeof BodyAreaEnum>;

export const DifficultyLevelEnum = z.enum([
  "beginner",
  "intermediate",
  "advanced",
]);
export type DifficultyLevel = z.infer<typeof DifficultyLevelEnum>;

export const SkinConcernEnum = z.enum([
  "acne",
  "aging",
  "dark_spots",
  "dryness",
  "dullness",
  "fine_lines",
  "hyperpigmentation",
  "irritation",
  "large_pores",
  "oiliness",
  "redness",
  "sagging",
  "scars",
  "sensitivity",
  "sun_damage",
  "texture",
  "uneven_tone",
  "wrinkles",
  "dark_circles",
  "dehydration",
]);
export type SkinConcern = z.infer<typeof SkinConcernEnum>;

export const ProductCategoryEnum = z.enum([
  "cleanser",
  "toner",
  "serum",
  "moisturizer",
  "sunscreen",
  "eye_cream",
  "face_mask",
  "exfoliant",
  "retinoid",
  "oil",
  "mist",
  "lip_care",
  "spot_treatment",
  "body_lotion",
  "supplement",
  "tool",
]);
export type ProductCategory = z.infer<typeof ProductCategoryEnum>;

export const ConfidenceLevelEnum = z.enum(["low", "moderate", "high"]);
export type ConfidenceLevel = z.infer<typeof ConfidenceLevelEnum>;

export const ConsentTypeEnum = z.enum([
  "terms_of_service",
  "privacy_policy",
  "data_processing",
  "marketing_emails",
  "image_storage",
  "ai_analysis",
  "data_sharing",
]);
export type ConsentType = z.infer<typeof ConsentTypeEnum>;

export const GenderEnum = z.enum([
  "male",
  "female",
  "non_binary",
  "prefer_not_to_say",
]);
export type Gender = z.infer<typeof GenderEnum>;

export const AgeRangeEnum = z.enum([
  "under_18",
  "18-24",
  "25-34",
  "35-44",
  "45-54",
  "55+",
]);
export type AgeRange = z.infer<typeof AgeRangeEnum>;

export const TendencyLevelEnum = z.enum(["low", "moderate", "high"]);
export type TendencyLevel = z.infer<typeof TendencyLevelEnum>;

export const TrendDirectionEnum = z.enum(["improving", "stable", "declining"]);
export type TrendDirection = z.infer<typeof TrendDirectionEnum>;

export const SkinArchetypeSchema = z.enum([
  "PIH-Prone Reactivator",
  "Sebum-Dynamic Matrix",
  "Moisture-Steady Architect",
  "Sensitive Barrier Guardian",
  "Photo-Age Resister",
]);
export type SkinArchetype = z.infer<typeof SkinArchetypeSchema>;

// ============================================================
// Normalized score: a number between 0 and 1 inclusive
// ============================================================

export const NormalizedScore = z
  .number()
  .min(0, "Score must be at least 0")
  .max(1, "Score must be at most 1");

// ============================================================
// SkinMetricScores
// ============================================================

export const SkinMetricScoresSchema = z.object({
  hydration: NormalizedScore.describe(
    "Skin hydration level where 0 = severely dehydrated, 1 = optimally hydrated"
  ),
  pigmentation: NormalizedScore.describe(
    "Pigmentation uniformity where 0 = very uneven, 1 = perfectly even"
  ),
  texture: NormalizedScore.describe(
    "Skin texture smoothness where 0 = very rough, 1 = perfectly smooth"
  ),
  oilBalance: NormalizedScore.describe(
    "Oil balance where 0 = severely imbalanced, 1 = perfectly balanced"
  ),
  irritation: NormalizedScore.describe(
    "Irritation probability where 0 = no irritation, 1 = severe irritation"
  ),
  elasticity: NormalizedScore.describe(
    "Skin elasticity where 0 = very low elasticity, 1 = excellent elasticity"
  ),
  acneTendency: NormalizedScore.describe(
    "Acne tendency where 0 = no acne tendency, 1 = very acne-prone"
  ),
  previousHydration: NormalizedScore.optional(),
  previousPigmentation: NormalizedScore.optional(),
  previousTexture: NormalizedScore.optional(),
  previousOilBalance: NormalizedScore.optional(),
  improvementRates: z.object({
    hydration: z.number().optional(),
    pigmentation: z.number().optional(),
    texture: z.number().optional(),
    oilBalance: z.number().optional(),
  }).optional(),
});

export type SkinMetricScores = z.infer<typeof SkinMetricScoresSchema>;

// ============================================================
// SkinAgeEstimate
// ============================================================

export const SkinAgeEstimateSchema = z.object({
  estimatedAge: z
    .number()
    .int()
    .min(10, "Estimated age must be at least 10")
    .max(120, "Estimated age must be at most 120")
    .describe("The AI-estimated biological skin age"),
  confidence: ConfidenceLevelEnum.describe(
    "How confident the model is in the age estimate"
  ),
  factors: z
    .array(z.string().min(1))
    .min(1, "At least one contributing factor is required")
    .describe(
      "Factors contributing to the skin age estimate (e.g. 'sun damage', 'good hydration')"
    ),
});

export type SkinAgeEstimate = z.infer<typeof SkinAgeEstimateSchema>;

// ============================================================
// OverallSkinAssessment
// ============================================================

export const OverallSkinAssessmentSchema = z.object({
  skinScore: z
    .number()
    .int()
    .min(0, "Skin score must be at least 0")
    .max(100, "Skin score must be at most 100")
    .describe("Overall skin health score from 0 to 100"),
  metrics: SkinMetricScoresSchema,
  ageEstimate: SkinAgeEstimateSchema,
  skinType: SkinTypeEnum,
  primaryConcerns: z
    .array(SkinConcernEnum)
    .describe("Primary skin concerns identified"),
  strengths: z
    .array(z.string().min(1))
    .describe("Areas where skin health is strong"),
  observations: z
    .array(z.string().min(1))
    .describe("Detailed observations from the analysis"),
  assessedAt: z
    .string()
    .datetime()
    .describe("ISO 8601 timestamp of the assessment"),
});

export type OverallSkinAssessment = z.infer<typeof OverallSkinAssessmentSchema>;
