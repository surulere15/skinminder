import { getServiceClient } from '@/lib/supabase/server';

export interface PhenotypeTag {
    id: string;
    confidence: number;
}

/**
 * Phenotype Service (Stage 1)
 * Implements deterministic, rule-based tagging of skins into collective phenotypes.
 * This is the foundation for future unsupervised clustering.
 */
export class PhenotypeService {
    /**
     * Assigns phenotypes based on deterministic skin metrics and environmental context.
     */
    assignPhenotypes(metrics: any, environment: any): PhenotypeTag[] {
        const tags: PhenotypeTag[] = [];

        // Rule 1: UV Reactive Melanin
        if (metrics.global_pigmentation < 45 && environment.uv_index > 6) {
            tags.push({ id: 'UV_REACTIVE_MELANIN', confidence: 0.85 });
        }

        // Rule 2: Barrier Dehydrated
        if (metrics.global_hydration < 45 && metrics.redness_index > 25) {
            tags.push({ id: 'BARRIER_DEHYDRATED', confidence: 0.92 });
        }

        // Rule 3: Humidity-Reactive Sebum
        if (metrics.global_oil > 60 && environment.humidity > 70) {
            tags.push({ id: 'SEBUM_REACTIVE_HUMID', confidence: 0.88 });
        }

        // Rule 4: Texture Fragile
        if (metrics.global_texture < 50) {
            tags.push({ id: 'TEXTURE_FRAGILE_AGING', confidence: 0.75 });
        }

        return tags;
    }

    /**
     * Persists phenotype tags to the database.
     */
    async recordPhenotypes(scanId: string, tags: PhenotypeTag[]) {
        if (tags.length === 0) return;

        const supabase = getServiceClient();
        const records = tags.map(t => ({
            scan_id: scanId,
            phenotype_id: t.id,
            confidence: t.confidence
        }));

        const { error } = await (supabase
            .from('scan_phenotypes' as any)
            .insert(records as any) as any);

        if (error) console.error(`[PhenotypeService] Failed to record phenotypes for scan ${scanId}:`, error);
    }
}
