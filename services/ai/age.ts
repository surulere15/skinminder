import Anthropic from '@anthropic-ai/sdk';
import { SKIN_AGE_SYSTEM_PROMPT, buildSkinAgeUserPrompt } from '@/prompts/skin-age';
import { skinAgeSchema } from '@/schemas/age';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function estimateSkinAge(metrics: any, userAge?: number) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("ANTHROPIC_API_KEY not found. Returning mock skin age data.");
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      estimatedAge: userAge ? Math.max(18, userAge - 2) : 25,
      confidence: "high" as const,
      contributingFactors: [
        "Excellent hydration is giving your skin a youthful, dewy quality",
        "Smooth texture suggests a great skincare foundation",
        "Good elasticity indicates your skin has wonderful resilience"
      ],
      personalizedInsight: "Your apparent skin vitality age suggests your skin is thriving! The hydration and elasticity scores are particularly impressive — keep up whatever you're doing. A little extra attention to sun protection could help maintain this beautiful vitality for years."
    };
  }

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1024,
    system: SKIN_AGE_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildSkinAgeUserPrompt(metrics, userAge),
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Anthropic');
  }

  try {
    const rawJson = JSON.parse(content.text);
    return skinAgeSchema.parse(rawJson);
  } catch (error) {
    console.error('Failed to parse skin age JSON:', error);
    throw new Error('Skin age estimator failed to return valid data');
  }
}
