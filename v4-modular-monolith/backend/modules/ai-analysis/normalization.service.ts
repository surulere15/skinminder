export interface ScanQualityResult {
  score: number;
  passed: boolean;
  confidenceScore: number;
  metrics: Record<string, number>;
}
export class NormalizationService {
  normalize() { return { score: 0.8, passed: true, confidenceScore: 0.9, metrics: {} }; }
}
