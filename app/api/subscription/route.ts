import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ tier: "free" });
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("tier, status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  return NextResponse.json({ 
    tier: subscription?.tier || "free",
    status: subscription?.status || "inactive"
  });
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tier } = await request.json();

    // In production, this would integrate with Stripe/Paddle
    // For now, we just update the local record
    const { error } = await supabase
      .from("subscriptions")
      .upsert({
        user_id: user.id,
        tier,
        status: "active",
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (error) throw error;

    return NextResponse.json({ success: true, tier });
  } catch (error) {
    console.error("Subscription upgrade error:", error);
    return NextResponse.json({ error: "Failed to upgrade" }, { status: 500 });
  }
}