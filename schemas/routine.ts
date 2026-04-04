import { z } from "zod";
import {
  DifficultyLevelEnum,
  SkinConcernEnum,
  ProductCategoryEnum,
} from "./skin-metrics";

// ============================================================
// RoutineStep
// ============================================================

export const RoutineStepSchema = z.object({
  step: z
    .number()
    .int()
    .min(1)
    .describe("Step order number within the routine"),
  productType: ProductCategoryEnum.describe(
    "Category of product used in this step"
  ),
  action: z
    .string()
    .min(1, "Action description is required")
    .max(500)
    .describe("Description of what to do (e.g. 'Apply a pea-sized amount to damp skin')"),
  durationMinutes: z
    .number()
    .min(0)
    .max(60)
    .describe("How long this step takes in minutes (0 for instant application)"),
  notes: z
    .string()
    .max(1000)
    .optional()
    .describe("Additional tips or warnings for this step"),
  productName: z
    .string()
    .optional()
    .describe("Specific product name recommendation, if any"),
  isOptional: z
    .boolean()
    .default(false)
    .describe("Whether this step can be skipped"),
  frequency: z
    .enum(["daily", "every_other_day", "twice_weekly", "weekly", "as_needed"])
    .default("daily")
    .describe("How often this step should be performed"),
});

export type RoutineStep = z.infer<typeof RoutineStepSchema>;

// ============================================================
// RoutinePlan -- a complete skincare routine
// ============================================================

export const RoutinePlanSchema = z.object({
  morning: z
    .array(RoutineStepSchema)
    .min(1, "Morning routine must have at least one step")
    .describe("Steps for the morning skincare routine"),
  night: z
    .array(RoutineStepSchema)
    .min(1, "Night routine must have at least one step")
    .describe("Steps for the nighttime skincare routine"),
  weekly: z
    .array(RoutineStepSchema)
    .default([])
    .describe("Optional weekly treatment steps (masks, exfoliants, etc.)"),
  difficultyLevel: DifficultyLevelEnum.describe(
    "How complex the routine is for the user"
  ),
  concernFocus: z
    .array(SkinConcernEnum)
    .min(1, "At least one concern must be targeted")
    .describe("Skin concerns this routine is designed to address"),
  estimatedTotalMinutesMorning: z
    .number()
    .min(0)
    .optional()
    .describe("Total estimated time for the morning routine in minutes"),
  estimatedTotalMinutesNight: z
    .number()
    .min(0)
    .optional()
    .describe("Total estimated time for the night routine in minutes"),
  summary: z
    .string()
    .max(2000)
    .optional()
    .describe("Brief narrative summary of the routine and its goals"),
  disclaimer: z
    .string()
    .default(
      "This routine is AI-generated and for informational purposes only. Consult a dermatologist for persistent skin issues."
    ),
});

export type RoutinePlan = z.infer<typeof RoutinePlanSchema>;
