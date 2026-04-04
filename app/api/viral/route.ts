import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateGlowSimulation } from '@/services/ai/glow';
import { generateSkinDnaProfile } from '@/services/ai/skin-dna';
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

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'glow') {
      const { scanId, routineId } = await request.json();
      
      const { data: scan } = await supabase.from('skin_scans').select('*').eq('id', scanId).single();
      const { data: routine } = await supabase.from('routine_history').select('*').eq('id', routineId).single();

      const simulation = await generateGlowSimulation({
        currentMetrics: scan.analysis_raw.vision,
        skinType: scan.analysis_raw.intelligence.skin_type || 'combination',
        concerns: scan.analysis_raw.intelligence.primary_concerns || [],
      });

      const { data: glowSim, error: dbError } = await supabase
        .from('glow_simulations')
        .insert({
          user_id: user.id,
          scan_id: scanId,
          current_scores: scan.analysis_raw.vision,
          projected_scores: simulation.targeted_improvements,
          projected_weeks: simulation.timeframe,
          routine_summary: simulation.protocol_requirements.join(", "),
          improvement_narrative: simulation.simulated_narrative,
          confidence_level: 95, // Default confidence for clinical simulation
        })
        .select()
        .single();

      if (dbError) throw dbError;
      return NextResponse.json(glowSim);
    }

    if (action === 'dna') {
      const { data: scans } = await supabase.from('skin_scans').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5);
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

      const dnaProfile = await generateSkinDnaProfile(scans || [], profile);

      const { data: savedDna, error: dbError } = await supabase
        .from('skin_dna_profiles')
        .upsert({
          user_id: user.id,
          ...dnaProfile,
        })
        .select()
        .single();

      if (dbError) throw dbError;
      return NextResponse.json(savedDna);
    }

    throw createApiError('Invalid action', 400, 'INVALID_ACTION');
  } catch (error: any) {
    console.error('Viral API Error:', error);
    if (error.statusCode) throw error;
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export const POST = errorBoundary(handlePost);
