import { NextRequest, NextResponse } from 'next/server';
import { AggregationService } from '@/v4-modular-monolith/backend/modules/analytics/aggregation.service';
import { errorBoundary, createApiError } from '@/lib/api-utils';
import { apiRateLimit } from '@/lib/rate-limit';

/**
 * Vendor Intelligence API
 * 
 * Serves precomputed statistics to the Brand Dashboard.
 */
async function handleGet(request: NextRequest) {
  const rateLimitResponse = await apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const analytics = new AggregationService();
    const data = await analytics.getVendorIntelligenceSummaries();
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[VendorAPI] Failed to fetch intelligence:", error);
    if (error.statusCode) throw error;
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const GET = errorBoundary(handleGet);
