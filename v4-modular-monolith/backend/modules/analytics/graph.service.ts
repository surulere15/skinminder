// @ts-nocheck
import { getServiceClient } from '@/lib/supabase/server';

/**
 * Graph Service
 * Manages the skin knowledge graph: scan-product relationships,
 * environmental data, and intelligence edges.
 */
export class GraphService {
  async linkScanToProducts(scanId: string, userId: string, phase: string): Promise<void> {
    const supabase = getServiceClient();

    const { data: scan } = await supabase
      .from('skin_scans' as any)
      .select('product_recommendations, skin_archetype')
      .eq('id', scanId)
      .single();

    if (!scan?.product_recommendations) return;

    const products = scan.product_recommendations as Array<{ productId: string; role: string }>;

    const inserts = products.map(p => ({
      scan_id: scanId,
      user_id: userId,
      product_id: p.productId,
      phase,
      role: p.role,
      created_at: new Date().toISOString(),
    }));

    await supabase.from('scan_product_edges' as any).insert(inserts);
  }

  async recordEnvironment(env: {
    scanId: string;
    humidity: number;
    uvIndex: number;
    temperature: number;
    pollution?: string;
    location?: string;
  }): Promise<string> {
    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from('scan_environments' as any)
      .insert({
        scan_id: env.scanId,
        humidity: env.humidity,
        uv_index: env.uvIndex,
        temperature: env.temperature,
        pollution: env.pollution || null,
        location: env.location || null,
        recorded_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to record environment: ${error.message}`);
    return (data as any).id;
  }

  async recordEdge(edge: {
    fromId: string;
    toId: string;
    type: string;
    weight?: number;
    metadata?: Record<string, any>;
  }): Promise<void> {
    const supabase = getServiceClient();

    await supabase.from('skin_graph_edges' as any).insert({
      from_id: edge.fromId,
      to_id: edge.toId,
      edge_type: edge.type,
      weight: edge.weight ?? 1.0,
      metadata: edge.metadata || {},
      created_at: new Date().toISOString(),
    });
  }

  async getEdges(fromId: string, type?: string): Promise<Array<{
    fromId: string;
    toId: string;
    type: string;
    weight: number;
    metadata: Record<string, any>;
  }>> {
    const supabase = getServiceClient();

    let query = supabase
      .from('skin_graph_edges' as any)
      .select('from_id, to_id, edge_type, weight, metadata')
      .eq('from_id', fromId);

    if (type) query = query.eq('edge_type', type);

    const { data } = await query;
    if (!data) return [];

    return data.map((d: any) => ({
      fromId: d.from_id,
      toId: d.to_id,
      type: d.edge_type,
      weight: d.weight,
      metadata: d.metadata || {},
    }));
  }
}
