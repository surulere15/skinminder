import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateNutritionPlan } from "@/services/ai/nutrition";
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
    const { skinType, concerns, overallScore } = body;

    const plan = await generateNutritionPlan({
      skinType,
      concerns,
      overallScore
    });

    return NextResponse.json(plan);
  } catch (error: any) {
    console.error("Nutrition API Error:", error);
    if (error.statusCode) throw error;
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const POST = errorBoundary(handlePost);
