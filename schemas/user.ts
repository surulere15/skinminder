import { z } from "zod";
import {
  SkinTypeEnum,
  SkinConcernEnum,
  GenderEnum,
  AgeRangeEnum,
  ConsentTypeEnum,
} from "./skin-metrics";

// ============================================================
// Skin DNA
// ============================================================

export const skinDnaSchema = z.object({
  skinType: SkinTypeEnum.describe("Core skin type determined by historical data"),
  sensitivityLevel: z.enum(["low", "moderate", "high", "severe"]).describe("Inherent skin sensitivity level"),
  hydrationBaseline: z.enum(["dry", "normal", "oily", "combination"]).describe("Natural hydration tendency"),
  pigmentationTendency: z.enum(["low", "mild", "moderate", "high"]).describe("Propensity for hyperpigmentation"),
  resilienceScore: z.number().min(0).max(100).describe("Overall skin barrier resilience score"),
  keyVulnerabilities: z.array(z.string()).describe("Long-term weaknesses (e.g., 'TEWL', 'Sun Damage')"),
  coreStrengths: z.array(z.string()).describe("Long-term strengths (e.g., 'Elasticity', 'Sebum Balance')"),
  summary: z.string().describe("A concise summary of the user's permanent Skin DNA profile")
});

export type SkinDnaProfile = z.infer<typeof skinDnaSchema>;

// ============================================================
// UserPreferences
// ============================================================

export const UserPreferencesSchema = z.object({
  beautyGoals: z
    .array(z.string().min(1).max(200))
    .min(1, "At least one beauty goal is required")
    .describe(
      "User's beauty goals (e.g. 'clear skin', 'anti-aging', 'even skin tone')"
    ),
  skinConcerns: z
    .array(SkinConcernEnum)
    .describe("User's self-reported skin concerns"),
  preferredBrands: z
    .array(z.string().min(1).max(200))
    .default([])
    .describe("Brands the user prefers or trusts"),
  avoidIngredients: z
    .array(z.string().min(1).max(200))
    .default([])
    .describe("Ingredients the user wants to avoid (allergies, preferences)"),
  budgetRange: z
    .enum(["budget", "mid_range", "premium", "luxury"])
    .optional()
    .describe("User's budget preference for product recommendations"),
  preferNatural: z
    .boolean()
    .default(false)
    .describe("Whether the user prefers natural/organic products"),
  fraganceFree: z
    .boolean()
    .default(false)
    .describe("Whether the user prefers fragrance-free products"),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

// ============================================================
// OnboardingData -- collected during initial onboarding flow
// ============================================================

export const OnboardingDataSchema = z.object({
  skinType: SkinTypeEnum.describe("Self-reported skin type"),
  ageRange: AgeRangeEnum.describe("User's age range"),
  gender: GenderEnum.describe("User's gender identity"),
  skinConcerns: z
    .array(SkinConcernEnum)
    .min(1, "At least one skin concern must be selected")
    .describe("Skin concerns identified during onboarding"),
  beautyGoals: z
    .array(z.string().min(1).max(200))
    .min(1, "At least one beauty goal is required")
    .describe("Goals the user wants to achieve"),
  location: z
    .object({
      city: z.string().max(200).optional(),
      country: z.string().max(200).optional(),
      latitude: z.number().min(-90).max(90).optional(),
      longitude: z.number().min(-180).max(180).optional(),
    })
    .optional()
    .describe("User's location for climate-aware recommendations"),
  allergies: z
    .array(z.string().min(1).max(200))
    .default([])
    .describe("Known ingredient allergies"),
  currentProducts: z
    .array(z.string().min(1).max(200))
    .default([])
    .describe("Products the user currently uses"),
  referralCode: z
    .string()
    .max(20)
    .optional()
    .describe("Referral code used during signup, if any"),
});

export type OnboardingData = z.infer<typeof OnboardingDataSchema>;

// ============================================================
// ConsentRecord
// ============================================================

export const ConsentRecordSchema = z.object({
  userId: z.string().uuid("User ID must be a valid UUID"),
  consentType: ConsentTypeEnum.describe("What the user consented to"),
  granted: z.boolean().describe("Whether consent was granted or revoked"),
  version: z
    .string()
    .min(1)
    .max(50)
    .describe("Version of the consent document (e.g. 'v1.2')"),
  ipAddress: z
    .string()
    .max(45)
    .optional()
    .describe("IP address at time of consent"),
  userAgent: z
    .string()
    .max(500)
    .optional()
    .describe("Browser user agent at time of consent"),
  grantedAt: z
    .string()
    .datetime()
    .describe("ISO 8601 timestamp of when consent was recorded"),
  expiresAt: z
    .string()
    .datetime()
    .optional()
    .describe("ISO 8601 timestamp of when consent expires, if applicable"),
});

export type ConsentRecord = z.infer<typeof ConsentRecordSchema>;

// ============================================================
// UserProfile
// ============================================================

export const UserProfileSchema = z.object({
  id: z.string().uuid("User ID must be a valid UUID"),
  email: z.string().email("Valid email address is required").optional(),
  displayName: z.string().max(200).optional().describe("Public display name"),
  avatarUrl: z.string().url().optional().describe("Profile avatar image URL"),

  // Core skin data
  skinType: SkinTypeEnum.optional().describe("User's skin type"),
  age: z
    .number()
    .int()
    .min(13, "Minimum age is 13")
    .max(120)
    .optional()
    .describe("User's age"),
  gender: GenderEnum.optional(),
  ageRange: AgeRangeEnum.optional(),

  // Preferences
  preferences: UserPreferencesSchema.optional(),

  // Skin DNA
  skin_dna: skinDnaSchema.optional(),

  // Location (for climate features)
  city: z.string().max(200).optional(),
  country: z.string().max(200).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),

  // Referral
  referralCode: z
    .string()
    .max(20)
    .optional()
    .describe("This user's unique referral code"),
  referredBy: z
    .string()
    .uuid()
    .optional()
    .describe("User ID of who referred this user"),
  referralCount: z
    .number()
    .int()
    .min(0)
    .default(0)
    .describe("Total referrals made by this user"),

  // Metadata
  onboardingCompleted: z
    .boolean()
    .default(false)
    .describe("Whether the user has completed onboarding"),
  createdAt: z.string().datetime().describe("Account creation timestamp"),
  updatedAt: z.string().datetime().describe("Last profile update timestamp"),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
