import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { errorBoundary, createApiError } from "@/lib/api-utils";
import { apiRateLimit } from "@/lib/rate-limit";

async function handleGet() {
  const rateLimitResponse = await apiRateLimit(new Request('http://localhost'));
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw createApiError("Unauthorized", 401, "UNAUTHORIZED");
    }

    // Fetch all completed scans for the user, ordered oldest to newest for chronological plotting
    const { data, error } = await supabase
      .from("skin_scans")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Database error fetching scan history:", error);
      throw createApiError("Error fetching scan history", 500, "DB_ERROR");
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("API error in scan history route:", err);
    if (err.statusCode) throw err;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const GET = errorBoundary(handleGet);
