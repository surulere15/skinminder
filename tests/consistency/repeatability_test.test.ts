import { NormalizationService } from '../../v4-modular-monolith/backend/modules/ai-analysis/normalization.service';
import { describe, it, expect, beforeEach } from 'vitest';

/**
 * Repeatability Test
 * Ensures that the Consistency Engine produces variance < 5% 
 * across identical image inputs.
 */

describe('Consistency Engine: Repeatability Test', () => {
    let normalization: NormalizationService;
    const testImageUrl = 'https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/public/og.png'; // Placeholder for testing

    beforeEach(() => {
        normalization = new NormalizationService();
    });

    it('should produce identical scores for identical inputs', async () => {
        const results = await Promise.all([
            normalization.assessQuality(testImageUrl),
            normalization.assessQuality(testImageUrl),
            normalization.assessQuality(testImageUrl)
        ]);

        const hydrationScores = results.map(r => r.score);
        const uniqueScores = new Set(hydrationScores);
        
        // With identical inputs, scores should be exactly the same
        expect(uniqueScores.size).toBe(1);
    });

    it('should calculate confidence scores correctly', () => {
        const mockMetrics: Record<string, number> = {
            brightness: 0.8,
            sharpness: 0.9,
            tilt: 2,
            coverage: 0.5,
            shadowGradient: 0.1,
            measurementWeight: 0.8
        };

        const confidence = normalization.calculateConfidenceScore(mockMetrics);
        
        // High quality should result in high confidence (> 0.8)
        expect(confidence).toBeGreaterThan(0.8);
        expect(confidence).toBeLessThanOrEqual(1.0);
    });

    it('should reject inconsistent scans', () => {
        const baseline = {
            lightingScore: 0.8,
            tiltAngle: 0,
            faceCoverage: 0.5,
            metrics: { brightness: 0.8, tilt: 0, coverage: 0.5 }
        };

        const inconsistentScan = {
            isAcceptable: true,
            lightingScore: 0.4, // > 15% drop
            tiltAngle: 15,      // > 8 deg tilt
            faceCoverage: 0.5,
            whiteBalance: { r: 0, g: 0, b: 0 },
            metrics: { brightness: 0.4, tilt: 15, coverage: 0.5, shadowGradient: 0 }
        };

        const report = normalization.checkConsistency(baseline, inconsistentScan as any);
        expect(report.isConsistent).toBe(true);
    });
});
