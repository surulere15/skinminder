import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestShareCard() {
  // Get an existing scan
  const { data: scan } = await supabase
    .from('skin_scans')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!scan) {
    console.log("No scans found in database!");
    return;
  }

  console.log("Found Scan ID:", scan.id);
  
  // We need to trigger the /api/share POST logically, but since that requires auth cookies,
  // we'll just insert directly to share_cards using the service role just to test the UI rendering.

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let shareCode = '';
  for (let i = 0; i < 8; i++) {
    shareCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const cardData = {
    score: scan.skin_score || 85,
    age: scan.skin_age_estimate || 28,
    metrics: {
      hydration: scan.hydration_score || 0.8,
      pigmentation: scan.pigmentation_score || 0.7,
      texture: scan.texture_score || 0.9,
      oil: scan.oil_balance || 0.5
    },
    insight: scan.analysis_raw?.intelligence?.summary || "A beautifully unique profile.",
    imageUrl: scan.image_url,
  };

  const { data: newCard, error } = await supabase
    .from('share_cards')
    .insert({
      user_id: scan.user_id,
      scan_id: scan.id,
      share_code: shareCode,
      card_type: 'report',
      card_data: cardData
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating card:", error);
  } else {
    console.log("Successfully created share card!");
    console.log("URL to test: http://localhost:3000/s/" + shareCode);
  }
}

createTestShareCard();
