import Anthropic from '@anthropic-ai/sdk';
import { ingredientAnalysisSchema } from '@/prompts/skin-intelligence';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "", 
});

export async function analyzeProductIngredients(imageUrl: string, skinDna: any) {
  if (!process.env.ANTHROPIC_API_KEY) {
    // Fallback Mock for local development without API keys
    return {
      status: "success",
      compatibilityScore: 75,
      summary: "This product contains excellent hydrating ingredients for your profile, but has a mild fragrance that could trigger your sensitivities.",
      ingredients: [
        { name: "Water (Aqua)", verdict: "neutral", reason: "Standard base solvent." },
        { name: "Glycerin", verdict: "beneficial", reason: "Excellent humectant to support your dry baseline." },
        { name: "Niacinamide", verdict: "beneficial", reason: "Helpful for your pigmentation tendency and barrier support." },
        { name: "Fragrance (Parfum)", verdict: "caution", reason: "May irritate your moderate sensitivity level." },
        { name: "Salicylic Acid", verdict: "avoid", reason: "Too harsh for your daily use given your barrier resilience score." }
      ]
    };
  }

  // Determine image format (simplistic approach for demo, assuming base64 data URI)
  const isBase64 = imageUrl.startsWith('data:image/');
  let mediaBuffer = imageUrl;
  let mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' = 'image/jpeg';

  if (isBase64) {
    const matches = imageUrl.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      mediaType = matches[1] as any;
      mediaBuffer = matches[2];
    }
  }

  const schemaShape = `{
    status: "success" | "error",
    compatibilityScore: number (0-100),
    summary: string,
    ingredients: Array<{
       name: string,
       verdict: "beneficial" | "neutral" | "caution" | "avoid",
       reason: string // Specific to their DNA
    }>
  }`;

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1536,
    system: `You are an expert cosmetic chemist and dermatological AI. Your job is to extract the ingredient list from the provided product label image, and then cross-reference EVERY ingredient against the user's specific "Skin DNA" profile. Return ONLY raw JSON matching this schema: ${schemaShape}`,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze these ingredients for compatibility with this specific user's Skin DNA: ${JSON.stringify(skinDna)}. 
            
            Rules:
            1. Extract all legible ingredients from the image.
            2. Score overall compatibility out of 100 heavily weighted by their specific DNA vulnerabilities.
            3. For the 'ingredients' array, mark them beneficial, neutral, caution, or avoid, explicitly explaining WHY based on their DNA.
            4. Return strictly valid JSON.`
          },
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: mediaBuffer,
            },
          }
        ],
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Anthropic Vision');
  }

  try {
    const rawJson = JSON.parse(content.text);
    return ingredientAnalysisSchema.parse(rawJson);
  } catch (error) {
    console.error('Failed to parse ingredient analysis JSON:', error);
    throw new Error('Ingredient analysis failed to return valid JSON');
  }
}
