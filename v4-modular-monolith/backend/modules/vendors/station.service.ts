// @ts-nocheck
import { getServiceClient } from '@/lib/supabase/server';
import { randomUUID } from 'crypto';

/**
 * Station Service
 * Manages retail station handoff tokens and scan registration
 * for in-store SkinMinder kiosks and partner stations.
 */
export interface StationScanRecord {
  scanId: string;
  stationId: string;
  sessionId: string;
  registeredAt: string;
  claimedBy?: string;
}

export class StationService {
  /**
   * Generate a handoff token for a completed scan to be claimed at a retail station
   */
  async generateHandoffToken(scanId: string): Promise<string> {
    const supabase = getServiceClient();
    const token = randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase();

    await supabase.from('station_handoff_tokens' as any).insert({
      scan_id: scanId,
      token,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h expiry
      created_at: new Date().toISOString(),
    });

    return token;
  }

  /**
   * Claim a scan at a retail station using a handoff token
   */
  async claimScan(token: string, userId: string): Promise<string | null> {
    const supabase = getServiceClient();

    // Find and validate token
    const { data: tokenData } = await supabase
      .from('station_handoff_tokens' as any)
      .select('scan_id, expires_at, claimed')
      .eq('token', token)
      .single();

    if (!tokenData) return null;
    if (tokenData.claimed) return null;
    if (new Date(tokenData.expires_at) < new Date()) return null;

    // Mark as claimed
    await supabase
      .from('station_handoff_tokens' as any)
      .update({ claimed: true, claimed_by: userId, claimed_at: new Date().toISOString() })
      .eq('token', token);

    return tokenData.scan_id;
  }

  /**
   * Register a scan at a retail station
   */
  async registerScan(scanId: string, stationId: string, sessionId: string): Promise<StationScanRecord> {
    const supabase = getServiceClient();

    const { data } = await supabase
      .from('station_scans' as any)
      .insert({
        scan_id: scanId,
        station_id: stationId,
        session_id: sessionId,
        registered_at: new Date().toISOString(),
      })
      .select()
      .single();

    return {
      scanId: data.scan_id,
      stationId: data.station_id,
      sessionId: data.session_id,
      registeredAt: data.registered_at,
      claimedBy: data.claimed_by,
    };
  }

  /**
   * Get all scans registered at a specific station
   */
  async getStationScans(stationId: string, limit = 50): Promise<StationScanRecord[]> {
    const supabase = getServiceClient();

    const { data } = await supabase
      .from('station_scans' as any)
      .select('scan_id, station_id, session_id, registered_at, claimed_by')
      .eq('station_id', stationId)
      .order('registered_at', { ascending: false })
      .limit(limit);

    if (!data) return [];

    return data.map((d: any) => ({
      scanId: d.scan_id,
      stationId: d.station_id,
      sessionId: d.session_id,
      registeredAt: d.registered_at,
      claimedBy: d.claimed_by,
    }));
  }
}
