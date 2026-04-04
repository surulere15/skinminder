/**
 * Station Service
 * 
 * Manages physical scan stations (kiosks) at retail locations.
 * Handles session tracking and offline-to-online scan handoffs.
 */

import { getServiceClient } from '@/lib/supabase/server';

export interface StationSession {
    id: string;
    stationId: string;
    staffId?: string;
    scanCount: number;
    startedAt: string;
}

export class StationService {
    /**
     * Creates a new station session for a kiosk.
     */
    async startSession(stationId: string, staffId?: string): Promise<string> {
        const supabase = getServiceClient();
        const { data, error } = await (supabase.from('station_sessions' as any) as any)
            .insert({
                station_id: stationId,
                staff_id: staffId,
                started_at: new Date().toISOString()
            })
            .select('id')
            .single();

        if (error) throw error;
        console.log(`[StationService] Started session ${data.id} for station ${stationId}`);
        return data.id;
    }

    /**
     * Links a scan to a station and increments the session scan count.
     */
    async registerScan(scanId: string, stationId: string, sessionId?: string): Promise<void> {
        const supabase = getServiceClient();
        
        // 1. Link scan to station
        await (supabase.from('skin_scans' as any) as any)
            .update({ station_id: stationId })
            .eq('id', scanId);

        // 2. Increment session counter
        if (sessionId) {
            await (supabase.rpc as any)('increment_station_scan_count', { session_id_param: sessionId });
        }
    }

    /**
     * Generates a claim token for a scan to enable QR handoff.
     */
    async generateHandoffToken(scanId: string): Promise<string> {
        const supabase = getServiceClient();
        const token = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        const { error } = await (supabase.from('scan_handoffs' as any) as any)
            .insert({
                scan_id: scanId,
                claim_token: token,
                expires_at: new Date(Date.now() + 1000 * 60 * 30).toISOString() // 30 min expiry
            });

        if (error) throw error;
        return token;
    }

    /**
     * Claims an anonymous station scan for a registered user.
     */
    async claimScan(token: string, userId: string): Promise<string> {
        const supabase = getServiceClient();
        
        // 1. Find the handoff and check expiry
        const { data: handoff, error: fetchError } = await (supabase.from('scan_handoffs' as any) as any)
            .select('scan_id, expires_at, claimed_at')
            .eq('claim_token', token)
            .single();

        if (fetchError || !handoff) throw new Error('Invalid or expired token');
        if (handoff.claimed_at) throw new Error('Token already claimed');
        if (new Date(handoff.expires_at) < new Date()) throw new Error('Token expired');

        // 2. Atomic claim & link
        const { error: claimError } = await (supabase.from('scan_handoffs' as any) as any)
            .update({ 
                claimed_at: new Date().toISOString(),
                claimed_by_user_id: userId
            })
            .eq('claim_token', token);

        if (claimError) throw claimError;

        // 3. Update scan owner
        await (supabase.from('skin_scans' as any) as any)
            .update({ user_id: userId })
            .eq('id', handoff.scan_id);

        return handoff.scan_id;
    }
}
