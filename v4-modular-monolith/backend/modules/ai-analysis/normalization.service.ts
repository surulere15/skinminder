export interface ScanQualityResult { score: number; passed: boolean; }
export class NormalizationService {
  normalize() { return { score: 0.8, passed: true }; }
}
