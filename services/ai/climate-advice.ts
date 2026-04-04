import Anthropic from '@anthropic-ai/sdk';
import { climateAdviceSchema } from '@/prompts/skin-intelligence';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "", 
});

export async function generateClimateAdvice(weatherData: any, skinDna: any) {
  if (!process.env.ANTHROPIC_API_KEY) {
    // Fallback Mock for local development without API keys
    return {
      condition: "Humid Heat",
      adviceText: `Because of your ${skinDna.skinType || 'Combination'} archetype, today's 85% humidity might increase your oil production slightly.`,
      warningLevel: "low",
      routineAdjustments: [
        "Consider skipping heavier cream today",
        "A gel-based moisturizer might feel better"
      ]
    };
  }

  const schemaShape = `{
    condition: string,
    adviceText: string,
    warningLevel: "none" | "low" | "medium" | "high",
    routineAdjustments: string[]
  }`;

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1024,
    system: `You are an expert dermatological AI. You are given the current weather in the user's location and their permanent biological 'Skin DNA'. Provide highly actionable, concise advice on how the weather will interact with their specific skin biology today. Return ONLY raw JSON matching this schema: ${schemaShape}`,
    messages: [
      {
        role: "user",
        content: `
        Skin DNA: ${JSON.stringify(skinDna)}
        Current Weather: ${JSON.stringify(weatherData)}
        
        Generate concise, empathetic climate skincare advice. Return strictly valid JSON.`
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Anthropic');
  }

  try {
    const rawJson = JSON.parse(content.text);
    return climateAdviceSchema.parse(rawJson);
  } catch (error) {
    console.error('Failed to parse climate advice JSON:', error);
    throw new Error('Climate analysis failed to return valid JSON');
  }
}
