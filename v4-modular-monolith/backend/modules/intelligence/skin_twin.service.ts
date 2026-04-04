import { getServiceClient } from '@/lib/supabase/server';

export interface SkinTwinMetrics {
  hydration: number;
  pigmentation: number;
  texture: number;
  oilBalance: number;
  irritation: number;
  elasticity: number;
}

export interface SkinTwinResult {
  twinCount: number;
  similarityScore: number;
  closestTwins: Array<{
    userId: string;
    similarityScore: number;
    sharedConcerns: string[];
  }>;
  archetypeMatch: string;
}

export interface TwinCluster {
  clusterId: string;
  archetype: string;
  memberCount: number;
  averageMetrics: SkinTwinMetrics;
  topConcerns: string[];
  recommendedIngredients: string[];
}

/**
 * Skin Twin Engine V2
 * Finds users with similar skin profiles based on multi-dimensional metric vectors.
 * Builds data moat through aggregated outcome data.
 */
export class SkinTwinService {
  /**
   * Calculate similarity score between two skin profiles (0-100)
   */
  private calculateSimilarity(a: SkinTwinMetrics, b: SkinTwinMetrics): number {
    const weights = {
      hydration: 0.20,
      pigmentation: 0.20,
      texture: 0.20,
      oilBalance: 0.15,
      irritation: 0.10,
      elasticity: 0.15,
    };

    const differences = {
      hydration: Math.abs(a.hydration - b.hydration),
      pigmentation: Math.abs(a.pigmentation - b.pigmentation),
      texture: Math.abs(a.texture - b.texture),
      oilBalance: Math.abs(a.oilBalance - b.oilBalance),
      irritation: Math.abs(a.irritation - b.irritation),
      elasticity: Math.abs(a.elasticity - b.elasticity),
    };

    const weightedDiff = 
      differences.hydration * weights.hydration +
      differences.pigmentation * weights.pigmentation +
      differences.texture * weights.texture +
      differences.oilBalance * weights.oilBalance +
      differences.irritation * weights.irritation +
      differences.elasticity * weights.elasticity;

    return Math.max(0, 100 - (weightedDiff * 100));
  }

  /**
   * Find skin twins for a given user profile
   */
  async findTwins(
    userId: string,
    metrics: SkinTwinMetrics,
    limit = 5
  ): Promise<SkinTwinResult> {
    const supabase = getServiceClient();

    // Get recent scans from other users (anonymized)
    const { data: scans } = await supabase
      .from('skin_scans' as any)
      .select(`
        user_id,
        hydration_score,
        pigmentation_score,
        texture_score,
        oil_balance,
        irritation_probability,
        skin_age_estimate,
        primary_concerns,
        skin_archetype
      `)
      .neq('user_id', userId)
      .not('user_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(500);

    if (!scans || scans.length === 0) {
      return {
        twinCount: 0,
        similarityScore: 0,
        closestTwins: [],
        archetypeMatch: 'Finding your community...',
      };
    }

    // Calculate similarity scores with proper typing
    const scanData = scans as Array<{
      user_id: string;
      hydration_score?: number;
      pigmentation_score?: number;
      texture_score?: number;
      oil_balance?: number;
      irritation_probability?: number;
      skin_age_estimate?: number;
      primary_concerns?: string[];
      skin_archetype?: string;
    }>;
    
    const scoredTwins = scanData.map(scan => ({
      userId: scan.user_id,
      similarityScore: this.calculateSimilarity(metrics, {
        hydration: scan.hydration_score || 0.5,
        pigmentation: scan.pigmentation_score || 0.5,
        texture: scan.texture_score || 0.5,
        oilBalance: scan.oil_balance || 0.5,
        irritation: scan.irritation_probability || 0.5,
        elasticity: (scan.skin_age_estimate || 30) / 100,
      }),
      concerns: scan.primary_concerns || [],
      archetype: scan.skin_archetype || 'Unknown',
    }));

    // Sort by similarity and take top matches (>60% similar)
    const matches = scoredTwins
      .filter(t => t.similarityScore >= 60)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);

    // Find archetype match
    const archetypeCounts: Record<string, number> = {};
    matches.forEach(m => {
      archetypeCounts[m.archetype] = (archetypeCounts[m.archetype] || 0) + 1;
    });
    const archetypeMatch = Object.entries(archetypeCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Building your community...';

    // Calculate average similarity
    const avgSimilarity = matches.length > 0
      ? Math.round(matches.reduce((sum, m) => sum + m.similarityScore, 0) / matches.length)
      : 0;

    // Find shared concerns
    const sharedConcerns = matches.reduce((acc, m) => {
      m.concerns.forEach((c: string) => {
        acc[c] = (acc[c] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const topSharedConcerns = Object.entries(sharedConcerns)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([concern]) => concern);

    return {
      twinCount: matches.length,
      similarityScore: avgSimilarity,
      closestTwins: matches.map(m => ({
        userId: m.userId.substring(0, 8) + '...', // Anonymized
        similarityScore: m.similarityScore,
        sharedConcerns: topSharedConcerns,
      })),
      archetypeMatch,
    };
  }

  /**
   * Get skin twin clusters for analytics
   */
  async getClusters(concern?: string): Promise<TwinCluster[]> {
    const supabase = getServiceClient();

    let query = supabase
      .from('skin_scans' as any)
      .select(`
        skin_archetype,
        hydration_score,
        pigmentation_score,
        texture_score,
        oil_balance,
        primary_concerns
      `)
      .not('skin_archetype', 'is', null);

    const { data } = await query;

    if (!data) return [];

    const clusterData = data as Array<{
      skin_archetype: string;
      hydration_score?: number;
      pigmentation_score?: number;
      texture_score?: number;
      oil_balance?: number;
      irritation_probability?: number;
      primary_concerns?: string[];
    }>;

    // Group by archetype
    const clusters: Record<string, typeof clusterData> = {};
    clusterData.forEach(scan => {
      const archetype = scan.skin_archetype || 'Unknown';
      if (!clusters[archetype]) clusters[archetype] = [];
      clusters[archetype].push(scan);
    });

    return Object.entries(clusters).map(([archetype, scans]) => {
      const metrics = scans.reduce(
        (acc, s) => ({
          hydration: acc.hydration + (s.hydration_score || 0.5),
          pigmentation: acc.pigmentation + (s.pigmentation_score || 0.5),
          texture: acc.texture + (s.texture_score || 0.5),
          oilBalance: acc.oilBalance + (s.oil_balance || 0.5),
          irritation: acc.irritation + (s.irritation_probability || 0.5),
          elasticity: acc.elasticity + 0.7,
        }),
        { hydration: 0, pigmentation: 0, texture: 0, oilBalance: 0, irritation: 0, elasticity: 0 }
      );

      const count = scans.length;
      return {
        clusterId: archetype.toLowerCase().replace(/\s+/g, '-'),
        archetype,
        memberCount: count,
        averageMetrics: {
          hydration: Math.round(metrics.hydration / count * 100) / 100,
          pigmentation: Math.round(metrics.pigmentation / count * 100) / 100,
          texture: Math.round(metrics.texture / count * 100) / 100,
          oilBalance: Math.round(metrics.oilBalance / count * 100) / 100,
          irritation: Math.round(metrics.irritation / count * 100) / 100,
          elasticity: Math.round(metrics.elasticity / count * 100) / 100,
        },
        topConcerns: scans.flatMap(s => s.primary_concerns || []).slice(0, 5),
        recommendedIngredients: this.getClusterIngredients(archetype),
      };
    });
  }

  private getClusterIngredients(archetype: string): string[] {
    const ingredientMap: Record<string, string[]> = {
      'Dehydration Prone': ['hyaluronic acid', 'glycerin', 'ceramides'],
      'Oily Reactive': ['niacinamide', 'salicylic acid', 'zinc'],
      'Sensitive Shield': ['centella asiatica', 'allantoin', 'oat extract'],
      'Balanced Skin': ['vitamin c', 'peptides', 'green tea'],
      'PIH Prone': ['azelaic acid', 'vitamin c', 'tranexamic acid'],
      'Aging Gracefully': ['retinol', 'peptides', 'collagen'],
    };
    return ingredientMap[archetype] || ['hyaluronic acid', 'niacinamide'];
  }
}
