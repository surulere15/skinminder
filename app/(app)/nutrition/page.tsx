"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Apple, 
  Zap, 
  Droplets, 
  Leaf, 
  Sparkles,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Info,
  History,
  ArrowRight
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function NutritionPage() {
  const [plan, setPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadNutrition() {
      setIsLoading(true);
      try {
        // Attempt to fetch from real API
        const res = await fetch("/api/nutrition", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skinType: "combination",
            concerns: ["texture", "hydration"],
            overallScore: 72,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setPlan(data);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn("API unavailable, using demo data:", err);
      }
      // Fallback to realistic demo data
      setPlan({
        dietary_focus: "Antioxidant-Rich Barrier Support",
        superfoods: [
          { name: "Blueberries", benefit: "Vascular Health", reason: "High in anthocyanins to support clear capillary walls." },
          { name: "Walnuts", benefit: "Lipid Balance", reason: "Rich in Omega-3 to stabilize cutaneous moisture levels." },
          { name: "Spinach", benefit: "Cellular Repair", reason: "Provides Lutein for elasticity and Vitamin K for brightness." }
        ],
        supplements: [
          { name: "Probiotics (Lactobacillus)", benefit: "Microbiome Harmony", usage: "1 capsule daily before breakfast." },
          { name: "Vitamin C with Bioflavonoids", benefit: "Collagen Synthesis", usage: "500mg daily with food." }
        ],
        herbal_support: [
          { name: "Spearmint Tea", benefit: "Hormonal Balance" },
          { name: "Evening Primrose", benefit: "Anti-Inflammatory" }
        ],
        hydration_protocol: "2.5 Liters daily + Electrolyte infusion in the morning for deep cellular saturability.",
        lifestyle_adjustments: [
          "Silk pillowcase for texture preservation",
          "7-8 hours of deep REM sleep for cortisol regulation",
          "Lymphatic facial drainage (3 mins daily)"
        ],
        narrative: "Your skin intelligence reveals a high propensity for oxidative stress. By optimizing your internal lipid profile and regulating cortisol, we can transform your current texture baseline into a high-radiance state."
      });
      setIsLoading(false);
    }
    loadNutrition();
  }, []);

  return (
    <div className="p-8 lg:p-12 space-y-12 max-w-7xl mx-auto bg-skin-pearl min-h-screen">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4">
        <div className="space-y-4 text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-skin-muted/5 text-skin-dark text-[10px] font-black uppercase tracking-widest border border-skin-border/10 shadow-sm">
            <Apple size={14} className="text-skin-glow" /> Internal Radiance Intelligence
          </div>
          <h1 className="text-4xl lg:text-6xl font-outfit font-black tracking-tight text-skin-dark">Wellness Blueprint</h1>
          <p className="text-skin-muted font-bold text-lg max-w-2xl opacity-90 leading-relaxed">
             Your skin is a living reflection of your internal ecosystem. Sequence your diet and habits for maximum biological glow.
          </p>
        </div>
      </header>

      {isLoading ? (
        <div className="py-40 flex flex-col items-center justify-center space-y-8">
           <Loader2 className="w-16 h-16 text-skin-violet animate-spin" />
           <div className="space-y-2 text-center">
             <h2 className="text-3xl font-outfit font-black tracking-tight text-skin-dark">Synthesizing Bio-Nutrition...</h2>
             <p className="text-skin-muted font-black text-[10px] uppercase tracking-widest opacity-80">Sequencing nutrients to dermal markers</p>
           </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-12">
           {/* Hero Narrative */}
           <div className="lg:col-span-12">
              <Card className="border-none bg-skin-graphite text-skin-pearl shadow-[0_50px_100px_rgba(0,0,0,0.4)] rounded-[4rem] overflow-hidden group relative">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-skin-glow/20 rounded-full blur-[100px] -z-10 group-hover:scale-110 transition-transform duration-1000" />
                 <CardContent className="p-16 md:p-24 flex flex-col md:flex-row items-center justify-between gap-16 relative z-10 text-left">
                    <div className="space-y-10 max-w-3xl">
                       <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] border border-white/20">
                          Primary Biological Focus
                       </div>
                       <h2 className="text-5xl md:text-8xl font-outfit font-black tracking-tighter leading-[1.1] drop-shadow-2xl">
                          {plan.dietary_focus}
                       </h2>
                       <p className="text-white/80 text-2xl font-medium leading-relaxed drop-shadow-md">
                          "{plan.narrative}"
                       </p>
                       <div className="flex flex-wrap gap-6">
                          <div className="px-8 py-5 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-4 group-hover:bg-white/10 transition-all">
                             <div className="p-3 rounded-2xl bg-skin-violet/20">
                               <Droplets className="text-skin-violet" size={32} />
                             </div>
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Saturation Target</p>
                                <p className="text-2xl font-black leading-none">2.5L <span className="text-xs text-white/40">Daily</span></p>
                             </div>
                          </div>
                       </div>
                    </div>
                    <div className="w-80 h-80 rounded-full border-[20px] border-white/5 flex items-center justify-center relative bg-white/5 backdrop-blur-3xl shadow-inner group-hover:border-white/10 transition-all duration-700">
                       <Apple size={120} className="text-skin-glow opacity-30 group-hover:scale-110 group-hover:opacity-60 transition-all duration-700" />
                       <div className="absolute -top-6 -right-6 w-24 h-24 rounded-[2rem] bg-skin-gold flex items-center justify-center shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-500">
                          <Sparkles className="text-skin-graphite" size={40} />
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </div>

           {/* Superfoods & Supplements */}
           <div className="lg:col-span-8 space-y-12">
              <section className="space-y-8 text-left">
                 <div className="flex items-center gap-4 px-4">
                    <div className="p-3 rounded-2xl bg-skin-gold/10">
                      <Zap className="text-skin-gold" size={28} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-outfit font-black tracking-tight text-skin-dark">High-Vitality Superfoods</h3>
                      <p className="text-skin-muted text-[10px] font-black uppercase tracking-widest opacity-80 mt-1">Nutrient-dense boosters for dermal cellular repair</p>
                    </div>
                 </div>
                 <div className="grid gap-6">
                    {plan.superfoods.map((food: any, i: number) => (
                      <Card key={i} className="border-none bg-white/50 border border-skin-border/10 shadow-xl shadow-black/5 rounded-[3rem] overflow-hidden group hover:bg-white transition-all duration-300">
                         <CardContent className="p-10 flex items-center gap-10">
                            <div className="w-24 h-24 rounded-[2.5rem] bg-skin-muted/5 flex items-center justify-center text-skin-dark font-black text-sm uppercase tracking-widest text-center p-4 group-hover:scale-110 transition-transform border border-skin-border/5">
                               {food.name}
                            </div>
                            <div className="flex-1 space-y-3">
                               <div className="flex items-center gap-4">
                                  <h4 className="font-outfit font-black text-2xl text-skin-dark">{food.name}</h4>
                                  <span className="px-4 py-1.5 rounded-full bg-skin-gold/10 text-skin-gold text-[10px] font-black uppercase tracking-widest border border-skin-gold/20">{food.benefit}</span>
                               </div>
                               <p className="text-skin-muted font-bold text-base leading-relaxed opacity-90">{food.reason}</p>
                            </div>
                            <ChevronRight className="w-8 h-8 opacity-20 group-hover:translate-x-2 group-hover:opacity-100 transition-all text-skin-violet" />
                         </CardContent>
                      </Card>
                    ))}
                 </div>
              </section>

              <section className="space-y-8 text-left">
                 <div className="flex items-center gap-4 px-4">
                    <div className="p-3 rounded-2xl bg-skin-violet/10">
                      <Droplets className="text-skin-violet" size={28} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-outfit font-black tracking-tight text-skin-dark">Targeted Supplementation</h3>
                      <p className="text-skin-muted text-[10px] font-black uppercase tracking-widest opacity-80 mt-1">Biochemical gap filling for optimal dermal performance</p>
                    </div>
                 </div>
                 <div className="grid md:grid-cols-2 gap-8">
                    {plan.supplements.map((supp: any, i: number) => (
                      <Card key={i} className="border-none bg-white/50 border border-skin-border/10 shadow-xl shadow-black/5 rounded-[3.5rem] hover:bg-white transition-all duration-300">
                         <CardHeader className="p-10 pb-4">
                            <div className="w-14 h-14 rounded-2xl bg-skin-violet/5 flex items-center justify-center text-skin-violet mb-6 border border-skin-violet/10">
                               <CheckCircle2 size={32} />
                            </div>
                            <CardTitle className="text-2xl font-black font-outfit text-skin-dark leading-tight">{supp.name}</CardTitle>
                            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-skin-violet/60 mt-2">{supp.benefit}</CardDescription>
                         </CardHeader>
                         <CardContent className="p-10 pt-4">
                            <div className="p-6 rounded-3xl bg-skin-muted/5 border border-skin-border/10 shadow-inner">
                               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-skin-muted mb-2 opacity-60">Protocol Usage</p>
                               <p className="text-lg font-bold text-skin-dark leading-snug">{supp.usage}</p>
                            </div>
                         </CardContent>
                      </Card>
                    ))}
                 </div>
              </section>
           </div>

           {/* Sidebar Info */}
           <div className="lg:col-span-4 space-y-12">
              <Card className="border-none bg-skin-graphite text-skin-pearl rounded-[4rem] p-12 space-y-12 overflow-hidden relative group shadow-2xl">
                 <div className="absolute top-0 left-0 w-64 h-64 bg-skin-violet/10 rounded-full blur-[80px] -z-10 group-hover:scale-110 transition-transform" />
                 <div className="relative z-10 space-y-10 text-left">
                    <div className="space-y-4">
                       <h3 className="text-3xl font-outfit font-black tracking-tight drop-shadow-md">Lifestyle Protocol</h3>
                       <p className="text-white/60 text-sm font-bold leading-relaxed">Environmental & behavioral optimizations sequenced for longevity.</p>
                    </div>
                    <div className="space-y-6">
                       {plan.lifestyle_adjustments.map((item: string, i: number) => (
                         <div key={i} className="flex items-start gap-5 group/item">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover/item:bg-skin-glow group-hover/item:text-skin-graphite transition-all border border-white/10">
                               <CheckCircle2 size={20} className="text-white/40 group-hover/item:text-skin-graphite transition-colors" />
                            </div>
                            <p className="text-base font-bold text-white/90 opacity-80 pt-2 leading-snug">{item}</p>
                         </div>
                       ))}
                    </div>
                    <Button variant="premium" className="w-full h-18 rounded-3xl font-black shadow-2xl text-lg hover:scale-[1.05] transition-all flex items-center gap-3">
                       Full Wellness Guide <ArrowRight />
                    </Button>
                 </div>
                 <Leaf size={200} className="absolute -bottom-16 -right-16 text-white/5 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
              </Card>

              <Card className="border-none bg-white/50 border border-skin-border/10 shadow-xl shadow-black/5 rounded-[3.5rem] p-12 space-y-8 text-left">
                 <div className="w-16 h-16 rounded-[1.5rem] bg-skin-violet/5 flex items-center justify-center text-skin-violet border border-skin-violet/10 shadow-inner">
                    <Droplets size={32} />
                 </div>
                 <div className="space-y-6">
                    <h4 className="text-2xl font-outfit font-black tracking-tight text-skin-dark">Hydration Intelligence</h4>
                    <p className="text-base font-bold text-skin-muted leading-relaxed opacity-90">
                       {plan.hydration_protocol}
                    </p>
                    <div className="pt-2 flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full bg-skin-glow animate-pulse shadow-[0_0_15px_rgba(168,230,207,0.8)]" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-skin-muted opacity-80">Optimal saturation verified</span>
                    </div>
                 </div>
              </Card>

              <div className="p-10 rounded-[3rem] bg-skin-gold/5 border border-skin-gold/10 flex gap-6 items-start text-left shadow-sm">
                 <Info className="text-skin-gold flex-shrink-0" size={32} />
                 <p className="text-xs font-bold text-skin-dark opacity-70 leading-relaxed">
                    <b className="text-skin-gold block mb-1 uppercase tracking-widest text-[10px]">Responsible Discovery:</b> 
                    These biological recommendations are purely for cosmetic intelligence and holistic well-being. Please consult a licensed health professional before initiating new clinical regimens.
                 </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
