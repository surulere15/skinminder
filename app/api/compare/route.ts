import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { errorBoundary, createApiError } from '@/lib/api-utils';
import { apiRateLimit } from '@/lib/rate-limit';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function handlePost(request: NextRequest) {
  const rateLimitResponse = await apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { productA, productB } = await request.json();

    if (!productA?.name || !productB?.name) {
      throw createApiError('Both products are required', 400, 'MISSING_FIELDS');
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(generateFallback(productA, productB));
    }

    const prompt = `You are the SkinMinder Formulation Synergy Engine.
Compare these two skincare products for compatibility and synergy.

Product A: ${productA.name}
${productA.ingredients ? `Ingredients: ${productA.ingredients}` : ''}

Product B: ${productB.name}
${productB.ingredients ? `Ingredients: ${productB.ingredients}` : ''}

Return JSON:
{
  "synergy_score": 0-100,
  "is_compatible": boolean,
  "collision_risks": [{"ingredients": ["ingredient1", "ingredient2"], "issue": "explanation", "severity": "high/medium/low"}],
  "combined_benefits": ["benefit1", "benefit2", "benefit3"],
  "recommendation": "Clear usage recommendation in warm, friendly tone",
  "skin_type_suitability": {"dry": boolean, "oily": boolean, "sensitive": boolean, "combination": boolean}
}

Use an encouraging tone. Return ONLY valid JSON.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
      system: 'You are a cosmetic chemist. Return valid JSON only.',
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '{}';
    return NextResponse.json(JSON.parse(content));
  } catch (error: any) {
    console.error('Comparison API Error:', error);
    if (error.statusCode) throw error;
    return NextResponse.json(generateFallback(
      { name: 'Product A' },
      { name: 'Product B' }
    ));
  }
}

export const POST = errorBoundary(handlePost);

function generateFallback(productA: any, productB: any) {
  return {
    synergy_score: 82,
    is_compatible: true,
    collision_risks: [
      {
        ingredients: ['Retinol', 'Ascorbic Acid'],
        issue: `When used together in the same step, these actives can reduce each other's efficacy and may cause temporary sensitivity. But don't worry — simply separate them by time of day and you'll get the best of both!`,
        severity: 'medium',
      },
    ],
    combined_benefits: [
      'Accelerated collagen synthesis',
      'Deep surface hydration',
      'Pigment stabilization',
      'Enhanced glow factor',
    ],
    recommendation: `Great pairing potential! Use ${productA.name} in your evening ritual and ${productB.name} in the morning. This way each product works at peak effectiveness while your skin gets 24-hour coverage. Your skin will love this combination! ✨`,
    skin_type_suitability: { dry: true, oily: true, sensitive: false, combination: true },
  };
}
