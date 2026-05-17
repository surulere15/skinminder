// @ts-nocheck
import { getServiceClient } from '@/lib/supabase/server';
import { randomUUID } from 'crypto';

/**
 * Scans Module
 * 
 * Main controller for the scan lifecycle (Upload -> Queue -> Result).
 */
export class ScanController {
  /**
   * Generate a presigned upload URL for a new scan
   */
  async requestUploadUrl(userId: string): Promise<{
    uploadUrl: string;
    scanId: string;
    expiresAt: string;
  }> {
    const supabase = getServiceClient();
    const scanId = randomUUID();
    const filePath = `scans/${userId}/${scanId}.jpg`;

    // Create scan record
    await supabase.from('skin_scans' as any).insert({
      id: scanId,
      user_id: userId,
      status: 'pending_upload',
      created_at: new Date().toISOString(),
    });

    // Generate presigned URL via Supabase Storage
    const { data } = await supabase.storage
      .from('user-scans')
      .createSignedUploadUrl(filePath);

    return {
      uploadUrl: data?.url || '',
      scanId,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 min expiry
    };
  }

  /**
   * Initiate AI analysis for an uploaded scan
   */
  async initiateAnalysis(scanId: string): Promise<{
    status: string;
    estimatedTime: string;
    queuePosition?: number;
  }> {
    const supabase = getServiceClient();

    // Verify scan exists and is ready
    const { data: scan } = await supabase
      .from('skin_scans' as any)
      .select('status, image_url')
      .eq('id', scanId)
      .single();

    if (!scan) {
      throw new Error(`Scan ${scanId} not found`);
    }

    if (scan.status !== 'uploaded') {
      throw new Error(`Scan ${scanId} is not ready for analysis (status: ${scan.status})`);
    }

    // Update status to queued
    await supabase
      .from('skin_scans' as any)
      .update({ status: 'queued', queued_at: new Date().toISOString() })
      .eq('id', scanId);

    // Push to job queue (BullMQ or similar in production)
    // await scanQueue.add('analyze', { scanId }, { attempts: 3, backoff: { type: 'exponential', delay: 2000 } });

    // Get queue position (mock for now)
    const { count } = await supabase
      .from('skin_scans' as any)
      .select('*', { count: 'exact', head: true })
      .eq('status', 'queued');

    return {
      status: 'queued',
      estimatedTime: '10-30s',
      queuePosition: count || 1,
    };
  }

  /**
   * Get scan status and results
   */
  async getScanStatus(scanId: string): Promise<{
    status: string;
    progress?: number;
    result?: any;
    error?: string;
  }> {
    const supabase = getServiceClient();

    const { data } = await supabase
      .from('skin_scans' as any)
      .select('status, progress, analysis_result, error_message')
      .eq('id', scanId)
      .single();

    if (!data) throw new Error(`Scan ${scanId} not found`);

    return {
      status: data.status,
      progress: data.progress,
      result: data.analysis_result,
      error: data.error_message,
    };
  }

  /**
   * Complete a scan analysis with results
   */
  async completeAnalysis(scanId: string, result: any): Promise<void> {
    const supabase = getServiceClient();

    await supabase
      .from('skin_scans' as any)
      .update({
        status: 'completed',
        analysis_result: result,
        completed_at: new Date().toISOString(),
        progress: 100,
      })
      .eq('id', scanId);
  }

  /**
   * Fail a scan analysis with error
   */
  async failAnalysis(scanId: string, error: string): Promise<void> {
    const supabase = getServiceClient();

    await supabase
      .from('skin_scans' as any)
      .update({
        status: 'failed',
        error_message: error,
        completed_at: new Date().toISOString(),
      })
      .eq('id', scanId);
  }
}
