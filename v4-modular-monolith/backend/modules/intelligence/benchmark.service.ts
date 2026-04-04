import { getServiceClient } from '@/lib/supabase/server';

/**
 * Benchmark Service
 * Calculates user percentiles within specific cohorts (Archetype, Climate).
 * Drives the "Population Intelligence" layer.
 */
export class BenchmarkService {
    /**
     * Calculates the percentile rank for a given metric value within a cohort.
     */
    async calculateCohortPercentile(
        metric: 'hydration_score' | 'pigmentation_score' | 'texture_score',
        value: number,
        filters: { archetype?: string; climate?: string }
    ): Promise<number> {
        const supabase = getServiceClient();

        let query = supabase
            .from('skin_scans' as any)
            .select(metric);

        if (filters.archetype) {
            query = query.contains('alignment_metadata', { archetype: filters.archetype });
        }
        
        // In production, climate would be a column or resolved from weather API
        // For the pilot, we assume climate is part of the metadata
        if (filters.climate) {
            query = query.contains('alignment_metadata', { climate: filters.climate });
        }

        const { data, error } = await query;

        if (error || !data || data.length === 0) return 50; // Default to median

        const scores = data.map(d => d[metric]).sort((a, b) => a - b);
        const count = scores.filter(s => s < value).length;
        
        return Math.round((count / scores.length) * 100);
    }

    /**
     * Returns the global distribution of skin archetypes.
     */
    async getGlobalDistribution(): Promise<Record<string, number>> {
        // Mocking aggregate data for the pilot phase
        return {
            "Barrier Sensitive": 22,
            "PIH Prone": 18,
            "Sebum Reactive": 25,
            "Melanin Resilient": 20,
            "Texture Fragile": 15
        };
    }
}
