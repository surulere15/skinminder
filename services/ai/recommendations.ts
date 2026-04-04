import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ProductRecommendation {
  name: string;
  brand: string;
  category: string;
  price_range: string;
  match_score: number;
  why_it_works: string;
  key_ingredients: string[];
  when_to_use: string;
  concern_addressed: string;
}

export interface RecommendationsResponse {
  recommendations: ProductRecommendation[];
  routine_note: string;
}

export async function generateProductRecommendations(params: {
  skinType: string;
  concerns: string[];
  skinScore?: number;
  budget?: string;
}): Promise<RecommendationsResponse> {
  const { skinType, concerns, skinScore, budget } = params;

  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      recommendations: generateFallback(skinType, concerns),
      routine_note: "These products are selected to balance and nourish your skin based on your primary concerns."
    };
  }

  const prompt = `You are the SkinMinder Product Recommendation Engine.
Based on this user's skin profile, recommend 6 products.

Skin Type: ${skinType || 'combination'}
Concerns: ${(concerns || ['general wellness']).join(', ')}
Skin Score: ${skinScore || 70}
Budget: ${budget || 'moderate'}

Return JSON:
{
  "recommendations": [
    {
      "name": "Product Name",
      "brand": "Brand Name",
      "category": "Cleanser/Serum/Moisturizer/SPF/Treatment/Mask",
      "price_range": "$-$$$$",
      "match_score": 0-100,
      "why_it_works": "2-sentence warm, encouraging explanation of why this product suits their skin",
      "key_ingredients": ["ingredient1", "ingredient2"],
      "when_to_use": "AM/PM/Both",
      "concern_addressed": "primary concern this product targets"
    }
  ],
  "routine_note": "A warm, encouraging 1-2 sentence note about how these products work as a system"
}

Use encouraging, hopeful language. Suggest real, well-known products. Return ONLY valid JSON.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
      system: 'You are a skincare expert and product curator. Return valid JSON only.',
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '{}';
    return JSON.parse(content);
  } catch (error: any) {
    console.error('Recommendations AI Service Error:', error);
    return {
      recommendations: generateFallback(skinType, concerns),
      routine_note: "I've selected some reliable favorites while my connection is being refined."
    };
  }
}

function generateFallback(skinType: string, concerns: string[]): ProductRecommendation[] {
  return [
    {
      name: 'CeraVe Hydrating Cleanser', brand: 'CeraVe', category: 'Cleanser',
      price_range: '$', match_score: 94,
      why_it_works: 'This gentle cleanser preserves your skin barrier while removing impurities. Perfect for building a strong foundation for the rest of your routine.',
      key_ingredients: ['Ceramides', 'Hyaluronic Acid', 'Glycerin'],
      when_to_use: 'Both', concern_addressed: 'Barrier Health',
    },
    {
      name: 'The Ordinary Niacinamide 10%', brand: 'The Ordinary', category: 'Serum',
      price_range: '$', match_score: 92,
      why_it_works: 'A powerhouse for pore refinement and oil balance. Your skin will look noticeably clearer and more refined within weeks.',
      key_ingredients: ['Niacinamide', 'Zinc PCA'],
      when_to_use: 'AM', concern_addressed: 'Texture & Oil',
    },
    {
      name: 'Paula\'s Choice 2% BHA Exfoliant', brand: 'Paula\'s Choice', category: 'Treatment',
      price_range: '$$', match_score: 88,
      why_it_works: 'This cult-favorite exfoliant gently unclogs pores from the inside out. Your skin will feel smoother and look more luminous after just a few uses.',
      key_ingredients: ['Salicylic Acid', 'Green Tea Extract'],
      when_to_use: 'PM', concern_addressed: 'Texture',
    },
    {
      name: 'La Roche-Posay Vitamin C Serum', brand: 'La Roche-Posay', category: 'Serum',
      price_range: '$$', match_score: 90,
      why_it_works: 'A brightening superstar powered by pure Vitamin C. It shields against daily environmental damage while giving you that coveted morning glow.',
      key_ingredients: ['Ascorbic Acid', 'Vitamin E', 'Salicylic Acid'],
      when_to_use: 'AM', concern_addressed: 'Brightness',
    },
    {
      name: 'Neutrogena Hydro Boost Gel-Cream', brand: 'Neutrogena', category: 'Moisturizer',
      price_range: '$', match_score: 86,
      why_it_works: 'Lightweight yet deeply hydrating — this gel-cream sinks in instantly, leaving your skin bouncy, plump, and perfectly moisturized all day.',
      key_ingredients: ['Hyaluronic Acid', 'Glycerin'],
      when_to_use: 'Both', concern_addressed: 'Hydration',
    },
    {
      name: 'EltaMD UV Clear SPF 46', brand: 'EltaMD', category: 'SPF',
      price_range: '$$', match_score: 95,
      why_it_works: 'The ultimate non-negotiable. This dermatologist-favorite sunscreen protects your skin investment while actively calming and nourishing.',
      key_ingredients: ['Zinc Oxide', 'Niacinamide', 'Hyaluronic Acid'],
      when_to_use: 'AM', concern_addressed: 'Protection',
    },
  ];
}
