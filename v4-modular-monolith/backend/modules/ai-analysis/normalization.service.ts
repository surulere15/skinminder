export interface ScanQualityResult {
  score: number;
  passed: boolean;
  confidenceScore: number;
  metrics: Record<string, number>;
  isAcceptable: boolean;
  feedback: string;
}
export class NormalizationService {
  normalize() { return { score: 0.8, passed: true, confidenceScore: 0.9, metrics: {}, isAcceptable: true, feedback: "" }; }
  async assessQuality(_url: string): Promise<ScanQualityResult> {
    return { score: 0.8, passed: true, confidenceScore: 0.9, metrics: {}, isAcceptable: true, feedback: "" };
  }
  calculateConfidenceScore(_metrics: Record<string, number>) { return 0.9; }
  async normalizeImage(_url: string) { return { normalizedPath: _url }; }
}
