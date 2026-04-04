import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { errorBoundary, createApiError } from '@/lib/api-utils';
import { apiRateLimit } from '@/lib/rate-limit';

function generateShareCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnopqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function handlePost(request: NextRequest) {
  const rateLimitResponse = await apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw createApiError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const { scanId, type = 'report' } = await request.json();

    if (!scanId) {
      throw createApiError('Missing scanId', 400, 'MISSING_FIELDS');
    }

    // 1. Fetch the scan and routine to ensure they exist and belong to the user
    // (RLS handles the ownership check)
    const { data: scan, error: scanError } = await supabase
      .from('skin_scans')
      .select('*')
      .eq('id', scanId)
      .single();

    if (scanError || !scan) {
      throw createApiError('Scan not found', 404, 'NOT_FOUND');
    }

    // 2. Check if a share card already exists for this scan to prevent duplicates
    const { data: existingCard } = await supabase
      .from('share_cards')
      .select('*')
      .eq('scan_id', scanId)
      .eq('card_type', type)
      .single();

    if (existingCard) {
      return NextResponse.json(existingCard);
    }

    // 3. Generate a unique code
    let shareCode = generateShareCode();
    let isUnique = false;
    let attempts = 0;

    // Basic collision avoidance
    while (!isUnique && attempts < 5) {
      const { data: collision } = await supabase
        .from('share_cards')
        .select('id')
        .eq('share_code', shareCode)
        .single();
      
      if (!collision) {
        isUnique = true;
      } else {
        shareCode = generateShareCode();
        attempts++;
      }
    }

    // 4. Capture the visual snapshot of the data the card needs to render
    // We snapshot it so the shared link is point-in-time and doesn't change later
    // or leak full database access
    const cardData = {
      score: scan.skin_score,
      age: scan.skin_age_estimate,
      metrics: {
        hydration: scan.hydration_score,
        pigmentation: scan.pigmentation_score,
        texture: scan.texture_score,
        oil: scan.oil_balance
      },
      insight: scan.analysis_raw?.intelligence?.summary || "A beautifully unique profile.",
      imageUrl: scan.image_url,
      // We don't expose full name to public links for privacy, just a generic "A SkinMinder User"
    };

    // 5. Insert the new share card
    const { data: newCard, error: insertError } = await supabase
      .from('share_cards')
      .insert({
        user_id: user.id,
        scan_id: scanId,
        share_code: shareCode,
        card_type: type,
        card_data: cardData
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json(newCard);

  } catch (error: any) {
    console.error('Share API Error:', error);
    if (error.statusCode) throw error;
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export const POST = errorBoundary(handlePost);
