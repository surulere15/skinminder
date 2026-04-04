import { z } from "zod";
import { SkinArchetypeSchema } from "./skin-metrics";

export const UserSkinProfileSchema = z.object({
  userId: z.string(),
  name: z.string(),
  archetype: SkinArchetypeSchema.optional(),
  goals: z.array(z.string()),
  lastScanDate: z.date().optional(),
  joinedAt: z.date(),
});

export const ProductUsageLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  productId: z.string(),
  productName: z.string(),
  usageDate: z.date(),
  timeOfDay: z.enum(["AM", "PM"]),
  complianceRating: z.number().min(0).max(1), // 0 to 1
});

export const ProtocolTrackerSchema = z.object({
  userId: z.string(),
  activeRoutineId: z.string(),
  startDate: z.date(),
  nextScanReminder: z.date(),
  logs: z.array(ProductUsageLogSchema),
});

export type UserSkinProfile = z.infer<typeof UserSkinProfileSchema>;
export type ProductUsageLog = z.infer<typeof ProductUsageLogSchema>;
export type ProtocolTracker = z.infer<typeof ProtocolTrackerSchema>;
