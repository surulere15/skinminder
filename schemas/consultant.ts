import { z } from "zod";
import { ConfidenceLevelEnum, SkinConcernEnum } from "./skin-metrics";

// ============================================================
// ChatMessage
// ============================================================

export const ChatMessageSchema = z.object({
  id: z
    .string()
    .uuid("Message ID must be a valid UUID")
    .describe("Unique identifier for the message"),
  role: z
    .enum(["user", "assistant", "system"])
    .describe("Who sent the message"),
  content: z
    .string()
    .min(1, "Message content cannot be empty")
    .max(10000, "Message content is too long")
    .describe("The text content of the message"),
  context: z
    .record(z.unknown())
    .optional()
    .describe(
      "Optional structured context (e.g. current scan data, routine, user profile snapshot)"
    ),
  createdAt: z
    .string()
    .datetime()
    .describe("ISO 8601 timestamp when the message was created"),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// ============================================================
// BeautyConsultantResponse -- AI consultant reply
// ============================================================

export const BeautyConsultantResponseSchema = z.object({
  message: z
    .string()
    .min(1, "Response message cannot be empty")
    .max(5000)
    .describe("The consultant's text response to the user"),
  suggestedActions: z
    .array(z.string().min(1).max(300))
    .describe(
      "Actionable next steps the user can take (e.g. 'Upload a new scan', 'Try a hydrating serum')"
    ),
  relatedConcerns: z
    .array(SkinConcernEnum)
    .describe("Skin concerns relevant to this conversation turn"),
  confidence: ConfidenceLevelEnum.describe(
    "How confident the consultant is in this response"
  ),
  followUpQuestions: z
    .array(z.string().min(1).max(300))
    .default([])
    .describe("Suggested follow-up questions the user might want to ask"),
  referencedScanId: z
    .string()
    .uuid()
    .optional()
    .describe("Scan ID referenced in this response, if any"),
  referencedProductIds: z
    .array(z.string().uuid())
    .default([])
    .describe("Product IDs referenced in this response"),
  disclaimer: z
    .string()
    .default(
      "This is AI-generated skincare advice and is not a substitute for professional dermatological consultation."
    ),
});

export type BeautyConsultantResponse = z.infer<
  typeof BeautyConsultantResponseSchema
>;

// ============================================================
// ConsultantConversation -- full conversation context
// ============================================================

export const ConsultantConversationSchema = z.object({
  userId: z.string().uuid(),
  messages: z.array(ChatMessageSchema),
  activeConcerns: z
    .array(SkinConcernEnum)
    .default([])
    .describe("Currently discussed concerns in this conversation"),
  lastScanId: z
    .string()
    .uuid()
    .optional()
    .describe("Most recent scan ID for context"),
  startedAt: z.string().datetime(),
  lastMessageAt: z.string().datetime(),
});

export type ConsultantConversation = z.infer<
  typeof ConsultantConversationSchema
>;
