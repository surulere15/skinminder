import { createClient } from "@/lib/supabase/server";

export type ReminderType = 
  | "first_scan"
  | "weekly_scan" 
  | "scan_streak"
  | "routine_check"
  | "progress_milestone"
  | "product_expire";

export interface ReminderSchedule {
  id: string;
  user_id: string;
  type: ReminderType;
  scheduled_at: string;
  sent: boolean;
  completed: boolean;
  message?: string;
}

export class RetentionEngine {
  async scheduleReminder(
    userId: string,
    type: ReminderType,
    scheduledAt: Date,
    message?: string
  ): Promise<string> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("reminder_schedule")
      .insert({
        user_id: userId,
        type,
        scheduled_at: scheduledAt.toISOString(),
        message,
        sent: false,
        completed: false,
      })
      .select("id")
      .single();

    if (error) throw error;
    return data.id;
  }

  async getScheduledReminders(userId: string): Promise<ReminderSchedule[]> {
    const supabase = await createClient();
    
    const { data } = await supabase
      .from("reminder_schedule")
      .select("*")
      .eq("user_id", userId)
      .eq("sent", false)
      .gte("scheduled_at", new Date().toISOString())
      .order("scheduled_at", { ascending: true });

    return data || [];
  }

  async getOverdueReminders(): Promise<ReminderSchedule[]> {
    const supabase = await createClient();
    
    const { data } = await supabase
      .from("reminder_schedule")
      .select("*")
      .eq("sent", false)
      .lt("scheduled_at", new Date().toISOString())
      .order("scheduled_at", { ascending: true })
      .limit(100);

    return data || [];
  }

  async markReminderSent(reminderId: string): Promise<void> {
    const supabase = await createClient();
    await supabase
      .from("reminder_schedule")
      .update({ sent: true })
      .eq("id", reminderId);
  }

  async markReminderCompleted(reminderId: string): Promise<void> {
    const supabase = await createClient();
    await supabase
      .from("reminder_schedule")
      .update({ completed: true })
      .eq("id", reminderId);
  }

  async setupWeeklyScanReminder(userId: string): Promise<void> {
    // Schedule reminder for 7 days from now
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    await this.scheduleReminder(
      userId,
      "weekly_scan",
      nextWeek,
      "Time for your weekly skin scan! Track your progress and see what's working."
    );
  }

  async checkAndTriggerRetentionActions(userId: string): Promise<{
    shouldRemind: boolean;
    reminderType?: ReminderType;
    message?: string;
  }> {
    const supabase = await createClient();
    
    // Get user's scan history
    const { data: scans } = await supabase
      .from("skin_scans")
      .select("created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (!scans || scans.length === 0) {
      return { shouldRemind: true, reminderType: "first_scan" };
    }

    const lastScan = new Date(scans[0].created_at);
    const now = new Date();
    const daysSinceLastScan = Math.floor((now.getTime() - lastScan.getTime()) / (1000 * 60 * 60 * 24));

    // Check streak - if user scanned 3+ times in last 14 days
    const recentScans = scans.filter(s => {
      const scanDate = new Date(s.created_at);
      const days = (now.getTime() - scanDate.getTime()) / (1000 * 60 * 60 * 24);
      return days <= 14;
    });

    if (recentScans.length >= 3) {
      return {
        shouldRemind: true,
        reminderType: "scan_streak",
        message: `Amazing! You've scanned ${recentScans.length} times this week. Keep the streak going!`
      };
    }

    // Weekly reminder if no scan in 6+ days
    if (daysSinceLastScan >= 6) {
      return {
        shouldRemind: true,
        reminderType: "weekly_scan",
        message: "It's been a week since your last scan. Time to check in on your skin!"
      };
    }

    return { shouldRemind: false };
  }
}

export const retentionEngine = new RetentionEngine();

export const RETENTION_MESSAGES = {
  first_scan: {
    headline: "Start your skin journey",
    body: "Your first scan will establish your baseline. Let's see what your skin is telling you!",
    cta: "Take Your First Scan",
  },
  weekly_scan: {
    headline: "Weekly check-in",
    body: "Time to see how your skin is doing. Scan now to track your progress!",
    cta: "Scan Now",
  },
  scan_streak: {
    headline: "🔥 You're on a roll!",
    body: "Keep up the great work! Your consistency is showing results.",
    cta: "Continue Your Streak",
  },
  progress_milestone: {
    headline: "🎉 Milestone reached!",
    body: "You've hit a major milestone. See your progress!",
    cta: "View Progress",
  },
};