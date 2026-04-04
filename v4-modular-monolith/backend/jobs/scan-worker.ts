/**
 * Scan Worker (BullMQ)
 * Background processing of skin scans.
 */

// import { Worker } from 'bullmq';
// import { AIAnalysisService } from '../modules/ai-analysis/vision.service';

export async function createScanWorker() {
    console.log("[Jobs] Initializing Scan Worker...");
    // worker = new Worker('scan-queue', async (job) => {
    //    const results = await AIAnalysisService.extractMetrics(job.data.imageUrl);
    //    await updateScanStatus(job.data.scanId, 'completed', results);
    // });
}
