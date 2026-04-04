import { NextRequest, NextResponse } from 'next/server';
import { runFullSkinOrchestration } from '@/services/ai/orchestrator';
import { getSignedScanUrl } from '@/lib/storage-server';
import { errorBoundary, createApiError } from '@/lib/api-utils';
import { apiRateLimit } from '@/lib/rate-limit';

async function handlePost(request: NextRequest) {
  const rateLimitResponse = await apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const { imageUrl: storagePath, bodyArea, concerns, stationId, sessionId } = body;

    if (!storagePath || !bodyArea) {
      throw createApiError('Missing required fields', 400, 'MISSING_FIELDS');
    }

    // Generate a temporary signed URL for the AI pipeline to access the image
    const signedUrl = await getSignedScanUrl(storagePath, 120); // 2 minute window

    // structured metadata for drift tracking
    const metadata = {
        userAgent: request.headers.get('user-agent'),
        resolution: "1920x1080", // hypothetical from client
        capturedAt: new Date().toISOString()
    };

    // Run AI Orchestration using the secure signed URL
    const analysis = await runFullSkinOrchestration({
      userId: "demo-user-" + Date.now(), 
      imageUrl: signedUrl,
      bodyArea,
      userProfile: null,
      concerns: concerns || [],
      metadata: {
          ...metadata,
          stationId,
          sessionId
      }
    });

    if (analysis.error || !analysis.data) {
       // Check for quality-specific errors
       if (analysis.error?.includes("quality") || analysis.error?.includes("Lighting")) {
          throw createApiError(analysis.error || 'Quality Issue', 422, 'QUALITY_ISSUE');
       }
       throw createApiError(analysis.error || 'Failed to analyze skin', 500, 'ANALYSIS_ERROR');
    }

    const aiData = analysis.data;

    // Structure it like a real DB scan object so the UI components can just plug and play
    const scanData = {
      id: "demo",
      user_id: "demo",
      image_url: signedUrl,
      body_area: bodyArea,
      hydration_score: aiData.vision?.hydration || 0,
      skin_score: aiData.intelligence?.skinScore || 0,
      skin_age_estimate: aiData.age?.estimatedAge || null,
      primary_concerns: concerns || [],
      analysis_raw: aiData,
      // Reliability Layer
      confidence_score: aiData.quality?.confidenceScore || 0,
      alignment_metadata: aiData.quality?.metrics || {},
      device_info: aiData.metadata?.deviceInfo || null,
      station_id: stationId || null,
    };

    // If stationId is present, register the scan to the station session
    if (stationId) {
        try {
            const { StationService } = await import('@/v4-modular-monolith/backend/modules/vendors/station.service');
            const stationService = new StationService();
            await stationService.registerScan(scanData.id, stationId, sessionId);
        } catch (e) {
            console.warn("[TryAPI] Failed to register station scan:", e);
        }
    }

    return NextResponse.json(scanData);
  } catch (error: any) {
    console.error('Try API Error:', error);
    if (error.statusCode) throw error;
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export const POST = errorBoundary(handlePost);
