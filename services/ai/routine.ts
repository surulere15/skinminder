import Anthropic from '@anthropic-ai/sdk';
import { ROUTINE_SYSTEM_PROMPT, buildRoutineUserPrompt } from '@/prompts/routine';
import { RoutinePlanSchema } from '@/schemas/routine';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateSkincareRoutine(concerns: string[], skinType?: string, difficulty?: string) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("ANTHROPIC_API_KEY not found. Returning mock routine data.");
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      morning: [
        { step: 1, productType: "cleanser", action: "Massage gentle cleanser", durationMinutes: 1, isOptional: false, frequency: "daily" }
      ],
      night: [
        { step: 1, productType: "cleanser", action: "Double cleanse to remove SPF", durationMinutes: 2, isOptional: false, frequency: "daily" }
      ],
      weekly: [],
      difficultyLevel: "beginner",
      concernFocus: concerns as any,
      summary: "This is a simulated baseline routine focusing on gentle hydration and barrier repair."
    };
  }

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1536,
    system: ROUTINE_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildRoutineUserPrompt(concerns, skinType, difficulty),
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Anthropic');
  }

  try {
    const rawJson = JSON.parse(content.text);
    return RoutinePlanSchema.parse(rawJson);
  } catch (error) {
    console.error('Failed to parse routine JSON:', error);
    throw new Error('Routine generation failed to return valid data');
  }
}
