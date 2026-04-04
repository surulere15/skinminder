import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json();
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("push_subscriptions")
      .upsert({
        user_id: user.id,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        created_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,endpoint'
      });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Push subscribe error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}