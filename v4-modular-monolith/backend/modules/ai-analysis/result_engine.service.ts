import { InterpretationLayer, MetricInterpretation } from './interpretation.layer';

/**
 * Result Engine Service - V2.1 (Dermatologist-Grade Refinement)
 * 
 * Implements the 3-Layer Result Engine:
 * 1. Measurement Layer (Computer Vision)
 * 2. Interpretation Layer (Deterministic Rules)
 * 3. Recommendation Layer (LLM Narration)
 */

export interface RegionalMetric {
    score: number;
    severity: "healthy" | "mild" | "moderate" | "severe";
}

export interface SkinRegionalMetrics {
    forehead: { texture: RegionalMetric; hydration: RegionalMetric };
    left_cheek: { pigmentation: RegionalMetric; redness: RegionalMetric };
    right_cheek: { pigmentation: RegionalMetric; redness: RegionalMetric };
    nose: { oil: RegionalMetric; pores: RegionalMetric };
    chin: { texture: RegionalMetric; oil: RegionalMetric };
}

export interface SkinMetrics {
    global_hydration: number;
    global_pigmentation: number;
    global_texture: number;
    global_oil: number;
    redness_index: number;
    pore_visibility: number;
    regions?: SkinRegionalMetrics; 
}

export interface SkinInterpretation {
    hydration: MetricInterpretation;
    pigmentation: MetricInterpretation;
    texture: MetricInterpretation;
    oil_balance: MetricInterpretation;
    archetype: { main: string; subtype: string };
    environment: {
        humidity: number;
        uv_index: number;
        pollution: string;
        context: string;
    };
    regions?: SkinRegionalMetrics;
    confidence: {
        score: number;
        lighting: "poor" | "fair" | "good" | "optimal";
        stability: "low" | "medium" | "high";
    };
    nextComparison?: {
        days: number;
        label: string;
        goal: string;
    };
    populationInsights?: {
        hydrationPercentile: number;
        pigmentationPercentile: number;
        archetypeDistribution: number;
    };
    skinTwinCount?: number;
}

import { BenchmarkService } from '../intelligence/benchmark.service';
import { SkinTwinService } from '../intelligence/skin_twin.service';

export class ResultEngineService {
    private interpretationLayer = new InterpretationLayer();
    private benchmarks = new BenchmarkService();
    private skinTwins = new SkinTwinService();

    /**
     * Interprets raw visions results into a human-readable report.
     */
    async interpret(results: SkinMetrics, quality: any, location: string): Promise<SkinInterpretation> {
        const hydration = this.interpretationLayer.interpretHydration(results.global_hydration);
        const pigmentation = this.interpretationLayer.interpretPigmentation(results.global_pigmentation);
        const texture = this.interpretationLayer.interpretTexture(results.global_texture);
        const oil_balance = this.interpretationLayer.interpretOilBalance(results.global_oil);
        
        const archetype = this.calculateArchetype(results);
        const environment = this.getEnvironmentalData(location);
        const regions = results.regions || this.segmentRegions(results);

        // Network Effect: Population Intelligence & Twin Matching
        const hydPercentile = await this.benchmarks.calculateCohortPercentile('hydration_score', results.global_hydration, { archetype: archetype.main });
        const pigPercentile = await this.benchmarks.calculateCohortPercentile('pigmentation_score', results.global_pigmentation, { archetype: archetype.main });
        const twinResult = await this.skinTwins.findTwins('current-user', { 
          hydration: results.global_hydration, 
          pigmentation: results.global_pigmentation, 
          texture: results.global_texture,
          oilBalance: results.global_oil,
          irritation: 0.5,
          elasticity: 0.7
        });

        // North Star: Behavioral Design (Anticipation Loop)
        const nextComparison = this.calculateNextCheckWindow(results);

        return {
            hydration,
            pigmentation,
            texture,
            oil_balance,
            archetype,
            environment,
            regions,
            nextComparison,
            populationInsights: {
                hydrationPercentile: hydPercentile,
                pigmentationPercentile: pigPercentile,
                archetypeDistribution: 18 // Mocking PIH distribution
            },
            skinTwinCount: twinResult.twinCount,
            confidence: {
                score: Number((quality.lightingScore * 0.7 + quality.sharpnessScore * 0.3).toFixed(2)),
                lighting: this.getQualityLabel(quality.lightingScore),
                stability: quality.sharpnessScore > 0.8 ? "high" : "medium"
            }
        };
    }

    private calculateNextCheckWindow(results: SkinMetrics) {
        // Create anticipation for specific outcomes
        if (results.redness_index > 40) return { days: 3, label: "Barrier Recovery Measurement", goal: "Measure irritation reduction" };
        if (results.global_hydration < 50) return { days: 7, label: "Hydration Stability Check", goal: "Verify moisture-barrier improvement" };
        if (results.global_pigmentation < 45) return { days: 28, label: "Tone Uniformity Audit", goal: "Measure active ingredient efficacy" };
        
        return { days: 14, label: "Routine Maintenance Scan", goal: "Track overall health baseline" };
    }

    /**
     * Segments global metrics into regional scores with variance.
     * In Production, this is handled by a dedicated region-aware ML model.
     */
    private segmentRegions(metrics: SkinMetrics): SkinRegionalMetrics {
        const variance = () => (Math.random() * 10 - 5); // +/- 5% variance
        
        const mapSeverity = (score: number): "healthy" | "mild" | "moderate" | "severe" => {
            const sev = this.interpretationLayer.getSeverityFromScore(score);
            if (sev === "optimal") return "healthy";
            if (sev === "mild") return "mild";
            return "moderate";
        };
        
        const m = (score: number) => ({ 
            score: score + variance(), 
            severity: mapSeverity(score + variance()) 
        });

        return {
            forehead: { 
                texture: m(metrics.global_texture), 
                hydration: m(metrics.global_hydration) 
            },
            left_cheek: { 
                pigmentation: m(metrics.global_pigmentation), 
                redness: m(metrics.redness_index) 
            },
            right_cheek: { 
                pigmentation: m(metrics.global_pigmentation), 
                redness: m(metrics.redness_index) 
            },
            nose: { 
                oil: m(metrics.global_oil + 10), // Nose usually has +10% oil
                pores: m(metrics.pore_visibility) 
            },
            chin: { 
                texture: m(metrics.global_texture), 
                oil: m(metrics.global_oil) 
            }
        };
    }

    private getQualityLabel(score: number): any {
        if (score > 0.85) return "optimal";
        if (score > 0.7) return "good";
        if (score > 0.5) return "fair";
        return "poor";
    }

    private getSeverityTier(type: string, score: number): { label: string; severity: string } {
        // High score = healthy/stable (except for redness/inflammation)
        if (score > 80) return { label: `excellent ${type}`, severity: "optimal" };
        if (score > 60) return { label: `healthy ${type}`, severity: "stable" };
        if (score > 45) return { label: `mild ${type} imbalance`, severity: "mild" };
        if (score > 30) return { label: `moderate ${type} risk`, severity: "moderate" };
        return { label: `severe ${type} concern`, severity: "severe" };
    }

    /**
     * Archetype Classification Logic with Subtypes
     */
    private calculateArchetype(metrics: SkinMetrics): { main: string; subtype: string } {
        const { global_hydration, global_pigmentation, global_oil, redness_index, global_texture } = metrics;

        // 1. Barrier Sensitive
        if (global_hydration < 50 && redness_index > 25) {
            return { 
                main: "Barrier Sensitive", 
                subtype: global_hydration < 35 ? "Dehydration-driven" : "Inflammation-prone" 
            };
        }

        // 2. PIH Prone
        if (global_pigmentation < 45) {
            return { 
                main: "PIH Prone", 
                subtype: "UV-reactive clustering" 
            };
        }

        // 3. Sebum Reactive
        if (global_oil > 65) {
            return { 
                main: "Sebum Reactive", 
                subtype: global_hydration < 45 ? "Congestion-prone" : "Lipid-rich" 
            };
        }

        // 4. Melanin Resilient
        if (global_pigmentation > 75) {
            return { 
                main: "Melanin Resilient", 
                subtype: "High-tonality stability" 
            };
        }

        // 5. Texture Fragile
        if (global_texture < 55) {
            return { 
                main: "Texture Fragile", 
                subtype: "Fine-line risk" 
            };
        }

        return { main: "Balanced Skin", subtype: "Maintenance focus" };
    }

    private getEnvironmentalData(location?: string): SkinInterpretation["environment"] {
        const loc = location?.toLowerCase() || "unknown";
        
        // Mocking real-time environmental metrics based on location
        if (loc.includes("lagos") || loc.includes("tropical")) {
            return {
                humidity: 82,
                uv_index: 9,
                pollution: "Moderate",
                context: "High humidity and UV levels stimulate melanocyte activity and lipid production."
            };
        }

        if (loc.includes("london") || loc.includes("cool")) {
            return {
                humidity: 45,
                uv_index: 2,
                pollution: "High",
                context: "Dry air and urban pollutants can compromise the outer moisture barrier."
            };
        }

        return {
            humidity: 55,
            uv_index: 5,
            pollution: "Low",
            context: "Stable temperate climate with minimal environmental stress."
        };
    }
}
