import Anthropic from '@anthropic-ai/sdk';
import { VISION_ANALYSIS_SYSTEM_PROMPT, buildVisionAnalysisUserPrompt } from '@/prompts/vision-analysis';
import { visionAnalysisSchema } from '@/schemas/scan';
import { isMockMode, getMockDelay, shouldUseMockImage } from '@/lib/config';
import { generateSkinAnalysisWithOllama, shouldUseOllama } from '@/lib/ollama-client';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const AI_TIMEOUT_MS = 30000;

function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`AI request timed out after ${ms}ms`)), ms);
    promise.then(resolve).catch(reject).finally(() => clearTimeout(timer));
  });
}

export async function analyzeSkinImage(imageUrl: string, bodyArea: string) {
  if (shouldUseOllama()) {
    console.log("Using Ollama (MedGemma) for vision analysis");
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const buffer = Buffer.from(await blob.arrayBuffer());
      const base64Image = buffer.toString('base64');
      
      const result = await generateSkinAnalysisWithOllama(base64Image, bodyArea);
      return {
        hydration: result.hydration,
        pigmentation: result.pigmentation,
        texture: result.texture,
        oilBalance: result.oilBalance,
        irritation: result.irritation,
        acneCount: Math.floor(result.irritation * 5),
        analysisNotes: result.analysisNotes,
      };
    } catch (error) {
      console.error("Ollama failed, falling back:", error);
    }
  }

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

  const message = await timeout(
    anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      system: VISION_ANALYSIS_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: buildVisionAnalysisUserPrompt(bodyArea) },
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64Image },
            },
          ],
        },
      ],
    }),
    AI_TIMEOUT_MS
  );

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
