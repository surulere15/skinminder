import { NextRequest, NextResponse } from 'next/server';
import { StationService } from '@/v4-modular-monolith/backend/modules/vendors/station.service';
import { errorBoundary, createApiError } from '@/lib/api-utils';
import { apiRateLimit } from '@/lib/rate-limit';

async function handlePost(request: NextRequest) {
  const rateLimitResponse = await apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { scanId } = await request.json();

    if (!scanId) {
      throw createApiError('scanId is required', 400, 'MISSING_FIELDS');
    }

    const stationService = new StationService();
    const token = await stationService.generateHandoffToken(scanId);

    return NextResponse.json({ token });
  } catch (error: any) {
    console.error('[HandoffAPI] Error:', error);
    if (error.statusCode) throw error;
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const POST = errorBoundary(handlePost);
