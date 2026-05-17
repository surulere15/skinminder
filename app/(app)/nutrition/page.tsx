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
    <div className="min-h-screen relative overflow-hidden bg-black text-white p-6 lg:p-12">
      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-[#c9a96e]/10 blur-3xl opacity-50" />
        <div className="absolute right-[-8%] top-[10%] h-[360px] w-[360px] rounded-full bg-white/[0.03] blur-3xl opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto space-y-12 md:space-y-16 relative z-10">
        {/* Header */}
        <header className="space-y-4 pb-8 border-b border-white/5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/20 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#c9a96e]/5">
            <Apple size={14} className="text-[#c9a96e]" /> Internal Radiance Intelligence
          </div>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-white uppercase italic">Wellness Blueprint</h1>
          <p className="text-white/50 font-medium text-lg max-w-2xl border-l-2 border-[#c9a96e]/30 pl-6 py-1">
             Your skin is a living reflection of your internal ecosystem. Sequence your diet and habits for maximum biological glow.
          </p>
        </header>

        {isLoading ? (
          <div className="py-40 flex flex-col items-center justify-center space-y-10">
             <div className="relative">
               <Loader2 className="w-16 h-16 text-[#c9a96e] animate-spin opacity-20" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <Apple size={32} className="text-[#c9a96e] animate-pulse" />
               </div>
               <motion.div
                 className="absolute inset-0 rounded-full border-2 border-[#c9a96e]"
                 animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.1, 0.5] }}
                 transition={{ duration: 2, repeat: Infinity }}
               />
             </div>
             <div className="space-y-3 text-center">
               <h2 className="text-2xl font-black text-white uppercase italic tracking-[0.1em]">Synthesizing Bio-Nutrition</h2>
               <p className="text-[#c9a96e] font-black uppercase tracking-[0.3em] text-[10px] animate-pulse italic">Sequencing nutrients to dermal markers</p>
             </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-12">
             {/* Hero Narrative */}
             <div className="lg:col-span-12">
                <Card className="border-white/10 bg-white/[0.03] backdrop-blur-3xl shadow-2xl rounded-[4rem] overflow-hidden group relative">
                   <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a96e]/5 rounded-full blur-[100px] -z-10 group-hover:scale-110 transition-transform duration-1000" />
                   <CardContent className="p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-16 relative z-10 text-left">
                      <div className="space-y-10 max-w-4xl">
                         <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/20 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#c9a96e]/5">
                            Metabolic Target Matrix
                         </div>
                         <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.9]">
                            {plan.dietary_focus}
                         </h2>
                         <p className="text-white/40 text-xl font-medium leading-relaxed italic border-l-2 border-[#c9a96e]/30 pl-8">
                            "{plan.narrative}"
                         </p>
                         <div className="flex flex-wrap gap-6">
                            <div className="px-8 py-5 rounded-[2rem] bg-black/40 border border-white/10 flex items-center gap-5 shadow-inner">
                               <div className="w-12 h-12 rounded-2xl bg-[#c9a96e]/10 flex items-center justify-center text-[#c9a96e] border border-[#c9a96e]/20 shadow-lg">
                                 <Droplets size={24} />
                               </div>
                               <div>
                                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Saturation Target</p>
                                  <p className="text-2xl font-black text-white italic tracking-tight">2.5L <span className="text-xs text-white/20 uppercase tracking-widest ml-1">Daily</span></p>
                               </div>
                            </div>
                         </div>
                      </div>
                      <div className="w-80 h-80 rounded-full border-[10px] border-white/5 flex items-center justify-center relative bg-white/[0.01] backdrop-blur-3xl shadow-2xl group-hover:border-white/10 transition-all duration-700">
                         <Apple size={120} className="text-[#c9a96e] opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700" />
                         <div className="absolute top-0 right-0 w-24 h-24 rounded-[2rem] bg-[#c9a96e] flex items-center justify-center shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-500">
                            <Sparkles className="text-black" size={40} />
                         </div>
                      </div>
                   </CardContent>
                </Card>
             </div>

             {/* Superfoods & Supplements */}
             <div className="lg:col-span-8 space-y-12">
                <section className="space-y-10 text-left">
                   <div className="flex items-center gap-5 px-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#c9a96e]/10 flex items-center justify-center text-[#c9a96e] border border-[#c9a96e]/20 shadow-lg">
                        <Zap size={28} />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">High-Vitality Superfoods</h3>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Nutrient-dense boosters for dermal cellular repair</p>
                      </div>
                   </div>
                   <div className="grid gap-8">
                      {plan.superfoods.map((food: any, i: number) => (
                        <Card key={i} className="border-white/10 bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] overflow-hidden group hover:bg-white/[0.05] transition-all duration-300 shadow-2xl">
                           <CardContent className="p-8 md:p-10 flex flex-col sm:flex-row items-center gap-10">
                              <div className="w-24 h-24 rounded-[2.5rem] bg-black border border-white/10 flex items-center justify-center text-[#c9a96e] font-black text-[10px] uppercase tracking-widest text-center px-4 group-hover:scale-110 shadow-inner overflow-hidden relative">
                                 <span className="relative z-10">{food.name}</span>
                                 <div className="absolute inset-0 bg-[#c9a96e]/5 group-hover:bg-[#c9a96e]/10 transition-colors" />
                              </div>
                              <div className="flex-1 space-y-4 w-full">
                                 <div className="flex flex-wrap items-center gap-4">
                                    <h4 className="text-2xl font-black text-white uppercase italic tracking-tight">{food.name}</h4>
                                    <span className="px-3 py-1 rounded bg-emerald-400/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-400/20">{food.benefit}</span>
                                 </div>
                                 <p className="text-white/40 font-medium text-base leading-relaxed">{food.reason}</p>
                              </div>
                              <ChevronRight className="w-8 h-8 text-white/10 group-hover:translate-x-2 group-hover:text-[#c9a96e] transition-all hidden sm:block" />
                           </CardContent>
                        </Card>
                      ))}
                   </div>
                </section>

                <section className="space-y-10 text-left">
                   <div className="flex items-center gap-5 px-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/40 shadow-lg">
                        <Droplets size={28} />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">Supplements Core</h3>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Biochemical gap filling for optimal dermal performance</p>
                      </div>
                   </div>
                   <div className="grid md:grid-cols-2 gap-8">
                      {plan.supplements.map((supp: any, i: number) => (
                        <Card key={i} className="border-white/10 bg-white/[0.03] backdrop-blur-3xl rounded-[3.5rem] hover:bg-white/[0.05] transition-all duration-300 shadow-2xl">
                           <CardHeader className="p-8 md:p-10 pb-4 border-b border-white/5">
                              <div className="w-14 h-14 rounded-2xl bg-[#c9a96e]/10 flex items-center justify-center text-[#c9a96e] mb-6 border border-[#c9a96e]/20 shadow-lg">
                                 <CheckCircle2 size={32} />
                              </div>
                              <CardTitle className="text-2xl font-black text-white uppercase italic tracking-tight leading-tight">{supp.name}</CardTitle>
                              <CardDescription className="text-[10px] font-black uppercase tracking-widest text-[#c9a96e]/60 mt-3">{supp.benefit}</CardDescription>
                           </CardHeader>
                           <CardContent className="p-8 md:p-10 pt-8">
                              <div className="p-8 rounded-[2.5rem] bg-black/40 border border-white/10 shadow-inner group/item hover:border-[#c9a96e]/30 transition-all">
                                 <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">Clinical Protocol</p>
                                 <p className="text-lg font-bold text-white/80 leading-snug italic">"{supp.usage}"</p>
                              </div>
                           </CardContent>
                        </Card>
                      ))}
                   </div>
                </section>
             </div>

             {/* Sidebar Info */}
             <div className="lg:col-span-4 space-y-10">
                <Card className="border-white/10 bg-white/[0.03] backdrop-blur-3xl rounded-[4rem] p-10 space-y-12 overflow-hidden relative group shadow-2xl">
                   <div className="absolute top-0 left-0 w-64 h-64 bg-[#c9a96e]/5 rounded-full blur-[80px] -z-10 group-hover:scale-110 transition-transform" />
                   <div className="relative z-10 space-y-10 text-left">
                      <div className="space-y-3">
                         <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">Lifestyle Nodes</h3>
                         <p className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-relaxed">Environmental & behavioral optimizations sequenced for longevity.</p>
                      </div>
                      <div className="space-y-6">
                         {plan.lifestyle_adjustments.map((item: string, i: number) => (
                           <div key={i} className="flex items-start gap-5 group/item">
                              <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center flex-shrink-0 group-hover/item:border-[#c9a96e]/40 group-hover/item:bg-[#c9a96e]/5 transition-all shadow-lg">
                                 <CheckCircle2 size={24} className="text-emerald-400 group-hover/item:scale-110 transition-transform" />
                              </div>
                              <p className="text-base font-medium text-white/50 pt-2 leading-snug italic group-hover/item:text-white transition-colors">{item}</p>
                           </div>
                         ))}
                      </div>
                      <Button variant="flagship" className="w-full h-18 shadow-2xl shadow-[#c9a96e]/10">
                         Full Wellness Matrix <ArrowRight className="ml-3" />
                      </Button>
                   </div>
                   <Leaf size={240} className="absolute -bottom-16 -right-16 text-[#c9a96e]/10 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                </Card>

                <Card className="border-white/10 bg-white/[0.03] backdrop-blur-3xl rounded-[3.5rem] p-10 space-y-8 text-left shadow-2xl">
                   <div className="w-16 h-16 rounded-[1.5rem] bg-[#c9a96e]/10 flex items-center justify-center text-[#c9a96e] border border-[#c9a96e]/20 shadow-lg">
                      <Droplets size={32} />
                   </div>
                   <div className="space-y-6">
                      <h4 className="text-2xl font-black text-white uppercase italic tracking-tight">Hydration Intelligence</h4>
                      <p className="text-base font-medium text-white/50 leading-relaxed italic border-l border-white/10 pl-6">
                         {plan.hydration_protocol}
                      </p>
                      <div className="pt-2 flex items-center gap-3">
                         <div className="w-2.5 h-2.5 rounded-full bg-[#c9a96e] animate-pulse shadow-[0_0_15px_rgba(201,169,110,0.8)]" />
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a96e]/40">Optimal saturation verified</span>
                      </div>
                   </div>
                </Card>

                <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 flex gap-6 items-start text-left shadow-2xl backdrop-blur-sm">
                   <Info className="text-[#c9a96e] flex-shrink-0 mt-1" size={24} />
                   <p className="text-xs font-black uppercase tracking-widest text-white/30 leading-relaxed italic">
                      <b className="text-[#c9a96e] block mb-1">Clinical Boundary Note:</b> 
                      Recommendations are purely for cosmetic intelligence. Please consult a health professional before initiating clinical regimens.
                   </p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
