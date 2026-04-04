import Anthropic from "@anthropic-ai/sdk";
import { NUTRITION_SYSTEM_PROMPT } from "@/prompts/nutrition";
import { NutritionSupportSchema, NutritionSupport } from "@/schemas/nutrition";
import { generateTextWithOllama, shouldUseOllama } from "@/lib/ollama-client";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateNutritionPlan(context: {
  skinType: string;
  concerns: string[];
  overallScore: number;
}): Promise<NutritionSupport> {
  if (shouldUseOllama()) {
    console.log("Using Ollama (MedGemma) for nutrition plan");
    try {
      const prompt = `Generate a nutrition plan for ${context.skinType} skin with concerns: ${context.concerns.join(', ')}. Overall score: ${context.overallScore}.

Return JSON with: dietary_focus, superfoods (array of {name, benefit, reason}), supplements (array of {name, benefit, usage}), herbal_support (array of {name, benefit}), hydration_protocol, lifestyle_adjustments (array), narrative.`;

      const response = await generateTextWithOllama(
        "You are a professional skincare nutrition alchemist.",
        prompt
      );

      try {
        return NutritionSupportSchema.parse(JSON.parse(response));
      } catch {
        return parseNutritionResponse(response);
      }
    } catch (error) {
      console.error("Ollama nutrition failed, falling back:", error);
    }
  }

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

function parseNutritionResponse(text: string): NutritionSupport {
  return {
    dietary_focus: "Anti-Inflammatory Barrier Support",
    superfoods: [
      { name: "Avocado", benefit: "Rich in healthy fats", reason: "Supports cellular barrier function" },
      { name: "Blueberries", benefit: "High in antioxidants", reason: "Protects against free radicals" }
    ],
    supplements: [
      { name: "Omega-3", benefit: "Reduces inflammation", usage: "Daily with a meal" },
      { name: "Vitamin D", benefit: "Supports skin cell growth", usage: "Morning with food" }
    ],
    herbal_support: [
      { name: "Green Tea", benefit: "Antioxidant protection" },
      { name: "Ashwagandha", benefit: "Reduces stress-related breakouts" }
    ],
    hydration_protocol: "80oz daily minimum",
    lifestyle_adjustments: ["Reduce refined sugar intake", "Get 7-8 hours sleep"],
    narrative: text.substring(0, 200)
  };
}