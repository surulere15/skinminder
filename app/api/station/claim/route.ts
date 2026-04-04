import { NextRequest, NextResponse } from 'next/server';
import { StationService } from '@/v4-modular-monolith/backend/modules/vendors/station.service';
import { errorBoundary, createApiError } from '@/lib/api-utils';
import { apiRateLimit } from '@/lib/rate-limit';

async function handlePost(request: NextRequest) {
  const rateLimitResponse = await apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { token, userId } = await request.json();

    if (!token || !userId) {
      throw createApiError('token and userId are required', 400, 'MISSING_FIELDS');
    }

    const stationService = new StationService();
    const scanId = await stationService.claimScan(token, userId);

    return NextResponse.json({ success: true, scanId });
  } catch (error: any) {
    console.error('[ClaimAPI] Error:', error);
    if (error.statusCode) throw error;
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export const POST = errorBoundary(handlePost);
