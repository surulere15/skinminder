import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/server';
import { errorBoundary, createApiError } from '@/lib/api-utils';
import { apiRateLimit } from '@/lib/rate-limit';

async function handlePost(request: NextRequest) {
  const rateLimitResponse = await apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const supabaseUser = await createClient();
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();

    if (authError || !user) {
      throw createApiError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const { path } = await request.json();

    if (!path) {
      throw createApiError('Missing path', 400, 'MISSING_FIELDS');
    }

    // Use service client to create signed URL
    const supabase = getServiceClient();
    const { data, error } = await supabase.storage
      .from('scans')
      .createSignedUrl(path, 60); // 60 seconds expiry

    if (error) {
      console.error("Signed URL creation error:", error);
      throw createApiError('Failed to create signed URL', 500, 'STORAGE_ERROR');
    }

    return NextResponse.json({ signedUrl: data.signedUrl });
  } catch (error: any) {
    console.error('Storage Sign API Error:', error);
    if (error.statusCode) throw error;
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export const POST = errorBoundary(handlePost);
