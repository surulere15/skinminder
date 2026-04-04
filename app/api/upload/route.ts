import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { errorBoundary, createApiError } from '@/lib/api-utils';
import { apiRateLimit } from '@/lib/rate-limit';

const SCANS_BUCKET = 'scans';

async function handlePost(request: NextRequest) {
  const rateLimitResponse = await apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw createApiError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    throw createApiError('No file provided', 400, 'MISSING_FILE');
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `${user.id}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from(SCANS_BUCKET)
    .upload(fileName, file, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    });

  if (error) {
    throw createApiError(error.message || 'Failed to upload image', 500, 'UPLOAD_FAILED');
  }

  const { data: { publicUrl } } = supabase.storage
    .from(SCANS_BUCKET)
    .getPublicUrl(data.path);

  return NextResponse.json({ url: publicUrl, path: data.path });
}

export const POST = errorBoundary(handlePost);
