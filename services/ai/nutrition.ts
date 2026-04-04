import Anthropic from "@anthropic-ai/sdk";
import { NUTRITION_SYSTEM_PROMPT } from "@/prompts/nutrition";
import { NutritionSupportSchema, NutritionSupport } from "@/schemas/nutrition";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateNutritionPlan(context: {
  skinType: string;
  concerns: string[];
  overallScore: number;
}): Promise<NutritionSupport> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("ANTHROPIC_API_KEY not found. Returning mock nutrition data.");
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      dietary_focus: "Anti-Inflammatory Barrier Support",
      superfoods: [
        { name: "Avocado", benefit: "Rich in healthy fats", reason: "Supports cellular barrier function" }
      ],
      supplements: [
        { name: "Omega-3", benefit: "Reduces inflammation", usage: "Daily with a meal" }
      ],
      herbal_support: [
        { name: "Green Tea", benefit: "Antioxidant protection" }
      ],
      hydration_protocol: "80oz daily minimum",
      lifestyle_adjustments: ["Reduce refined sugar intake"],
      narrative: "This is a simulated nutrition plan to support skin wellness from the inside out."
    };
  }

  const prompt = NUTRITION_SYSTEM_PROMPT
    .replace("{{skinType}}", context.skinType)
    .replace("{{concerns}}", context.concerns.join(", "))
    .replace("{{overallScore}}", context.overallScore.toString());

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1500,
    messages: [
      { role: "user", content: prompt }
    ],
    system: "You are a professional skincare nutrition alchemist. Return only valid JSON.",
  });

  const content = response.content[0].type === 'text' ? response.content[0].text : '';
  return NutritionSupportSchema.parse(JSON.parse(content));
}
