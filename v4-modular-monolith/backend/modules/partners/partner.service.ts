// @ts-nocheck
import { getServiceClient } from '@/lib/supabase/server';

export interface Partner {
  id: string;
  name: string;
  settings: Record<string, any>;
}

export interface PartnerStats {
  totalViews: number;
  totalMatches: number;
  totalConversions: number;
  conversionRate: number;
  totalScans: number;
  completionRate: number;
  repeatScanRate: number;
  archetypeDistribution: Record<string, number>;
}

/**
 * Partner Service
 * Manages brand/partner accounts, analytics, and intelligence data.
 */
export class PartnerService {
  /**
   * Look up a partner by their API key
   */
  async getPartnerByApiKey(key: string): Promise<Partner | null> {
    const supabase = getServiceClient();

    const { data } = await (supabase
      .from('partners' as any)
      .select('id, name, settings, api_key')
      .eq('api_key', key)
      .single() as Promise<{ data: { id: string; name: string; settings: Record<string, any> } | null }>);

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      settings: data.settings || {},
    };
  }

  /**
   * Get comprehensive stats for a partner
   */
  async getPartnerStats(partnerId: string): Promise<PartnerStats> {
    const supabase = getServiceClient();

    // Get product match data
    const { data: matches } = await (supabase
      .from('product_matches' as any)
      .select('converted, scan_id')
      .eq('vendor_id', partnerId) as Promise<{ data: Array<{ converted: boolean; scan_id: string }> | null }>);

    // Get scan data for this partner's users
    const { data: scans } = await (supabase
      .from('skin_scans' as any)
      .select('user_id, status, skin_archetype')
      .eq('vendor_id', partnerId) as Promise<{ data: Array<{ user_id: string; status: string; skin_archetype: string }> | null }>);

    const totalMatches = matches?.length || 0;
    const totalConversions = matches?.filter(m => m.converted).length || 0;
    const conversionRate = totalMatches > 0 ? Math.round((totalConversions / totalMatches) * 10000) / 100 : 0;

    // Calculate completion rate (completed scans / total scans)
    const totalScans = scans?.length || 0;
    const completedScans = scans?.filter(s => s.status === 'completed').length || 0;
    const completionRate = totalScans > 0 ? Math.round((completedScans / totalScans) * 10000) / 100 : 0;

    // Calculate repeat scan rate
    const userScanCounts: Record<string, number> = {};
    scans?.forEach(s => {
      userScanCounts[s.user_id] = (userScanCounts[s.user_id] || 0) + 1;
    });
    const repeatUsers = Object.values(userScanCounts).filter(c => c > 1).length;
    const uniqueUsers = Object.keys(userScanCounts).length;
    const repeatScanRate = uniqueUsers > 0 ? Math.round((repeatUsers / uniqueUsers) * 10000) / 100 : 0;

    // Archetype distribution
    const archetypeCounts: Record<string, number> = {};
    scans?.forEach(s => {
      if (s.skin_archetype) {
        archetypeCounts[s.skin_archetype] = (archetypeCounts[s.skin_archetype] || 0) + 1;
      }
    });

    // Normalize to percentages
    const archetypeDistribution: Record<string, number> = {};
    for (const [arch, count] of Object.entries(archetypeCounts)) {
      archetypeDistribution[arch] = Math.round((count / totalScans) * 10000) / 100;
    }

    return {
      totalViews: totalMatches,
      totalMatches,
      totalConversions,
      conversionRate,
      totalScans,
      completionRate,
      repeatScanRate,
      archetypeDistribution,
    };
  }

  /**
   * Get partner intelligence (alias for stats with additional insights)
   */
  async getPartnerIntelligence(partnerId: string): Promise<PartnerStats> {
    return this.getPartnerStats(partnerId);
  }

  /**
   * Get top-performing products for a partner
   */
  async getTopProducts(partnerId: string, limit = 10): Promise<Array<{
    productId: string;
    productName: string;
    matchCount: number;
    conversionRate: number;
  }>> {
    const supabase = getServiceClient();

    const { data } = await (supabase
      .from('product_matches' as any)
      .select('product_id, product_name, converted')
      .eq('vendor_id', partnerId)
      .limit(1000) as Promise<{ data: Array<{ product_id: string; product_name: string; converted: boolean }> | null }>);

    if (!data) return [];

    const productMap: Record<string, { matches: number; conversions: number; name: string }> = {};

    for (const row of data as Array<{
      product_id: string;
      product_name: string;
      converted: boolean;
    }>) {
      if (!productMap[row.product_id]) {
        productMap[row.product_id] = { matches: 0, conversions: 0, name: row.product_name || 'Unknown' };
      }
      productMap[row.product_id].matches++;
      if (row.converted) productMap[row.product_id].conversions++;
    }

    return Object.entries(productMap)
      .map(([id, p]) => ({
        productId: id,
        productName: p.name,
        matchCount: p.matches,
        conversionRate: Math.round((p.conversions / p.matches) * 10000) / 100,
      }))
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, limit);
  }
}
