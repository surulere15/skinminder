export interface ScanQualityResult {
  score: number;
  passed: boolean;
  confidenceScore: number;
  metrics: Record<string, number>;
  isAcceptable: boolean;
  feedback: string;
  faceHash: string | null;
  lightingScore: number;
  sharpnessScore: number;
  tiltAngle: number;
  faceCoverage: number;
}

export class NormalizationService {
  normalize(): ScanQualityResult {
    return {
      score: 0.8,
      passed: true,
      confidenceScore: 0.9,
      metrics: {},
      isAcceptable: true,
      feedback: '',
      faceHash: null,
      lightingScore: 0.8,
      sharpnessScore: 0.85,
      tiltAngle: 0,
      faceCoverage: 0.5,
    };
  }

  async assessQuality(_url: string): Promise<ScanQualityResult> {
    return {
      score: 0.8,
      passed: true,
      confidenceScore: 0.9,
      metrics: {
        brightness: 0.8,
        sharpness: 0.85,
        tilt: 0,
        coverage: 0.5,
      },
      isAcceptable: true,
      feedback: '',
      faceHash: `hash_${Date.now()}`,
      lightingScore: 0.8,
      sharpnessScore: 0.85,
      tiltAngle: 0,
      faceCoverage: 0.5,
    };
  }

  calculateConfidenceScore(metrics: Record<string, number>): number {
    const values = Object.values(metrics);
    if (values.length === 0) return 0.5;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  async normalizeImage(_url: string) {
    return { normalizedPath: _url };
  }

  checkConsistency(_prev: any, _quality: ScanQualityResult) {
    return { isConsistent: true, deviations: [] };
  }
}
