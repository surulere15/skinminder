import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { OrchestrationService } from '@/v4-modular-monolith/backend/modules/ai-analysis/orchestration.service';
import { NormalizationService, ScanQualityResult } from '@/v4-modular-monolith/backend/modules/ai-analysis/normalization.service';
import { scanRateLimit } from '@/lib/rate-limit';
import { errorBoundary, createApiError } from '@/lib/api-utils';

async function handlePost(request: NextRequest) {
  const rateLimitResponse = await scanRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  let supabase: any = null;
  let user: any = null;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch (e) {
      console.warn("Supabase auth check failed in dev mock mode");
    }
  }

  if (!user) {
    console.warn("No user found. Using dummy UUID for development mode.");
  }
  const finalUserId = user?.id || "00000000-0000-0000-0000-000000000000";

  const body = await request.json();
  const { imageUrl, bodyArea, concerns } = body;

  if (!imageUrl || !bodyArea) {
    throw createApiError('Missing required fields', 400, 'MISSING_FIELDS');
  }

  let profile = null;
  if (supabase && finalUserId !== "00000000-0000-0000-0000-000000000000") {
    const { data } = await supabase
      .from('profiles' as any)
      .select('*')
      .eq('id', finalUserId)
      .single();
    profile = data;
  }

  const orchestrator = new OrchestrationService();
  const analysis = await orchestrator.analyze({
    userId: finalUserId,
    imageUrl,
    bodyArea,
    userProfile: profile,
    concerns: concerns || [],
  });

  if (analysis.error || !analysis.data) {
    throw new Error(analysis.error || 'Failed to analyze skin');
  }

  // Duplicate scan detection - check for recent scans with same face hash
  if (supabase && analysis.quality?.faceHash) {
    const duplicateWindowMs = parseInt(process.env.QUALITY_DUPLICATE_WINDOW_MS || '60000', 10);
    const windowStart = new Date(Date.now() - duplicateWindowMs).toISOString();
    
    const { data: recentScan } = await supabase
      .from('skin_scans')
      .select('id, created_at')
      .eq('user_id', finalUserId)
      .eq('face_hash', analysis.quality.faceHash)
      .gte('created_at', windowStart)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (recentScan) {
      console.warn(`[Scan] Duplicate detected: user ${finalUserId} scanned same face within ${duplicateWindowMs}ms`);
      throw createApiError('You recently scanned this face. Please wait before scanning again.', 429, 'DUPLICATE_SCAN');
    }
  }

  const aiData = analysis.data;

  let scanData: any = {
    id: "mock-scan-id-" + Date.now(),
    user_id: finalUserId,
    image_url: imageUrl,
    body_area: bodyArea,
    hydration_score: aiData.vision?.hydration || 0,
    skin_score: aiData.intelligence?.skinScore || 0,
    skin_age_estimate: aiData.age?.estimatedAge || null,
    primary_concerns: concerns || [],
    analysis_raw: aiData,
  };

  if (supabase) {
    const { data: scan, error: dbError } = await supabase
      .from('skin_scans')
      .insert({
        user_id: finalUserId,
        image_url: imageUrl,
        body_area: bodyArea,
        hydration_score: aiData.vision.hydration,
        pigmentation_score: aiData.vision.pigmentation,
        texture_score: aiData.vision.texture,
        oil_balance: aiData.vision.oilBalance,
        irritation_probability: aiData.vision.irritation,
        skin_score: aiData.intelligence?.skinScore || 0,
        skin_age_estimate: aiData.age?.estimatedAge || null,
        primary_concerns: concerns || [],
        analysis_raw: aiData,
        face_hash: analysis.quality?.faceHash || null,
        brightness_score: analysis.quality?.lightingScore || null,
        sharpness_score: analysis.quality?.sharpnessScore || null,
        tilt_angle: analysis.quality?.tiltAngle || null,
        face_coverage: analysis.quality?.faceCoverage || null,
        skin_archetype: aiData.interpretation?.archetype?.main || 'Balanced Skin',
        interpretation_raw: aiData.interpretation || null,
        skin_regional_metrics: aiData.interpretation?.regions || null,
        environmental_context: aiData.interpretation?.environment || null,
        environment_id: (analysis as any).telemetry?.environmentId || null,
        scan_duration_ms: (analysis as any).telemetry?.scanDurationMs || null,
        network_latency_ms: (analysis as any).telemetry?.networkLatencyMs || null,
        device_type: body.deviceType || 'unknown',
        consent_version: 'v1.0',
        consented_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) throw dbError;
    scanData = scan;

    const GraphService = (await import('@/v4-modular-monolith/backend/modules/analytics/graph.service')).GraphService;
    const graphService = new GraphService();
    await graphService.linkScanToProducts(
        scan.id, 
        finalUserId, 
        scan.baseline_scan_id ? 'during' : 'baseline'
    );

    if (aiData.interpretation?.regions) {
        const regions = Object.entries(aiData.interpretation.regions).map(([name, data]: [string, any]) => ({
            scan_id: scan.id,
            region_name: name,
            hydration_score: data.hydration?.score || 0,
            pigmentation_score: data.pigmentation?.score || 0,
            texture_score: data.texture?.score || 0,
            oil_balance_score: data.oil?.score || 0,
            redness_index: data.redness?.score || 0
        }));
        
        if (regions.length > 0) {
            await (supabase.from('skin_regions' as any) as any).insert(regions);
        }
    }
  }

  if (supabase && aiData.routine) {
    await supabase
      .from('routine_history')
      .insert({
        user_id: finalUserId,
        products_used: [],
        notes: JSON.stringify(aiData.routine),
      });
  }

  return NextResponse.json(scanData);
}

export const POST = errorBoundary(handlePost);
