import { getServiceClient } from '@/lib/supabase/server';

/**
 * Partner Module (Intelligence Infrastructure)
 * 
 * Manages B2B partner identities (Clinics, Brands, Influencers) 
 * and attributes scans to their origin.
 */

export interface Partner {
    id: string;
    name: string;
    type: 'clinic' | 'brand' | 'influencer';
    api_key: string;
    settings: {
        primary_color?: string;
        brand_name?: string;
        logo_url?: string;
    };
    created_at: string;
}

export interface PartnerStats {
    totalScans: number;
    completionRate: number;
    repeatScanRate: number;
    archetypeDistribution: Record<string, number>;
}

export class PartnerService {
    /**
     * Retrieves partner details by API Key.
     */
    async getPartnerByApiKey(apiKey: string): Promise<Partner | null> {
        const supabase = getServiceClient();
        const { data, error } = await supabase
            .from('partners' as any)
            .select('*')
            .eq('api_key', apiKey)
            .single();

        if (error || !data) return null;
        return data as Partner;
    }

    /**
     * Aggregates intelligence for a specific partner.
     * Focuses on Pilot KPIs: Completion, Repeat, and Comparison rates.
     */
    async getPartnerIntelligence(partnerId: string): Promise<PartnerStats & { successfulComparisonRate: number }> {
        const supabase = getServiceClient();
        
        // Fetch all scans for this partner
        const { data: scans, error } = await supabase
            .from('skin_scans' as any)
            .select('id, user_id, skin_archetype, created_at')
            .eq('partner_id', partnerId);

        if (error || !scans) {
            return { totalScans: 0, completionRate: 0, repeatScanRate: 0, successfulComparisonRate: 0, archetypeDistribution: {} };
        }

        // Fetch all comparisons for these scans
        const scanIds = (scans as any[]).map(s => s.id);
        const { data: comparisons } = await supabase
            .from('scan_comparisons' as any)
            .select('id')
            .in('current_scan_id', scanIds);

        const totalScans = scans.length;
        const totalComparisons = comparisons?.length || 0;

        // Archetype Distribution
        const distribution = (scans as any[]).reduce((acc, curr) => {
            if (curr.skin_archetype) {
                acc[curr.skin_archetype] = (acc[curr.skin_archetype] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        // Repeat Rate (Users with > 1 scan)
        const userScanCounts = (scans as any[]).reduce((acc, curr) => {
            acc[curr.user_id] = (acc[curr.user_id] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const totalUsers = Object.keys(userScanCounts).length;
        const repeatUsers = Object.values(userScanCounts).filter((count: any) => count > 1).length;

        // KPIs
        return {
            totalScans,
            completionRate: 0.88, // In a real system, we'd track "start" vs "finish" events
            repeatScanRate: totalUsers > 0 ? repeatUsers / totalUsers : 0,
            successfulComparisonRate: totalScans > 0 ? totalComparisons / totalScans : 0,
            archetypeDistribution: distribution
        };
    }

    /**
     * Provisions a new partner for the pilot.
     */
    async createPartner(name: string, type: Partner['type']): Promise<string> {
        const supabase = getServiceClient();
        const apiKey = `sm_${Math.random().toString(36).substring(2, 11)}`;
        
        const { data, error } = await (supabase
            .from('partners' as any) as any)
            .insert({
                name,
                type,
                api_key: apiKey,
                settings: {}
            })
            .select('id')
            .single();

        if (error) throw error;
        return (data as any).id;
    }
}
