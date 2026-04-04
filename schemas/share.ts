import { z } from "zod";
import { SkinConcernEnum } from "./skin-metrics";

// ============================================================
// ShareCardSummary -- data for generating a shareable card
// ============================================================

export const ShareCardSummarySchema = z.object({
  scanId: z
    .string()
    .uuid("Scan ID must be a valid UUID")
    .describe("The scan this share card is based on"),
  skinScore: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe("Overall skin score displayed on the card"),
  skinAge: z
    .number()
    .int()
    .min(10)
    .max(120)
    .describe("Estimated skin age displayed on the card"),
  topStrengths: z
    .array(z.string().min(1).max(200))
    .min(1, "At least one strength must be highlighted")
    .max(5)
    .describe("Top skin strengths to feature on the card"),
  topConcerns: z
    .array(z.string().min(1).max(200))
    .max(5)
    .describe("Top skin concerns to feature on the card"),
  glowPotential: z
    .number()
    .int()
    .min(0)
    .max(100)
    .optional()
    .describe("Projected glow potential score if available"),
  archetype: z
    .string()
    .max(200)
    .optional()
    .describe("Skin archetype name (e.g. 'The Resilient Glow')"),
  archetypeEmoji: z
    .string()
    .max(10)
    .optional()
    .describe("Emoji representing the archetype"),
});

export type ShareCardSummary = z.infer<typeof ShareCardSummarySchema>;

// ============================================================
// ReportCard -- generated share card with URLs
// ============================================================

export const ReportCardSchema = z.object({
  imageUrl: z
    .string()
    .url("Card image URL must be valid")
    .describe("URL of the generated card image (Cloudinary or CDN)"),
  shareUrl: z
    .string()
    .url("Share URL must be valid")
    .describe("Public URL for viewing the shared card"),
  shareCode: z
    .string()
    .min(4)
    .max(20)
    .describe("Short unique code for the share link"),
  cardType: z
    .enum(["report", "before_after", "glow_projection"])
    .default("report")
    .describe("Type of share card"),
  viewCount: z
    .number()
    .int()
    .min(0)
    .default(0)
    .describe("Number of times this card has been viewed"),
  createdAt: z
    .string()
    .datetime()
    .describe("ISO 8601 timestamp of card creation"),
});

export type ReportCard = z.infer<typeof ReportCardSchema>;

// ============================================================
// BeforeAfterCard
// ============================================================

export const BeforeAfterCardSchema = z.object({
  beforeScanId: z
    .string()
    .uuid()
    .describe("Scan ID for the 'before' state"),
  afterScanId: z
    .string()
    .uuid()
    .describe("Scan ID for the 'after' state"),
  beforeScore: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe("Skin score at the 'before' time"),
  afterScore: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe("Skin score at the 'after' time"),
  improvementPercent: z
    .number()
    .min(-100)
    .max(1000)
    .describe("Percentage improvement between before and after"),
  daysBetween: z
    .number()
    .int()
    .min(1)
    .describe("Number of days between the two scans"),
  improvementAreas: z
    .array(SkinConcernEnum)
    .describe("Areas where improvement was observed"),
  beforeImageUrl: z.string().url().optional().describe("Before scan image URL"),
  afterImageUrl: z.string().url().optional().describe("After scan image URL"),
  cardImageUrl: z
    .string()
    .url()
    .optional()
    .describe("Composite before/after card image URL"),
  shareCode: z
    .string()
    .min(4)
    .max(20)
    .optional()
    .describe("Share code for this before/after card"),
  narrative: z
    .string()
    .max(1000)
    .optional()
    .describe("AI-generated narrative about the journey"),
});

export type BeforeAfterCard = z.infer<typeof BeforeAfterCardSchema>;

// ============================================================
// ReferralReward
// ============================================================

export const ReferralRewardSchema = z.object({
  rewardId: z.string().uuid(),
  name: z.string().min(1).max(200).describe("Reward name"),
  description: z.string().max(500).describe("What the reward entails"),
  requiredReferrals: z
    .number()
    .int()
    .min(1)
    .describe("Number of referrals needed to unlock this reward"),
  rewardType: z
    .enum(["badge", "feature_unlock", "discount", "premium_access", "cosmetic"])
    .describe("Type of reward"),
  unlockedAt: z
    .string()
    .datetime()
    .optional()
    .describe("When the user unlocked this reward"),
});

export type ReferralReward = z.infer<typeof ReferralRewardSchema>;

// ============================================================
// ReferralInfo
// ============================================================

export const ReferralInfoSchema = z.object({
  referralCode: z
    .string()
    .min(4)
    .max(20)
    .describe("The user's unique referral code"),
  referralUrl: z
    .string()
    .url()
    .describe("Full URL containing the referral code"),
  totalReferrals: z
    .number()
    .int()
    .min(0)
    .describe("Total number of successful referrals"),
  rewardsUnlocked: z
    .array(z.string().min(1))
    .describe("Names of rewards already unlocked"),
  rewards: z
    .array(ReferralRewardSchema)
    .describe("All available and unlocked rewards"),
  nextRewardAt: z
    .number()
    .int()
    .optional()
    .describe("Number of referrals needed for the next reward"),
  referredUsers: z
    .array(
      z.object({
        userId: z.string().uuid(),
        joinedAt: z.string().datetime(),
        displayName: z.string().optional(),
      })
    )
    .default([])
    .describe("Users who joined via this referral code"),
});

export type ReferralInfo = z.infer<typeof ReferralInfoSchema>;
