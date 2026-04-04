import { NextRequest, NextResponse } from 'next/server';
import { generateProductRecommendations } from '@/services/ai/recommendations';
import { errorBoundary, createApiError } from '@/lib/api-utils';
import { apiRateLimit } from '@/lib/rate-limit';

async function handlePost(request: NextRequest) {
  const rateLimitResponse = await apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { skinType, concerns, skinScore, budget } = await request.json();

    if (!skinType || !concerns) {
      throw createApiError('Missing required fields', 400, 'MISSING_FIELDS');
    }

    const result = await generateProductRecommendations({
      skinType,
      concerns,
      skinScore,
      budget,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Recommendations API Error:', error);
    if (error.statusCode) throw error;
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const POST = errorBoundary(handlePost);
