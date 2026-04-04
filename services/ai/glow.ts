import Anthropic from "@anthropic-ai/sdk";
import { GlowSimulationSchema, GlowSimulation } from "@/schemas/glow";
import { generateTextWithOllama, shouldUseOllama } from "@/lib/ollama-client";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateGlowSimulation(context: {
  currentMetrics: any;
  skinType: string;
  concerns: string[];
}): Promise<GlowSimulation> {
  if (shouldUseOllama()) {
    console.log("Using Ollama (MedGemma) for glow simulation");
    try {
      const prompt = `Generate a glow simulation for ${context.skinType} skin with concerns: ${context.concerns.join(', ')}.
Current: Hydration ${context.currentMetrics.hydration}/100, Texture ${context.currentMetrics.texture}/100.

Return JSON with: projection_name, timeframe, targeted_improvements (array of {metric, current_score, projected_score, visual_description}), glow_archetype, simulated_narrative, protocol_requirements (array). Include disclaimer that results depend on adherence.`;

      const response = await generateTextWithOllama(
        "You are the SkinMinder Future Projection Architect.",
        prompt
      );

      try {
        return GlowSimulationSchema.parse(JSON.parse(response));
      } catch {
        return parseGlowResponse(response);
      }
    } catch (error) {
      console.error("Ollama glow failed, falling back:", error);
    }
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("ANTHROPIC_API_KEY not found. Returning mock glow data.");
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      projection_name: "Radiant Resilience",
      timeframe: "30 days",
      targeted_improvements: [
        { metric: "Hydration", current_score: 68, projected_score: 85, visual_description: "Dewy, plump reflection" },
        { metric: "Texture", current_score: 55, projected_score: 75, visual_description: "Smooth, even surface" }
      ],
      glow_archetype: "Glass Skin Ultra",
      simulated_narrative: "In just 30 days, diligent hydration will likely boost skin barrier function significantly, smoothing texture and calming redness.",
      protocol_requirements: ["Strict SPF adherence", "Consistent double cleansing"]
    };
  }

  const prompt = `
You are the SkinMinder Future Projection Architect.
Generate a responsible, optimistic "Glow Simulation" for a user based on their current skin profile.

Current Profile:
Skin Type: ${context.skinType}
Concerns: ${context.concerns.join(", ")}
Hydration: ${context.currentMetrics.hydration}/100
Texture: ${context.currentMetrics.texture}/100

RULES:
- Provide a clear disclaimer: "SIMULATION ONLY: Result depends on adherence and individual biology."
- Describe 3 specific metric improvements (e.g. Texture 65 -> 88).
- Create a vivid, emotional narrative of how the skin will look and feel (e.g. "Luminous clarity, velvet-smooth density").
- Define a "Glow Archetype" for this state.
- List protocol requirements (e.g. strict SPF adherence, double cleansing).

Return only valid JSON matching the schema.
`;

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1500,
    messages: [
      { role: "user", content: prompt }
    ],
    system: "You are a professional glow architect. Return valid JSON.",
  });

  const content = response.content[0].type === 'text' ? response.content[0].text : '';
  return GlowSimulationSchema.parse(JSON.parse(content));
}

function parseGlowResponse(text: string): GlowSimulation {
  return {
    projection_name: "Radiant Resilience",
    timeframe: "30 days",
    targeted_improvements: [
      { metric: "Hydration", current_score: 68, projected_score: 85, visual_description: "Dewy, plump reflection" },
      { metric: "Texture", current_score: 55, projected_score: 75, visual_description: "Smooth, even surface" },
      { metric: "Radiance", current_score: 60, projected_score: 80, visual_description: "Inner glow, luminous finish" }
    ],
    glow_archetype: "Glass Skin Ultra",
    simulated_narrative: text.substring(0, 200),
    protocol_requirements: ["Strict SPF adherence", "Consistent routine"]
  };
}