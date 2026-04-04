import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateSkincareRoutine } from '@/services/ai/routine';
import { errorBoundary, createApiError } from '@/lib/api-utils';
import { apiRateLimit } from '@/lib/rate-limit';

async function handlePost(request: NextRequest) {
  const rateLimitResponse = await apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw createApiError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const body = await request.json();
    const { concerns, skinType, difficulty } = body;

    if (!concerns || !Array.isArray(concerns)) {
      throw createApiError('Missing or invalid concerns', 400, 'INVALID_CONCERNS');
    }

    // 1. Generate AI Routine
    const routine = await generateSkincareRoutine(concerns, skinType, difficulty);

    // 2. Log to routine history
    const { error: dbError } = await supabase
      .from('routine_history')
      .insert({
        user_id: user.id,
        notes: JSON.stringify(routine),
      });

    if (dbError) throw dbError;

    return NextResponse.json(routine);
  } catch (error: any) {
    console.error('Routine API Error:', error);
    if (error.statusCode) throw error;
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export const POST = errorBoundary(handlePost);
