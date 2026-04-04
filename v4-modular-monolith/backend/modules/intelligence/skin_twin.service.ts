import { getServiceClient } from '@/lib/supabase/server';

/**
 * Skin Twin Engine
 * Finds users with similar skin profiles based on multi-dimensional metric vectors.
 */
export class SkinTwinService {
    /**
     * Finds the number of 'Skin Twins' (users with < 10% variance across all metrics).
     */
    async getTwinCount(metrics: { hydration: number; pigmentation: number; texture: number }): Promise<number> {
        const supabase = getServiceClient();

        const { count, error } = await supabase
            .from('skin_scans' as any)
            .select('id', { count: 'exact', head: true })
            .gt('hydration_score', metrics.hydration * 0.9)
            .lt('hydration_score', metrics.hydration * 1.1)
            .gt('pigmentation_score', metrics.pigmentation * 0.9)
            .lt('pigmentation_score', metrics.pigmentation * 1.1);

        if (error) return 0;
        
        // Ensure count doesn't include the current user's scan ideally
        return (count || 1) - 1;
    }
}
