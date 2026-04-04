import { z } from 'zod';

export const recommendationItemSchema = z.object({
  product_id: z.string().optional(),
  product_name: z.string(),
  category: z.string(),
  reason: z.string(),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
  confidence: z.number().min(0).max(100).optional(),
  name: z.string().optional(),
  brand: z.string().optional(),
  price_range: z.string().optional(),
  match_score: z.number().optional(),
  why_it_works: z.string().optional(),
  key_ingredients: z.array(z.string()).optional(),
  when_to_use: z.string().optional(),
  concern_addressed: z.string().optional(),
});

export const recommendationsSchema = z.object({
  recommendations: z.array(recommendationItemSchema),
  routine_note: z.string(),
  warnings: z.array(z.string()).optional(),
});
