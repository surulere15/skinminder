import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { errorBoundary, createApiError } from "@/lib/api-utils";
import { apiRateLimit } from "@/lib/rate-limit";

async function handleGet(req: NextRequest) {
  const rateLimitResponse = await apiRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw createApiError("Unauthorized", 401, "UNAUTHORIZED");
    }

    // Fetch all scans for longitudinal tracking
    const { data: scans, error: scansError } = await supabase
      .from("skin_scans")
      .select("id, created_at, skin_score, hydration_score, pigmentation_score, texture_score, oil_balance, body_area, primary_concerns")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (scansError) throw scansError;

    // Compute trends
    const trends = computeTrends(scans || []);

    // Compute weekly milestones for progress timeline
    const milestones = computeMilestones(scans || []);

    // Fetch profile for skin type context
    const { data: profile } = await supabase
      .from("profiles")
      .select("skin_type, skin_concerns, age")
      .eq("id", user.id)
      .single();

    return NextResponse.json({
      scanCount: scans?.length || 0,
      scans: scans || [],
      trends,
      milestones,
      profile,
    });
  } catch (error: any) {
    console.error("Skin Twin API Error:", error);
    if (error.statusCode) throw error;
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export const GET = errorBoundary(handleGet);

function computeTrends(scans: any[]) {
  if (scans.length < 2) return [];

  const metrics = ["hydration_score", "pigmentation_score", "texture_score", "oil_balance", "skin_score"];
  const recent = scans.slice(-5);
  const older = scans.slice(0, Math.max(1, scans.length - 5));

  return metrics.map((metric) => {
    const recentAvg = recent.reduce((sum: number, s: any) => sum + (s[metric] || 0), 0) / recent.length;
    const olderAvg = older.reduce((sum: number, s: any) => sum + (s[metric] || 0), 0) / older.length;
    const change = recentAvg - olderAvg;

    return {
      metric: metric.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
      direction: change > 2 ? "improving" : change < -2 ? "declining" : "stable",
      changePercent: Math.round(change),
      recentAvg: Math.round(recentAvg),
    };
  });
}

function computeMilestones(scans: any[]) {
  if (scans.length === 0) return [];

  const firstScanDate = new Date(scans[0].created_at).getTime();
  const milestoneWeeks = [1, 2, 4, 8, 12];

  return milestoneWeeks.map((week) => {
    const targetMs = firstScanDate + week * 7 * 24 * 60 * 60 * 1000;

    // Find scans within ±3 days of the target week
    const windowMs = 3 * 24 * 60 * 60 * 1000;
    const nearby = scans.filter((s) => {
      const t = new Date(s.created_at).getTime();
      return Math.abs(t - targetMs) <= windowMs;
    });

    if (nearby.length === 0) {
      // Find the closest scan before or at this milestone
      const before = scans.filter((s) => new Date(s.created_at).getTime() <= targetMs + windowMs);
      const closest = before.length > 0 ? before[before.length - 1] : null;

      return {
        week,
        label: `Week ${week}`,
        skinScore: closest ? closest.skin_score : null,
        hydration: closest ? Math.round((closest.hydration_score || 0) * 100) : null,
        texture: closest ? Math.round((closest.texture_score || 0) * 100) : null,
        date: closest ? closest.created_at : null,
        status: closest ? "interpolated" as const : "upcoming" as const,
      };
    }

    const avgScore = Math.round(nearby.reduce((s: number, sc: any) => s + (sc.skin_score || 0), 0) / nearby.length);
    const avgHydration = Math.round(nearby.reduce((s: number, sc: any) => s + ((sc.hydration_score || 0) * 100), 0) / nearby.length);
    const avgTexture = Math.round(nearby.reduce((s: number, sc: any) => s + ((sc.texture_score || 0) * 100), 0) / nearby.length);

    return {
      week,
      label: `Week ${week}`,
      skinScore: avgScore,
      hydration: avgHydration,
      texture: avgTexture,
      date: nearby[nearby.length - 1].created_at,
      status: "recorded" as const,
    };
  });
}
