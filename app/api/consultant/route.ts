import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { chatWithBeautyConsultant } from '@/services/ai/consultant';
import { errorBoundary, createApiError } from '@/lib/api-utils';
import { apiRateLimit } from '@/lib/rate-limit';

async function handlePost(request: NextRequest) {
  const rateLimitResponse = await apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    let supabase;
    let user = null;
    
    // Safely attempt to initialize Supabase and get user
    try {
      supabase = await createClient();
      const authResult = await supabase.auth.getUser();
      user = authResult.data?.user;
    } catch (e) {
      console.warn("Supabase auth failed (likely missing env vars in SSR). Proceeding with mock user.");
    }

    const finalUserId = user?.id || "00000000-0000-0000-0000-000000000000";

    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      throw createApiError('Missing or invalid messages', 400, 'INVALID_MESSAGES');
    }

    let enrichedContext = {};

    if (user && supabase) {
      // Fetch permanent DNA
      const { data: profile } = await supabase
        .from("profiles")
        .select("skin_dna")
        .eq("id", user.id)
        .single();

      // Fetch latest scan
      const { data: latestScan } = await supabase
        .from("skin_scans")
        .select("skin_score, body_area, primary_concerns, analysis_raw")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
        
      enrichedContext = {
        skinDna: profile?.skin_dna || null,
        latestScan: latestScan ? {
          score: latestScan.skin_score,
          area: latestScan.body_area,
          concerns: latestScan.primary_concerns,
          insight: latestScan.analysis_raw
        } : null
      };
    } else {
        // Mock context for unauthenticated local development
        enrichedContext = {
            skinDna: { skinType: "Combination", sensitivity: "Moderate" },
            latestScan: { score: 72, concerns: ["dryness", "texture"] }
        };
    }

    // 1. Get AI Response
    const response = await chatWithBeautyConsultant(messages, enrichedContext);

    // 2. Persist message history
    const lastMessage = messages[messages.length - 1];
    
    if (supabase) {
      const { error: userMsgError } = await supabase.from('chat_messages').insert({
        user_id: finalUserId,
        role: 'user',
        content: lastMessage.content,
      });
      if (userMsgError) console.warn(userMsgError);
    }

    if (supabase) {
      const { error: assistantMsgError } = await supabase.from('chat_messages').insert({
        user_id: finalUserId,
        role: 'assistant',
        content: response.message,
        context: response,
      });
      if (assistantMsgError) console.warn(assistantMsgError);
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Consultant API Error:', error);
    if (error.statusCode) throw error;
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export const POST = errorBoundary(handlePost);
