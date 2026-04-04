import { z } from "zod";
import {
  BodyAreaEnum,
  SkinTypeEnum,
  SkinConcernEnum,
  ConfidenceLevelEnum,
  SkinMetricScoresSchema,
  NormalizedScore,
} from "./skin-metrics";

export const visionAnalysisSchema = z.object({
  hydration: NormalizedScore,
  pigmentation: NormalizedScore,
  texture: NormalizedScore,
  oilBalance: NormalizedScore,
  irritation: NormalizedScore,
  acneCount: z.number().int().min(0).optional(),
  analysisNotes: z.string(),
  confidenceScores: z.object({
    hydration: NormalizedScore,
    pigmentation: NormalizedScore,
    texture: NormalizedScore,
    oilBalance: NormalizedScore,
    irritation: NormalizedScore,
  }).optional(),
});

export type VisionAnalysis = z.infer<typeof visionAnalysisSchema>;

// ============================================================
// SkinScanInput -- what the client sends to initiate a scan
// ============================================================


export const SkinScanInputSchema = z.object({
  imageUrl: z
    .string()
    .url("A valid image URL is required")
    .describe("Cloudinary or storage URL of the uploaded skin image"),
  imageBase64: z
    .string()
    .optional()
    .describe("Optional base64-encoded image data for direct upload"),
  bodyArea: BodyAreaEnum.describe("The body area shown in the image"),
  userId: z.string().uuid("Valid user ID is required"),
  skinType: SkinTypeEnum.optional().describe(
    "Self-reported skin type, if known"
  ),
  concerns: z
    .array(SkinConcernEnum)
    .optional()
    .describe("User-reported concerns to focus on"),
  metadata: z
    .object({
      deviceType: z.string().optional(),
      lightingCondition: z
        .enum(["natural", "artificial", "mixed", "low_light"])
        .optional(),
      cameraFacing: z.enum(["front", "back"]).optional(),
    })
    .optional()
    .describe("Optional metadata about capture conditions"),
});

export type SkinScanInput = z.infer<typeof SkinScanInputSchema>;

// ============================================================
// SkinScanResult -- the full result returned after AI analysis
// ============================================================

export const SkinScanResultSchema = z.object({
  scanId: z.string().uuid("Scan ID must be a valid UUID"),
  userId: z.string().uuid("User ID must be a valid UUID"),
  imageUrl: z.string().url(),
  bodyArea: BodyAreaEnum,

  // Individual metric scores (all 0-1)
  hydrationScore: NormalizedScore,
  pigmentationScore: NormalizedScore,
  textureScore: NormalizedScore,
  oilBalance: NormalizedScore,
  irritationProbability: NormalizedScore,
  elasticityScore: NormalizedScore,
  acneTendency: NormalizedScore,

  // Composite metrics object
  metrics: SkinMetricScoresSchema,

  // Overall score 0-100
  skinScore: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe("Overall skin health score from 0 (worst) to 100 (best)"),

  // Estimated skin age
  estimatedSkinAge: z
    .number()
    .int()
    .min(10)
    .max(120)
    .describe("AI-estimated biological skin age"),

  // Textual results
  primaryConcerns: z
    .array(z.string().min(1))
    .describe("Top skin concerns identified by the AI analysis"),
  observations: z
    .array(z.string().min(1))
    .describe("Detailed text observations about skin condition"),

  // Confidence & metadata
  confidence: ConfidenceLevelEnum.describe(
    "Overall confidence level of the analysis"
  ),
  skinType: SkinTypeEnum.optional().describe("Detected skin type if determinable"),
  
  // Data Quality & Reliability
  quality: z.object({
    lightingScore: z.number().min(0).max(1),
    sharpnessScore: z.number().min(0).max(1),
    isNormalized: z.boolean().default(false),
  }).optional(),
  
  metadata: z.object({
    deviceInfo: z.record(z.unknown()).optional(),
    resolution: z.string().optional(),
  }).optional(),

  analysisRaw: z
    .record(z.unknown())
    .optional()
    .describe("Raw AI model output stored for debugging / audit"),

  createdAt: z.string().datetime().describe("ISO 8601 scan timestamp"),
});

export type SkinScanResult = z.infer<typeof SkinScanResultSchema>;
