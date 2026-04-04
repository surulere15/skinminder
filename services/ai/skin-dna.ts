import Anthropic from '@anthropic-ai/sdk';
import { skinDnaSchema } from '@/schemas/user';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "", // Provide fallback to prevent instantiation errors
});

export async function generateSkinDnaProfile(scanHistory: any[], userProfile: any) {
  if (!process.env.ANTHROPIC_API_KEY) {
    // Graceful fallback for demo purposes if API key isn't provided locally
    return {
      skinType: "combination",
      sensitivityLevel: "moderate",
      hydrationBaseline: "normal",
      pigmentationTendency: "mild",
      resilienceScore: 85,
      keyVulnerabilities: ["Environmental stress", "Occasional dehydration"],
      coreStrengths: ["Strong barrier recovery", "Even skin tone baseline"],
      summary: "Your Skin DNA shows a balanced combination profile with moderate resilience. You have a solid natural hydration baseline but are occasionally susceptible to environmental stressors."
    };
  }

  const schemaShape = `{
    "skinType": "dry | normal | oily | combination",
    "sensitivityLevel": "low | moderate | high | severe",
    "hydrationBaseline": "dry | normal | oily | combination",
    "pigmentationTendency": "low | mild | moderate | high",
    "resilienceScore": number (0-100),
    "keyVulnerabilities": string[],
    "coreStrengths": string[],
    "summary": string
  }`;

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1536,
    system: "You are an expert skin geneticist and intelligence analyzer. You synthesize multiple skin scans into a single 'Skin DNA' profile. Return ONLY raw JSON matching the provided schema exactly.",
    messages: [
      {
        role: "user",
        content: `Generate a Skin DNA profile based on this historical data. Return ONLY valid JSON matching this exact structure: ${schemaShape}\n\nUser Data: ${JSON.stringify({ scanHistory, userProfile })}`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Anthropic');
  }

  try {
    const rawJson = JSON.parse(content.text);
    return skinDnaSchema.parse(rawJson);
  } catch (error) {
    console.error('Failed to parse skin DNA JSON:', error);
    throw new Error('Skin DNA profiling failed to return valid data');
  }
}
