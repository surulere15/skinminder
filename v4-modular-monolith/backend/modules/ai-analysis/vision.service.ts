import { Anthropic } from '@anthropic-ai/sdk';

/**
 * Vision Service
 * Extracts skin metrics from uploaded images using Claude Vision.
 */
export interface VisionMetrics {
  hydration: number;
  pigmentation: number;
  texture: number;
  oilBalance: number;
  irritation: number;
  acneCount: number;
  analysisNotes: string;
  confidenceScores: {
    hydration: number;
    pigmentation: number;
    texture: number;
    oilBalance: number;
    irritation: number;
  };
}

export class VisionService {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  /**
   * Extract skin metrics from an image URL using Claude Vision
   */
  async extractMetrics(imageUrl: string): Promise<VisionMetrics> {
    // Fetch image and convert to base64
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    const message = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are a dermatological image analysis AI. Analyze the provided skin photo and return ONLY a JSON object with these metrics (0-100 scale):
- hydration: moisture level (higher = more hydrated)
- pigmentation: tone uniformity (higher = more even)
- texture: surface smoothness (higher = smoother)
- oilBalance: sebum regulation (higher = better balanced)
- irritation: calmness level (higher = less irritated)
- acneCount: estimated number of visible blemishes
- analysisNotes: brief clinical observation
- confidenceScores: confidence for each metric (0-1)

Return ONLY valid JSON, no markdown, no explanation.`,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64' as const, media_type: 'image/jpeg' as const, data: base64 },
          },
          { type: 'text', text: 'Analyze this skin photo and return metrics as JSON.' },
        ],
      }],
    });

    const text = message.content[0]?.type === 'text' ? message.content[0].text : '{}';
    const parsed = JSON.parse(text);

    return {
      hydration: parsed.hydration ?? 50,
      pigmentation: parsed.pigmentation ?? 50,
      texture: parsed.texture ?? 50,
      oilBalance: parsed.oilBalance ?? 50,
      irritation: parsed.irritation ?? 50,
      acneCount: parsed.acneCount ?? 0,
      analysisNotes: parsed.analysisNotes || '',
      confidenceScores: {
        hydration: parsed.confidenceScores?.hydration ?? 0.7,
        pigmentation: parsed.confidenceScores?.pigmentation ?? 0.7,
        texture: parsed.confidenceScores?.texture ?? 0.7,
        oilBalance: parsed.confidenceScores?.oilBalance ?? 0.7,
        irritation: parsed.confidenceScores?.irritation ?? 0.7,
      },
    };
  }

  /**
   * Extract metrics from a base64 image
   */
  async extractMetricsFromBase64(base64: string, mimeType: string): Promise<VisionMetrics> {
    const message = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are a dermatological image analysis AI. Analyze the provided skin photo and return ONLY a JSON object with these metrics (0-100 scale):
- hydration: moisture level (higher = more hydrated)
- pigmentation: tone uniformity (higher = more even)
- texture: surface smoothness (higher = smoother)
- oilBalance: sebum regulation (higher = better balanced)
- irritation: calmness level (higher = less irritated)
- acneCount: estimated number of visible blemishes
- analysisNotes: brief clinical observation
- confidenceScores: confidence for each metric (0-1)

Return ONLY valid JSON, no markdown, no explanation.`,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64' as const, media_type: mimeType as any, data: base64 },
          },
          { type: 'text', text: 'Analyze this skin photo and return metrics as JSON.' },
        ],
      }],
    });

    const text = message.content[0]?.type === 'text' ? message.content[0].text : '{}';
    const parsed = JSON.parse(text);

    return {
      hydration: parsed.hydration ?? 50,
      pigmentation: parsed.pigmentation ?? 50,
      texture: parsed.texture ?? 50,
      oilBalance: parsed.oilBalance ?? 50,
      irritation: parsed.irritation ?? 50,
      acneCount: parsed.acneCount ?? 0,
      analysisNotes: parsed.analysisNotes || '',
      confidenceScores: {
        hydration: parsed.confidenceScores?.hydration ?? 0.7,
        pigmentation: parsed.confidenceScores?.pigmentation ?? 0.7,
        texture: parsed.confidenceScores?.texture ?? 0.7,
        oilBalance: parsed.confidenceScores?.oilBalance ?? 0.7,
        irritation: parsed.confidenceScores?.irritation ?? 0.7,
      },
    };
  }
}
