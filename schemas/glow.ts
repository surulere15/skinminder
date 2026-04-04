import { z } from "zod";

export const GlowSimulationSchema = z.object({
  projection_name: z.string(),
  timeframe: z.string().describe("e.g. 30 days, 90 days"),
  targeted_improvements: z.array(z.object({
    metric: z.string(),
    current_score: z.number(),
    projected_score: z.number(),
    visual_description: z.string()
  })),
  glow_archetype: z.string().describe("e.g. Glass Skin Ultra, Barrier Resilient"),
  simulated_narrative: z.string().describe("Vivid, emotional description of the projected results"),
  protocol_requirements: z.array(z.string()).describe("What is needed to achieve this simulation")
});

export type GlowSimulation = z.infer<typeof GlowSimulationSchema>;
