import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { errorBoundary, createApiError } from '@/lib/api-utils';
import { apiRateLimit } from '@/lib/rate-limit';

async function handleGet(request: NextRequest) {
  const rateLimitResponse = await apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const target = searchParams.get('target');
    const supabase = await createClient();

    let dbQuery = supabase.from('products').select('*');

    if (category) {
      dbQuery = dbQuery.eq('category', category);
    }

    if (target) {
      dbQuery = dbQuery.contains('skin_targets', [target]);
    }

    const { data: products, error } = await dbQuery.limit(20);

    if (error) throw error;

    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Products API Error:', error);
    if (error.statusCode) throw error;
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const GET = errorBoundary(handleGet);
