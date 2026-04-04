import Anthropic from '@anthropic-ai/sdk';
import { VISION_ANALYSIS_SYSTEM_PROMPT, buildVisionAnalysisUserPrompt } from '@/prompts/vision-analysis';
import { visionAnalysisSchema } from '@/schemas/scan';
import { isMockMode, getMockDelay, shouldUseMockImage } from '@/lib/config';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyzeSkinImage(imageUrl: string, bodyArea: string) {
  if (!process.env.ANTHROPIC_API_KEY || shouldUseMockImage(imageUrl)) {
    console.warn("MOCK_VISION: Returning mock analysis data.");
    await new Promise((resolve) => setTimeout(resolve, getMockDelay()));
    return {
      hydration: 0.68,
      pigmentation: 0.72,
      texture: 0.55,
      oilBalance: 0.80,
      irritation: 0.15,
      acneCount: 2,
      analysisNotes: "Skin barrier shows healthy hydration with minor texture irregularities on the forehead. Oil balance is optimal, though slight redness indicates mild sensitivity around the cheeks."
    };
  }

  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const buffer = Buffer.from(await blob.arrayBuffer());
  const base64Image = buffer.toString('base64');
  const mediaType = blob.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp";

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1024,
    system: VISION_ANALYSIS_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: buildVisionAnalysisUserPrompt(bodyArea),
          },
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: base64Image,
            },
          },
        ],
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Anthropic');
  }

  try {
    const rawJson = JSON.parse(content.text);
    return visionAnalysisSchema.parse(rawJson);
  } catch (error) {
    console.error('Failed to parse vision analysis JSON:', error);
    throw new Error('AI analysis failed to return valid data');
  }
}
