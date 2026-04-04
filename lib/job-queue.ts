import { createClient } from "@/lib/supabase/server";

export type JobStatus = "pending" | "processing" | "completed" | "failed";
export type JobType = "scan_analysis" | "routine_generation" | "push_notification";

export interface BackgroundJob {
  id: string;
  user_id: string;
  type: JobType;
  payload: Record<string, any>;
  status: JobStatus;
  attempts: number;
  max_attempts: number;
  error_message?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

export class JobQueue {
  private maxAttempts = 3;

  async enqueue(
    userId: string,
    type: JobType,
    payload: Record<string, any>
  ): Promise<string> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("background_jobs")
      .insert({
        user_id: userId,
        type,
        payload,
        status: "pending",
        attempts: 0,
        max_attempts: this.maxAttempts,
      })
      .select("id")
      .single();

    if (error) throw error;
    return data.id;
  }

  async processJob(jobId: string, handler: JobHandler): Promise<void> {
    const supabase = await createClient();

    // Mark as processing
    await supabase
      .from("background_jobs")
      .update({ status: "processing", started_at: new Date().toISOString() })
      .eq("id", jobId);

    try {
      const { data: job } = await supabase
        .from("background_jobs")
        .select("*")
        .eq("id", jobId)
        .single();

      if (!job) throw new Error("Job not found");

      await handler(job.payload);

      await supabase
        .from("background_jobs")
        .update({ 
          status: "completed", 
          completed_at: new Date().toISOString() 
        })
        .eq("id", jobId);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      const { data: job } = await supabase
        .from("background_jobs")
        .select("attempts, max_attempts")
        .eq("id", jobId)
        .single();

      if (job && job.attempts + 1 >= job.max_attempts) {
        await supabase
          .from("background_jobs")
          .update({ 
            status: "failed", 
            error_message: errorMessage,
          })
          .eq("id", jobId);
      } else if (job) {
        await supabase
          .from("background_jobs")
          .update({ 
            attempts: job.attempts + 1,
            status: "pending",
            error_message: errorMessage,
          })
          .eq("id", jobId);
      }
    }
  }

  async getJobStatus(jobId: string): Promise<BackgroundJob | null> {
    const supabase = await createClient();
    const { data } = await supabase
      .from("background_jobs")
      .select("*")
      .eq("id", jobId)
      .single();
    return data;
  }

  async getUserJobs(userId: string, limit = 20): Promise<BackgroundJob[]> {
    const supabase = await createClient();
    const { data } = await supabase
      .from("background_jobs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
    return data || [];
  }
}

export type JobHandler = (payload: Record<string, any>) => Promise<void>;

export const jobQueue = new JobQueue();