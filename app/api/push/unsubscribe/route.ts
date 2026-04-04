import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { endpoint } = await request.json();
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("push_subscriptions")
      .delete()
      .match({ user_id: user.id, endpoint });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Push unsubscribe error:", error);
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 });
  }
}