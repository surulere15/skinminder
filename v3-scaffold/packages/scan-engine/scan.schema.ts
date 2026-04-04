import { z } from "zod";

export const ScanMetricSchema = z.object({
  hydration: z.number().min(0).max(1),
  pigmentation: z.number().min(0).max(1),
  pih: z.number().min(0).max(1),
  acne: z.number().min(0).max(1),
  oiliness: z.number().min(0).max(1),
  sensitivity: z.number().min(0).max(1),
});

export const ScanResultSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  vendorId: z.string().uuid().optional(),
  metrics: ScanMetricSchema,
  status: z.enum(["processing", "completed", "failed"]),
  confidence_scores: z.record(z.string(), z.number()),
  created_at: z.string().datetime(),
});

export type ScanResult = z.infer<typeof ScanResultSchema>;
export type ScanMetrics = z.infer<typeof ScanMetricSchema>;
