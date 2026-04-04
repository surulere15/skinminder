import Anthropic from '@anthropic-ai/sdk';
import { SKIN_INTELLIGENCE_SYSTEM_PROMPT } from '@/prompts/skin-intelligence';
import { skinIntelligenceSchema } from '@/schemas/intelligence';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function deepSkinIntelligence(
  visionData: any, 
  userProfile: any, 
  concerns: string[],
  qualityData?: any
) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("ANTHROPIC_API_KEY not found. Returning mock intelligence data.");
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      skinScore: 78,
      estimatedSkinAge: 27,
      primaryConcerns: ["boosting hydration", "evening out skin tone", "enhancing elasticity"],
      summary: "Your skin shows strong resilience. With a hydration score of 62 and pigmentation at 48, your baseline is healthy but could benefit from targeted moisture retention strategies."
    };
  }

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1536,
    system: SKIN_INTELLIGENCE_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: JSON.stringify({
          visionData,
          userProfile,
          userConcerns: concerns,
          structuredReasoning: qualityData // Contains .quality and .interpretation
        }),
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Anthropic');
  }

  try {
    const rawJson = JSON.parse(content.text);
    return skinIntelligenceSchema.parse(rawJson);
  } catch (error) {
    console.error('Failed to parse skin intelligence JSON:', error);
    throw new Error('Intelligence analysis failed to return valid data');
  }
}
