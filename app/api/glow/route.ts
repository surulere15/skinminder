import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateGlowSimulation } from "@/services/ai/glow";
import { errorBoundary, createApiError } from "@/lib/api-utils";
import { apiRateLimit } from "@/lib/rate-limit";

async function handlePost(req: NextRequest) {
  const rateLimitResponse = await apiRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw createApiError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const body = await req.json();
    const { skinType, concerns, currentMetrics } = body;

    if (!skinType || !concerns) {
      throw createApiError("Missing skinType or concerns", 400, "MISSING_FIELDS");
    }

    const simulation = await generateGlowSimulation({
      currentMetrics: currentMetrics || { hydration: 50, texture: 50 },
      skinType,
      concerns,
    });

    return NextResponse.json(simulation);
  } catch (error: any) {
    console.error("Glow API Error:", error);
    if (error.statusCode) throw error;
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export const POST = errorBoundary(handlePost);
