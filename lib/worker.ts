import { createClient } from "@/lib/supabase/server";

export async function processBackgroundJobs() {
  const supabase = await createClient();
  
  // Get pending jobs that haven't exceeded max attempts
  const { data: jobs, error } = await supabase
    .from("background_jobs")
    .select("*")
    .eq("status", "pending")
    .lt("attempts", 3)
    .order("created_at", { ascending: true })
    .limit(10);

  if (error || !jobs) {
    console.error("[Worker] Failed to fetch jobs:", error);
    return;
  }

  console.log(`[Worker] Processing ${jobs.length} jobs`);

  for (const job of jobs) {
    try {
      // Mark as processing
      await supabase
        .from("background_jobs")
        .update({ status: "processing", started_at: new Date().toISOString() })
        .eq("id", job.id);

      // Process based on job type
      switch (job.type) {
        case "scan_analysis":
          await processScanAnalysis(job.payload);
          break;
        case "routine_generation":
          await processRoutineGeneration(job.payload);
          break;
        case "push_notification":
          await processPushNotification(job.payload);
          break;
        default:
          console.warn(`[Worker] Unknown job type: ${job.type}`);
      }

      // Mark as completed
      await supabase
        .from("background_jobs")
        .update({ 
          status: "completed", 
          completed_at: new Date().toISOString() 
        })
        .eq("id", job.id);

      console.log(`[Worker] Completed job ${job.id} (${job.type})`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      
      // Increment attempts and revert to pending for retry
      await supabase
        .from("background_jobs")
        .update({ 
          attempts: job.attempts + 1,
          status: job.attempts + 1 >= 3 ? "failed" : "pending",
          error_message: errorMessage,
        })
        .eq("id", job.id);

      console.error(`[Worker] Failed job ${job.id}:`, errorMessage);
    }
  }
}

async function processScanAnalysis(payload: Record<string, any>) {
  console.log(`[Worker] Processing scan analysis:`, payload.scanId);
  // In production, this would trigger the actual AI analysis
  // For now, it's handled synchronously in the scan API
  await new Promise(resolve => setTimeout(resolve, 100));
}

async function processRoutineGeneration(payload: Record<string, any>) {
  console.log(`[Worker] Processing routine generation:`, payload.userId);
  // This would generate routines asynchronously
  await new Promise(resolve => setTimeout(resolve, 100));
}

async function processPushNotification(payload: Record<string, any>) {
  console.log(`[Worker] Processing push notification:`, payload.userId);
  // This would send push notifications
  await new Promise(resolve => setTimeout(resolve, 100));
}

// Run if called directly
const isMain = process.argv[1]?.includes("worker");
if (isMain) {
  console.log("[Worker] Starting background job processor...");
  setInterval(processBackgroundJobs, 30000); // Run every 30 seconds
  processBackgroundJobs(); // Run immediately
}