import { NextRequest, NextResponse } from 'next/server';
import { PartnerService } from '@/v4-modular-monolith/backend/modules/partners/partner.service';
import { errorBoundary, createApiError } from '@/lib/api-utils';
import { apiRateLimit } from '@/lib/rate-limit';

/**
 * API Route to fetch partner configuration for the widget.
 * This is the entry point for B2B customization and attribution.
 */
async function handleGet(req: NextRequest) {
  const rateLimitResponse = await apiRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const { searchParams } = new URL(req.url);
  const apiKey = searchParams.get('apiKey');

  if (!apiKey) {
    throw createApiError('API Key is required', 400, 'MISSING_API_KEY');
  }

  const partnerService = new PartnerService();
  const partner = await partnerService.getPartnerByApiKey(apiKey);

  if (!partner) {
    throw createApiError('Invalid API Key', 401, 'INVALID_API_KEY');
  }

  // Return only non-sensitive configuration for frontend use
  return NextResponse.json({
      id: partner.id,
      name: partner.name,
      settings: partner.settings
  });
}

export const GET = errorBoundary(handleGet);
