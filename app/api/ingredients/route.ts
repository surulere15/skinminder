import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Anthropic from '@anthropic-ai/sdk';
import { errorBoundary, createApiError } from '@/lib/api-utils';
import { apiRateLimit } from '@/lib/rate-limit';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// GET — search ingredients from database
async function handleGet(request: NextRequest) {
  const rateLimitResponse = await apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const supabase = await createClient();

    let dbQuery = supabase.from('ingredients').select('*');

    if (query) {
      dbQuery = dbQuery.ilike('name', `%${query}%`);
    }

    const { data: ingredients, error } = await dbQuery.limit(20);

    if (error) throw error;

    return NextResponse.json(ingredients);
  } catch (error: any) {
    console.error('Ingredients API Error:', error);
    if (error.statusCode) throw error;
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST — AI-powered ingredient deep analysis
async function handlePost(request: NextRequest) {
  const rateLimitResponse = await apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { ingredientName, skinType, concerns } = await request.json();

    if (!ingredientName) {
      throw createApiError('ingredientName is required', 400, 'MISSING_FIELDS');
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(generateFallback(ingredientName));
    }

    const prompt = `You are the SkinMinder Ingredient Intelligence Engine.
Analyze this cosmetic ingredient for a user with ${skinType || 'combination'} skin concerned about ${(concerns || ['general wellness']).join(', ')}.

Ingredient: ${ingredientName}

Return a JSON object with:
{
  "name": "${ingredientName}",
  "category": "Active/Moisturizer/Exfoliant/Antioxidant/etc",
  "efficacy_rating": 0-100,
  "safety_rating": 0-100,
  "description": "2-3 sentence expert description in warm, encouraging tone",
  "mechanism": "How it works on skin at a molecular level, explained simply",
  "benefits": ["benefit1", "benefit2", "benefit3"],
  "best_paired_with": ["ingredient1", "ingredient2"],
  "avoid_with": ["ingredient1"],
  "optimal_concentration": "0.5-2%",
  "time_of_day": "AM/PM/Both",
  "skin_types_suited": ["oily", "dry", "combination", "sensitive"],
  "fun_fact": "An interesting, memorable fact about this ingredient",
  "personalized_tip": "A specific tip for the user's skin type and concerns"
}

Use a warm, hopeful tone — like a knowledgeable friend sharing beauty secrets. Return ONLY valid JSON.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
      system: 'You are a cosmetic chemist and skincare expert. Return valid JSON only, no markdown.',
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '{}';
    const parsed = JSON.parse(content);

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Ingredient Analysis Error:', error);
    if (error.statusCode) throw error;
    return NextResponse.json(generateFallback('Unknown Ingredient'));
  }
}

export const GET = errorBoundary(handleGet);
export const POST = errorBoundary(handlePost);

function generateFallback(name: string) {
  const fallbacks: Record<string, any> = {
    'retinol': {
      name: 'Retinol', category: 'Active', efficacy_rating: 92, safety_rating: 72,
      description: 'The gold standard of anti-aging — retinol accelerates cell turnover, revealing fresh, luminous skin underneath. Think of it as your skin\'s personal renewal engine.',
      mechanism: 'Converts to retinoic acid in the skin, binding to retinoid receptors to boost collagen production and speed up cellular turnover.',
      benefits: ['Reduces fine lines & wrinkles', 'Evens skin tone', 'Minimizes pores', 'Boosts collagen'],
      best_paired_with: ['Hyaluronic Acid', 'Niacinamide', 'Ceramides'],
      avoid_with: ['Vitamin C (direct)', 'AHA/BHA (same routine)', 'Benzoyl Peroxide'],
      optimal_concentration: '0.25-1%', time_of_day: 'PM',
      skin_types_suited: ['oily', 'combination', 'normal'],
      fun_fact: 'Retinol was originally developed as an acne treatment in the 1970s — its anti-aging benefits were a happy accident!',
      personalized_tip: 'Start with 0.25% twice a week and work up. Your skin will thank you in 6 weeks. ✨'
    },
    'niacinamide': {
      name: 'Niacinamide', category: 'Active', efficacy_rating: 88, safety_rating: 95,
      description: 'Your skin\'s best friend — niacinamide does a little bit of everything. It brightens, calms, and strengthens your skin barrier, all with virtually zero irritation risk.',
      mechanism: 'A form of Vitamin B3 that enhances ceramide synthesis, reduces melanin transfer, and regulates sebum production.',
      benefits: ['Minimizes pores', 'Brightens complexion', 'Strengthens barrier', 'Controls oil'],
      best_paired_with: ['Hyaluronic Acid', 'Retinol', 'Zinc'],
      avoid_with: ['Direct Vitamin C (at high concentrations)'],
      optimal_concentration: '2-5%', time_of_day: 'Both',
      skin_types_suited: ['oily', 'dry', 'combination', 'sensitive'],
      fun_fact: 'Niacinamide is so gentle that it\'s one of the few actives dermatologists recommend for every skin type — even the most sensitive!',
      personalized_tip: 'Layer this under your moisturizer morning and night for noticeably brighter skin in 2 weeks.'
    },
    'hyaluronic acid': {
      name: 'Hyaluronic Acid', category: 'Moisturizer', efficacy_rating: 90, safety_rating: 98,
      description: 'Nature\'s moisture magnet — hyaluronic acid can hold 1,000x its weight in water, flooding your skin with deep, lasting hydration that makes it look plump and dewy.',
      mechanism: 'A glycosaminoglycan that attracts and binds water molecules to the skin\'s surface and deeper layers, creating a moisture reservoir.',
      benefits: ['Deep hydration', 'Plumps fine lines', 'Dewy glow', 'Barrier support'],
      best_paired_with: ['Vitamin C', 'Niacinamide', 'Ceramides'],
      avoid_with: [],
      optimal_concentration: '0.1-2%', time_of_day: 'Both',
      skin_types_suited: ['oily', 'dry', 'combination', 'sensitive', 'normal'],
      fun_fact: 'Your body naturally contains about 15g of hyaluronic acid, but half of it is replaced daily — that\'s why topical application helps so much!',
      personalized_tip: 'Apply on damp skin for maximum absorption — it needs water to work its magic! 💧'
    },
  };

  const key = name.toLowerCase();
  return fallbacks[key] || {
    name, category: 'Active', efficacy_rating: 75, safety_rating: 85,
    description: `${name} is a promising cosmetic ingredient used in modern skincare formulations. Its unique molecular profile offers targeted benefits for skin health.`,
    mechanism: 'Works through targeted interaction with skin cells to promote optimal barrier function and appearance.',
    benefits: ['Supports skin health', 'Improves appearance', 'Enhances routine efficacy'],
    best_paired_with: ['Hyaluronic Acid', 'Niacinamide'],
    avoid_with: [],
    optimal_concentration: 'As directed', time_of_day: 'Both',
    skin_types_suited: ['oily', 'dry', 'combination', 'sensitive'],
    fun_fact: 'Modern cosmetic science is continually uncovering new benefits of well-known ingredients.',
    personalized_tip: 'Introduce gradually and monitor how your skin responds over 2-4 weeks.'
  };
}
