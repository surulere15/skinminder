import { VisionService, type VisionMetrics } from './vision.service';
import { NormalizationService } from './normalization.service';
import { InterpretationLayer } from './interpretation.layer';
import { ResultEngineService } from './result_engine.service';
import { determineArchetype } from './archetypes.service';
import { generateSharePayload } from './sharing.service';

/**
 * Orchestration Service
 * Coordinates the full AI analysis pipeline:
 * 1. Image quality assessment
 * 2. Vision metric extraction
 * 3. Deterministic interpretation
 * 4. Archetype classification
 * 5. Result generation
 */
export interface AnalysisResult {
  data: {
    vision: VisionMetrics;
    intelligence: {
      archetype: string;
      vulnerabilities: string[];
      skinScore: number;
    };
    interpretation: any;
    routine: { morning: any[]; evening: any[] };
    nutrition: { foods: string[]; avoid: string[] };
    glow: { score: number; tips: string[] };
    age: { estimatedAge: number; confidence: number };
    recommendations: { recommendations: any[]; routine_note: string };
    comparison: { changes: any[] };
  };
  quality: {
    score: number;
    passed: boolean;
    feedback: string;
    faceHash: string | null;
    lightingScore: number;
    sharpnessScore: number;
    tiltAngle: number;
    faceCoverage: number;
  };
  sharePayload?: any;
  error: string | null;
}

export class OrchestrationService {
  private visionService: VisionService;
  private normalizationService: NormalizationService;
  private resultEngine: ResultEngineService;

  constructor(visionApiKey?: string) {
    this.visionService = new VisionService(visionApiKey || process.env.ANTHROPIC_API_KEY || '');
    this.normalizationService = new NormalizationService();
    this.resultEngine = new ResultEngineService();
  }

  /**
   * Run the full analysis pipeline on an image
   */
  async analyze(params: {
    imageUrl: string;
    userId: string;
    location?: string;
    skinTone?: 'light' | 'medium' | 'melanin-rich';
  }): Promise<AnalysisResult> {
    try {
      // Step 1: Assess image quality
      const quality = await this.normalizationService.assessQuality(params.imageUrl);

      if (!quality.passed) {
        return {
          data: {
            vision: {} as VisionMetrics,
            intelligence: { archetype: '', vulnerabilities: [], skinScore: 0 },
            interpretation: null,
            routine: { morning: [], evening: [] },
            nutrition: { foods: [], avoid: [] },
            glow: { score: 0, tips: [] },
            age: { estimatedAge: 0, confidence: 0 },
            recommendations: { recommendations: [], routine_note: '' },
            comparison: { changes: [] },
          },
          quality: {
            score: quality.score,
            passed: false,
            feedback: quality.feedback,
            faceHash: quality.faceHash,
            lightingScore: quality.lightingScore,
            sharpnessScore: quality.sharpnessScore,
            tiltAngle: quality.tiltAngle,
            faceCoverage: quality.faceCoverage,
          },
          error: 'Image quality too low for reliable analysis',
        };
      }

      // Step 2: Extract vision metrics
      const vision = await this.visionService.extractMetrics(params.imageUrl);

      // Step 3: Determine archetype
      const archetype = determineArchetype({
        hydration: vision.hydration,
        pigmentation: vision.pigmentation,
        oiliness: vision.oilBalance,
        redness: 100 - vision.irritation,
        texture: vision.texture,
      });

      // Step 4: Calculate overall skin score
      const skinScore = Math.round(
        vision.hydration * 0.25 +
        vision.pigmentation * 0.20 +
        vision.texture * 0.20 +
        vision.oilBalance * 0.15 +
        vision.irritation * 0.20
      );

      // Step 5: Generate interpretation
      const interpretation = await this.resultEngine.interpret(
        {
          global_hydration: vision.hydration,
          global_pigmentation: vision.pigmentation,
          global_texture: vision.texture,
          global_oil: vision.oilBalance,
          redness_index: 100 - vision.irritation,
          pore_visibility: 50,
        },
        { lightingScore: quality.lightingScore, sharpnessScore: quality.sharpnessScore },
        params.location || '',
      );

      // Step 6: Generate share payload
      const sharePayload = generateSharePayload(
        {
          label: archetype.label,
          description: archetype.description,
          sensitivityIndex: archetype.sensitivityIndex,
          growthHook: archetype.growthHook,
        },
        params.userId,
      );

      // Identify vulnerabilities
      const vulnerabilities: string[] = [];
      if (vision.hydration < 50) vulnerabilities.push('dehydration');
      if (vision.pigmentation < 45) vulnerabilities.push('pigmentation');
      if (vision.texture < 55) vulnerabilities.push('texture');
      if (vision.irritation < 50) vulnerabilities.push('irritation');
      if (vision.oilBalance < 40 || vision.oilBalance > 70) vulnerabilities.push('oil imbalance');

      return {
        data: {
          vision,
          intelligence: {
            archetype: archetype.label,
            vulnerabilities,
            skinScore,
          },
          interpretation,
          routine: { morning: [], evening: [] },
          nutrition: { foods: [], avoid: [] },
          glow: { score: skinScore, tips: [] },
          age: { estimatedAge: 0, confidence: 0 },
          recommendations: { recommendations: [], routine_note: '' },
          comparison: { changes: [] },
        },
        quality: {
          score: quality.score,
          passed: true,
          feedback: quality.feedback,
          faceHash: quality.faceHash,
          lightingScore: quality.lightingScore,
          sharpnessScore: quality.sharpnessScore,
          tiltAngle: quality.tiltAngle,
          faceCoverage: quality.faceCoverage,
        },
        sharePayload,
        error: null,
      };
    } catch (err) {
      return {
        data: {
          vision: {} as VisionMetrics,
          intelligence: { archetype: '', vulnerabilities: [], skinScore: 0 },
          interpretation: null,
          routine: { morning: [], evening: [] },
          nutrition: { foods: [], avoid: [] },
          glow: { score: 0, tips: [] },
          age: { estimatedAge: 0, confidence: 0 },
          recommendations: { recommendations: [], routine_note: '' },
          comparison: { changes: [] },
        },
        quality: { score: 0, passed: false, feedback: '', faceHash: null, lightingScore: 0, sharpnessScore: 0, tiltAngle: 0, faceCoverage: 0 },
        error: err instanceof Error ? err.message : 'Unknown error during analysis',
      };
    }
  }
}
