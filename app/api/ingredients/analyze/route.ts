import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { analyzeProductIngredients } from "@/services/ai/ingredient-vision";
import { errorBoundary, createApiError } from "@/lib/api-utils";
import { apiRateLimit } from "@/lib/rate-limit";

async function handlePost(request: Request) {
  const rateLimitResponse = await apiRateLimit(request as any);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw createApiError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { image_base64 } = await request.json();

    if (!image_base64) {
      throw createApiError("Missing image data", 400, "MISSING_FIELDS");
    }

    // 1. Fetch user's persistent Skin DNA to use as the compatibility baseline
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("skin_dna")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.skin_dna) {
       console.warn("User has no Skin DNA profile yet. Providing generic analysis.");
    }

    const skinDna = profile?.skin_dna || {
       skinType: "Normal",
       sensitivityLevel: "Moderate",
       notes: "No persistent DNA mapped yet. Proceeding with general safety analysis."
    };

    // 2. Call Claude 3.5 Sonnet Vision to extract and analyze
    const analysis = await analyzeProductIngredients(image_base64, skinDna);

    return NextResponse.json(analysis);
  } catch (err: any) {
    console.error("API error in ingredient scanner route:", err);
    if (err.statusCode) throw err;
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

export const POST = errorBoundary(handlePost);
