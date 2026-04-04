import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { code: string } }): Promise<Metadata> {
  const supabase = await createClient();
  const { data: shareCard } = await supabase
    .from('share_cards')
    .select('card_data')
    .eq('share_code', params.code)
    .single();

  if (!shareCard) return { title: 'Skin Story Not Found' };

  return {
    title: `My Skin Score is ${shareCard.card_data.score} | SkinMinder AI`,
    description: `I just got my free AI skin analysis. My skin vitality age is ${shareCard.card_data.age}! Get your free analysis now.`,
    openGraph: {
      title: `My Skin Score is ${shareCard.card_data.score} | SkinMinder AI`,
      description: `I just got my free AI skin analysis. My skin vitality age is ${shareCard.card_data.age}! Get your free analysis now.`,
      images: [
        {
          url: shareCard.card_data.imageUrl,
          width: 800,
          height: 600,
          alt: 'My AI Skin Scan',
        },
      ],
    },
  };
}

export default async function SharedReportPage({ params }: { params: { code: string } }) {
  const supabase = await createClient();
  
  const { data: shareCard } = await supabase
    .from('share_cards')
    .select('*')
    .eq('share_code', params.code)
    .single();

  if (!shareCard || !shareCard.active) {
    notFound();
  }

  const { score, age, metrics, insight, imageUrl } = shareCard.card_data;

  // Increment view count directly using standard update
  // Using an unawaited promise here to not block rendering
  supabase
    .from('share_cards')
    .update({ view_count: (shareCard.view_count || 0) + 1 })
    .eq('id', shareCard.id)
    .then(({ error }) => {
      if (error) console.error("Could not increment view count:", error);
    });

  return (
    <div className="min-h-screen relative overflow-hidden bg-skin-pearl">
      {/* Sci-Fi Ambient Glows */}
      <div className="ambient-glow bg-skin-violet/5 animate-pulse-glow" style={{ top: '-10%', right: '-10%', width: '60%', height: '60%' }} />
      <div className="ambient-glow bg-skin-rose/10 animate-pulse-glow" style={{ bottom: '-10%', left: '-20%', width: '70%', height: '70%', animationDelay: '2s' }} />
      {/* Viral Header Banner */}
      <div className="bg-skin-dark text-skin-pearl p-4 sm:p-6 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10">
               <Sparkles className="text-skin-violet w-5 h-5" />
             </div>
             <div>
               <p className="font-bold text-lg leading-tight text-skin-pearl">Curious about your skin's true age?</p>
               <p className="text-white/60 text-sm">Join SkinMinder and get your AI report in 30 seconds.</p>
             </div>
          </div>
          <Link href="/try" className="relative z-10">
            <Button variant="volumetric-scan" className="rounded-full shadow-xl shadow-skin-violet/20 font-bold px-8 h-12 w-full sm:w-auto text-skin-violet">
              Get My Free Report <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4 sm:p-8 lg:p-12 max-w-5xl mx-auto space-y-12 relative z-10">
        <header className="text-center space-y-2 mt-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-outfit font-black tracking-tight text-glossy">A SkinMinder Story</h1>
          <p className="text-xl font-medium text-skin-muted">Certified AI Intelligence Report</p>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
           {/* Left: Visual Evidence */}
           <div className="lg:col-span-5">
             <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white transform rotate-[-2deg] transition-transform hover:rotate-0 duration-500">
               <img src={imageUrl} alt="Skin Profile" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
                  <div className="space-y-2 text-skin-pearl">
                     <p className="text-xs font-black uppercase tracking-widest text-skin-pearl flex items-center gap-2">
                       <Sparkles size={14} className="text-skin-violet" /> Authenticated Scan
                     </p>
                     <p className="text-2xl font-bold">Facial Profile</p>
                  </div>
               </div>
             </div>
           </div>

           {/* Right: The Data */}
           <div className="lg:col-span-7 space-y-6 flex flex-col justify-center">
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="glass-panel border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl overflow-hidden text-center relative bg-white/5">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-skin-violet/5 rounded-bl-[100%] -z-10 blur-xl" />
                  <CardContent className="p-8 flex flex-col justify-center h-full">
                    <p className="text-[10px] font-black uppercase tracking-widest text-skin-muted mb-4 text-center">Glow Score</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-6xl font-outfit font-black text-3d tracking-tighter text-skin-dark">{score}</span>
                      <span className="text-xl font-bold text-skin-muted">/ 100</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-panel border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl overflow-hidden text-center bg-white/5">
                  <CardContent className="p-8 flex flex-col justify-center h-full">
                    <p className="text-[10px] font-black uppercase tracking-widest text-skin-muted mb-4 text-center">Vitality Age</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-6xl font-outfit font-black text-3d tracking-tighter text-skin-dark">{age}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-skin-dark border-0 shadow-[0_30px_60px_rgba(0,0,0,0.4)] rounded-[2.5rem] text-skin-pearl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-skin-violet/20 rounded-full -z-10 blur-[60px]" />
                 <CardContent className="p-8 space-y-4">
                   <div className="flex items-center gap-2 text-skin-pearl font-black text-[10px] tracking-widest uppercase">
                     <Sparkles size={14} className="text-skin-violet" /> AI Insight
                   </div>
                   <p className="text-xl font-medium leading-relaxed italic drop-shadow-md">
                     "{insight}"
                   </p>
                 </CardContent>
               </Card>

                <div className="grid grid-cols-4 gap-3">
                   {[
                     { label: "Hydration", value: Math.round(metrics.hydration * 100) },
                     { label: "Texture", value: Math.round(metrics.texture * 100) },
                     { label: "Pigment", value: Math.round(metrics.pigmentation * 100) },
                     { label: "Oil", value: Math.round(metrics.oil * 100) },
                   ].map((m) => (
                     <div key={m.label} className="glass-panel border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.03)] rounded-2xl p-4 text-center bg-white/5">
                       <p className="text-[9px] font-black uppercase tracking-widest text-skin-muted mb-2">{m.label}</p>
                       <p className="text-2xl font-outfit font-black text-3d tracking-tighter text-skin-dark">{m.value}</p>
                     </div>
                   ))}
                </div>
           </div>
        </div>

        {/* Viral Footer CTA */}
        <div className="mt-16 pt-12 border-t border-skin-dark/10 text-center space-y-6 pb-24 relative z-10">
          <h2 className="text-3xl font-outfit font-black text-glossy">Stop Guessing. Start Glowing.</h2>
          <p className="text-lg text-skin-muted max-w-xl mx-auto">
            Get your own personalized routine, ingredient analysis, and daily habits precisely tailored to your unique skin DNA.
          </p>
          <div className="pt-4">
            <Link href="/try">
               <Button variant="volumetric-scan" className="rounded-full shadow-2xl font-bold px-12 h-16 text-lg">
                 Reveal Your Skin Story <ArrowRight className="ml-2 w-5 h-5" />
               </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
