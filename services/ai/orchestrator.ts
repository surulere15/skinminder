import { analyzeSkinImage } from './vision';
import { deepSkinIntelligence } from './intelligence';
import { generateSkincareRoutine } from './routine';
import { generateNutritionPlan } from './nutrition';
import { generateGlowSimulation } from './glow';
import { estimateSkinAge } from './age';
import { generateProductRecommendations } from './recommendations';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { OrchestrationService } from '@/v4-modular-monolith/backend/modules/ai-analysis/orchestration.service';
import { NormalizationService, ScanQualityResult } from '@/v4-modular-monolith/backend/modules/ai-analysis/normalization.service';
import { ResultEngineService, SkinInterpretation } from '@/v4-modular-monolith/backend/modules/ai-analysis/result_engine.service';
import { GraphService } from '@/v4-modular-monolith/backend/modules/analytics/graph.service';
import { getSignedScanUrl, deleteScan } from '@/lib/storage-server';
import { OutcomeService } from '@/v4-modular-monolith/backend/modules/outcomes/ppi-engine.service';
import { PhenotypeService } from '@/v4-modular-monolith/backend/modules/intelligence/phenotype.service';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OrchestrationResult<T> {
  data: T | null;
  error: string | null;
  timing: number;
  quality?: any;
  telemetry?: {
      environmentId?: string;
      scanDurationMs: number;
      networkLatencyMs: number;
  };
}

export interface FullOrchestrationOutput {
  vision: any;
  intelligence: any;
  routine: any | null;
  nutrition: any | null;
  glow: any | null;
  age: any | null;
  recommendations: any | null;
  comparison: any | null;
  quality: ScanQualityResult;
  interpretation: SkinInterpretation;
  consistency: any | null;
  metadata: any;
}

// ---------------------------------------------------------------------------
// Full 7-Engine Orchestration Pipeline
// ---------------------------------------------------------------------------

export async function runFullSkinOrchestration(params: {
  userId: string;
  imageUrl: string;
  bodyArea: string;
  userProfile: any;
  concerns: string[];
  previousScan?: any;
  previousMetadata?: any;
  metadata?: any;
}): Promise<OrchestrationResult<FullOrchestrationOutput>> {
  const startTime = Date.now();
  const { userId, imageUrl, bodyArea, userProfile, concerns, metadata } = params;
  const normalization = new NormalizationService();
  const orchestrationService = new OrchestrationService(process.env.ANTHROPIC_API_KEY);
  const phenotypes = new PhenotypeService();

  try {
    // -----------------------------------------------------------------------
    // Stage 0: Data Quality & Normalization (Drift Prevention)
    // -----------------------------------------------------------------------
    const signedUrl = await getSignedScanUrl(imageUrl);
    
    const quality = await normalization.assessQuality(signedUrl);
    if (!quality.isAcceptable) {
        throw new Error(JSON.stringify({ 
            error: quality.feedback || "Scan quality too low.", 
            metrics: quality.metrics 
        }));
    }
    
    // Calculate Capture Confidence
    quality.confidenceScore = normalization.calculateConfidenceScore(quality.metrics);
    
    const { normalizedPath } = await normalization.normalizeImage(signedUrl);

    // Baseline Consistency Check
    let consistency: any = null;
    if (params.previousMetadata) {
        consistency = normalization.checkConsistency(params.previousMetadata, quality);
        console.log(`[Orchestrator] Consistency check: ${consistency.isConsistent ? 'PASS' : 'FAIL'} (Confidence: ${quality.confidenceScore})`, consistency.deviations);
    }

    // -----------------------------------------------------------------------
    // Stage 1: Core Vision Analysis (using normalized image)
    // -----------------------------------------------------------------------
    const visionResults = await analyzeSkinImage(normalizedPath, bodyArea);
    console.log(`[Orchestrator] Vision completed in ${Date.now() - startTime}ms`);

    // -----------------------------------------------------------------------
    // Stage 3: Professional Interpretation (Context Engine)
    // -----------------------------------------------------------------------
    const resultEngine = new ResultEngineService();
    const interpretation = await resultEngine.interpret({
      global_hydration: visionResults.hydration,
      global_pigmentation: visionResults.pigmentation,
      global_texture: visionResults.texture,
      global_oil: visionResults.oilBalance,
      redness_index: visionResults.irritation * 100,
      pore_visibility: visionResults.texture * 100,
      regions: (visionResults as any).regions || [] 
    }, quality, metadata?.location || 'unknown');

    // Graph: Record environment node (Temporal Context)
    let environmentId: string | undefined;
    const graph = new GraphService();
    if (interpretation?.environment) {
        try {
            environmentId = await graph.recordEnvironment({
                scanId: 'temp',
                humidity: interpretation.environment.humidity,
                uvIndex: interpretation.environment.uv_index,
                temperature: 20,
                pollution: interpretation.environment.pollution,
                location: metadata?.location || 'unknown',
            });
        } catch (e) {
            console.warn("[Orchestrator] Environment recording failed:", e);
        }
    }

    // -----------------------------------------------------------------------
    // Stage 2: Deep Skin Intelligence (Recommendation Layer)
    // -----------------------------------------------------------------------
    const intelligenceResults = await deepSkinIntelligence(
      visionResults,
      userProfile,
      concerns,
      {
        quality: quality.metrics,
        interpretation: interpretation
      }
    );
    console.log(`[Orchestrator] Intelligence completed in ${Date.now() - startTime}ms`);

    const skinType = userProfile?.skin_type || 'combination';
    const overallScore = Math.round(
      ((visionResults.hydration || 0) +
        (visionResults.pigmentation || 0) +
        (visionResults.texture || 0) +
        (visionResults.oilBalance || 0) +
        (1 - (visionResults.irritation || 0))) /
        5 * 100
    );

    // -----------------------------------------------------------------------
    // Stage 2.5: Biometric Safety (Deferred Purge)
    // -----------------------------------------------------------------------
    // Note: Purge is now deferred to the end of the pipeline to allow 
    // downstream engines (Routine, Nutrition) to recover if they fail.

    // Region Segmentation (Optional but powerful)
    // We already have some region mapping in resultEngine.interpret

    // -----------------------------------------------------------------------
    // Stage 3: Parallel downstream engines
    // -----------------------------------------------------------------------
    const results = await Promise.allSettled([
      generateSkincareRoutine(concerns, skinType, 'beginner'),
      generateNutritionPlan({ skinType, concerns, overallScore }),
      generateGlowSimulation({ currentMetrics: visionResults, skinType, concerns }),
      estimateSkinAge(visionResults, userProfile?.age),
      generateProductRecommendations({ skinType, concerns, skinScore: overallScore }),
      params.previousScan ? new OutcomeService().compareScans(params.previousScan, {
          ...visionResults,
          id: 'new-scan',
          created_at: new Date().toISOString(),
          hydration_score: visionResults.hydration,
          pigmentation_score: visionResults.pigmentation,
          texture_score: visionResults.texture,
          oil_balance: visionResults.oilBalance
      }) : Promise.resolve(null)
    ]);

    const [
      routineResult, 
      nutritionResult, 
      glowResult, 
      ageResult, 
      recommendationsResult,
      comparisonResult
    ] = results;

    const duration = Date.now() - startTime;

    // Graph Edge: Record follow-up relationship
    if (comparisonResult.status === 'fulfilled' && comparisonResult.value && params.previousScan) {
        try {
            await new OutcomeService().recordComparison(
                params.userId,
                params.previousScan.id,
                'current-scan-placeholder',
                comparisonResult.value as any
            );

            await graph.recordEdge({
                fromId: params.previousScan.id,
                toId: 'current-scan-placeholder',
                type: 'COMPARED_TO',
                metadata: { userId: params.userId }
            });
        } catch (e) {
            console.warn("[Orchestrator] Path persistence failed:", e);
        }
    }

    // -----------------------------------------------------------------------
    // Stage 5: Phenotype Clustering (Research Intel)
    // -----------------------------------------------------------------------
    // Track phenotypes internally for collective intelligence (not shown to user)
    try {
        const phenotypeTags = phenotypes.assignPhenotypes(visionResults, interpretation.environment);
        // Note: Phenotypes are recorded for long-term population intelligence.
        // await phenotypes.recordPhenotypes(scanRecordId, phenotypeTags); 
    } catch (e) {
        console.warn("[Orchestrator] Phenotype tagging failed:", e);
    }

    // -----------------------------------------------------------------------
    // Stage 6: Biometric Purge (Clinical Compliance)
    // -----------------------------------------------------------------------
    // Purging now that full analysis suite (downstream engines) has completed.
    await deleteScan(imageUrl).catch(err => console.error(`[Orchestrator] Deferred purge failed:`, err));

    return {
      data: {
        vision: visionResults,
        intelligence: intelligenceResults,
        routine: routineResult.status === 'fulfilled' ? routineResult.value : null,
        nutrition: nutritionResult.status === 'fulfilled' ? nutritionResult.value : null,
        glow: glowResult.status === 'fulfilled' ? glowResult.value : null,
        age: ageResult.status === 'fulfilled' ? ageResult.value : null,
        recommendations: recommendationsResult.status === 'fulfilled' ? recommendationsResult.value : null,
        comparison: comparisonResult.status === 'fulfilled' ? comparisonResult.value : null,
        quality: quality,
        interpretation: interpretation,
        consistency: consistency,
        metadata: params.metadata || {}
      },
      error: null,
      timing: duration,
      quality: quality,
      telemetry: {
          environmentId: environmentId,
          scanDurationMs: duration,
          networkLatencyMs: params.metadata?.networkLatency || 0
      }
    };
  } catch (err: any) {
    console.error(`[SkinOrchestrator] Pipeline failed:`, err);
    return {
      data: null,
      error: err.message || 'Orchestration failed',
      timing: Date.now() - startTime,
    };
  }
}

export async function runSingleEngine<T>(
  engineName: string,
  engineFn: () => Promise<T>
): Promise<OrchestrationResult<T>> {
  const startTime = Date.now();
  try {
    const data = await engineFn();
    const timing = Date.now() - startTime;
    console.log(`[Orchestrator:${engineName}] Completed in ${timing}ms`);
    return { data, error: null, timing };
  } catch (err: any) {
    console.error(`[Orchestrator:${engineName}] Failed:`, err);
    return {
      data: null,
      error: err.message || `${engineName} failed`,
      timing: Date.now() - startTime,
    };
  }
}
