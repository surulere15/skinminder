import { getServiceClient } from '@/lib/supabase/server';

export interface VendorIntelligenceSummary {
  vendorId: string;
  vendorName: string;
  totalMatches: number;
  totalViews: number;
  conversionRate: number;
  topArchetype: string;
  avgMatchScore: number;
}

/**
 * Aggregation Service
 * Aggregates analytics data across vendors, products, and user cohorts.
 */
export class AggregationService {
  /**
   * Get intelligence summaries for all vendors
   */
  async getVendorIntelligenceSummaries(): Promise<VendorIntelligenceSummary[]> {
    const supabase = getServiceClient();

    const { data: matches } = await supabase
      .from('product_matches' as any)
      .select(`
        vendor_id,
        vendors(name),
        match_score,
        converted
      `);

    if (!matches || matches.length === 0) return [];

    const vendorMap: Record<string, VendorIntelligenceSummary> = {};

    for (const match of matches as Array<{
      vendor_id: string;
      vendors: { name: string } | null;
      match_score: number;
      converted: boolean;
    }>) {
      const id = match.vendor_id;
      if (!vendorMap[id]) {
        vendorMap[id] = {
          vendorId: id,
          vendorName: match.vendors?.name || 'Unknown',
          totalMatches: 0,
          totalViews: 0,
          conversionRate: 0,
          topArchetype: 'Unknown',
          avgMatchScore: 0,
        };
      }

      const v = vendorMap[id];
      v.totalMatches++;
      v.avgMatchScore = (v.avgMatchScore * (v.totalMatches - 1) + (match.match_score || 0)) / v.totalMatches;
      if (match.converted) v.totalViews++;
    }

    // Calculate conversion rates
    return Object.values(vendorMap).map(v => ({
      ...v,
      conversionRate: v.totalMatches > 0 ? Math.round((v.totalViews / v.totalMatches) * 100) / 100 : 0,
      avgMatchScore: Math.round(v.avgMatchScore * 100) / 100,
    }));
  }

  /**
   * Get cohort-level analytics for a given archetype
   */
  async getCohortAnalytics(archetype: string): Promise<{
    memberCount: number;
    avgHydration: number;
    avgPigmentation: number;
    topConcerns: string[];
  }> {
    const supabase = getServiceClient();

    const { data } = await supabase
      .from('skin_scans' as any)
      .select('hydration_score, pigmentation_score, primary_concerns, skin_archetype')
      .eq('skin_archetype', archetype);

    if (!data || data.length === 0) {
      return { memberCount: 0, avgHydration: 0, avgPigmentation: 0, topConcerns: [] };
    }

    const scans = data as Array<{
      hydration_score?: number;
      pigmentation_score?: number;
      primary_concerns?: string[];
    }>;

    const concernCount: Record<string, number> = {};
    let totalHydration = 0;
    let totalPigmentation = 0;

    for (const scan of scans) {
      totalHydration += scan.hydration_score || 0;
      totalPigmentation += scan.pigmentation_score || 0;
      for (const c of scan.primary_concerns || []) {
        concernCount[c] = (concernCount[c] || 0) + 1;
      }
    }

    const count = scans.length;
    const topConcerns = Object.entries(concernCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([c]) => c);

    return {
      memberCount: count,
      avgHydration: Math.round((totalHydration / count) * 100) / 100,
      avgPigmentation: Math.round((totalPigmentation / count) * 100) / 100,
      topConcerns,
    };
  }
}
