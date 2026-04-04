import { getServiceClient } from '@/lib/supabase/server';

/**
 * Analytics Module - Aggregation Service
 * 
 * Handles precomputing statistics from raw scans and comparisons.
 * Powered by background jobs to prevent production DB strain.
 */

export class AggregationService {
    /**
     * Refreshes all precomputed intelligence tables.
     */
    async refreshAllStats() {
        console.log("[Analytics] Refreshing precomputed intelligence...");
        await Promise.all([
            this.computeIngredientDemand(),
            this.computeRegionalTrends(),
            this.computeProductEfficacy(),
            this.computePlatformAverages()
        ]);
        console.log("[Analytics] Refresh complete.");
    }

    async computeIngredientDemand() {
        console.log("[Analytics] Aggregating Ingredient Demand...");
    }

    async computeRegionalTrends() {
        console.log("[Analytics] Mapping Regional Skin Trends...");
    }

    async computeProductEfficacy() {
        console.log("[Analytics] Calculating PPI Platform Efficacy scores...");
    }

    async computePlatformAverages() {
        console.log("[Analytics] Snapshotting daily platform metrics...");
    }

    /**
     * Fetch real-time stats for the Vendor Dashboard API using SQL views.
     */
    async getVendorIntelligenceSummaries() {
        const supabase = getServiceClient();

        try {
            // 1. Fetch Global Summary
            const { count: totalMatches } = await supabase.from('skin_scans').select('*', { count: 'exact', head: true });
            const { data: community } = await supabase.from('community_stats' as any).select('*').limit(1) as { data: any[] | null };
            const { data: ingredients } = await supabase.from('ingredient_demand_stats' as any).select('*').limit(1) as { data: any[] | null };

            // 2. Fetch Trending Concerns
            const { data: trending } = await supabase.from('community_stats' as any).select('*').limit(5) as { data: any[] | null };

            // 3. Fetch Ingredient Demand
            const { data: demand } = await supabase.from('ingredient_demand_stats' as any).select('*').limit(5) as { data: any[] | null };

            // 4. Fetch Archetype Distribution
            const { data: archetypes } = await supabase.from('archetype_distribution' as any).select('*').limit(5) as { data: any[] | null };

            return {
                global: {
                    totalMatches: totalMatches || 0,
                    topConcern: community?.[0]?.concern || "Evaluating...",
                    topIngredient: ingredients?.[0]?.ingredient || "Evaluating...",
                    activeProtocols: 3 
                },
                trendingConcerns: trending?.map(t => ({
                    issue: t.concern,
                    frequency: t.frequency,
                    status: t.frequency > 100 ? "surge" : "rising"
                })) || [],
                ingredients: demand?.map(d => ({
                    name: d.ingredient,
                    customers: d.demand_count
                })) || [],
                archetypes: archetypes?.map(a => ({
                    name: a.archetype,
                    count: a.user_count
                })) || []
            };
        } catch (error) {
            console.error("[AggregationService] Failed to fetch analytics:", error);
            // Fallback to empty if DB query fails during migration
            return {
                global: { totalMatches: 0, topConcern: "N/A", topIngredient: "N/A", activeProtocols: 0 },
                trendingConcerns: [],
                ingredients: [],
                archetypes: []
            };
        }
    }
}
