import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { generateSkinDnaProfile } from "@/services/ai/skin-dna";
import { errorBoundary, createApiError } from "@/lib/api-utils";
import { apiRateLimit } from "@/lib/rate-limit";

async function handlePost(request: NextRequest) {
  const rateLimitResponse = await apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw createApiError("Unauthorized", 401, "UNAUTHORIZED");
    }

    // 1. Fetch user's historical scans
    const { data: scanHistory, error: historyError } = await supabase
      .from("skin_scans")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(10); // Use up to last 10 scans for DNA profiling
      
    if (historyError) {
      console.error("Database error fetching scan history:", historyError);
      throw createApiError("Error fetching scan history", 500, "DB_ERROR");
    }

    // 2. Fetch user's current profile
    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
       console.error("Database error fetching profile:", profileError);
       throw createApiError("Error fetching profile", 500, "DB_ERROR");
    }

    // 3. Generate AI Skin DNA Profile
    const skinDna = await generateSkinDnaProfile(scanHistory || [], userProfile);

    // 4. Persist to profiles.skin_dna
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ skin_dna: skinDna })
      .eq("id", user.id);

    if (updateError) {
       console.error("Error saving skin DNA to profile:", updateError);
       throw createApiError("Error saving profile", 500, "DB_ERROR");
    }

    return NextResponse.json(skinDna);
  } catch (err: any) {
    console.error("API error in skin-dna route:", err);
    if (err.statusCode) throw err;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET route to quickly retrieve existing Skin DNA without regenerating
async function handleGet(request: NextRequest) {
  const rateLimitResponse = await apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw createApiError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("skin_dna")
      .eq("id", user.id)
      .single();

    if (error) {
       throw createApiError("Error fetching profile", 500, "DB_ERROR");
    }

    return NextResponse.json({ skin_dna: profile?.skin_dna || null });
  } catch (err: any) {
    console.error("API error in skin-dna retrieval:", err);
    if (err.statusCode) throw err;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const POST = errorBoundary(handlePost);
export const GET = errorBoundary(handleGet);
