"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dna, ShieldCheck, Zap, Sun, Fingerprint, Loader2, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SkinDnaProfile } from "@/schemas/user";
import { cn } from "@/lib/utils";

export default function SkinDnaPage() {
  const [dna, setDna] = useState<SkinDnaProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  useEffect(() => {
    fetchDna();
  }, []);

  const fetchDna = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/skin-dna');
      if (res.ok) {
        const data = await res.json();
        if (data.skin_dna) {
           setDna(data.skin_dna);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSynthesize = async () => {
    try {
      setIsSynthesizing(true);
      const res = await fetch('/api/skin-dna', { method: 'POST' });
      if (res.ok) {
         const data = await res.json();
         setDna(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Fun helper to map traits to skin tokens
  const getTraitColor = (trait: string) => {
    const t = trait.toLowerCase();
    if (t === 'low' || t === 'normal') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (t === 'mild' || t === 'oily') return 'text-[#c9a96e] bg-[#c9a96e]/10 border-[#c9a96e]/20';
    if (t === 'moderate' || t === 'dry') return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    if (t === 'high' || t === 'severe') return 'text-red-400 bg-red-400/10 border-red-400/20';
    if (t === 'combination') return 'text-[#c9a96e] bg-[#c9a96e]/10 border-[#c9a96e]/20';
    
    return 'text-content-secondary bg-skin-surface border-white/5';
  };

   if (loading) {
      return (
         <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 relative overflow-hidden">
            <div className="fixed inset-0 -z-10">
              <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-[#c9a96e]/10 blur-3xl opacity-50" />
            </div>
            <div className="relative">
              <Loader2 className="w-12 h-12 text-[#c9a96e] animate-spin" />
              <motion.div
                className="absolute inset-0 rounded-full bg-[#c9a96e]/20"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <p className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-[#c9a96e] animate-pulse italic">Sequencing Biological Identity...</p>
         </div>
      );
   }

   if (!dna && !isSynthesizing) {
      return (
         <div className="min-h-screen relative overflow-hidden bg-black text-white p-6 lg:p-12 flex flex-col items-center justify-center text-center">
            <div className="fixed inset-0 -z-10">
              <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-[#c9a96e]/10 blur-3xl opacity-50" />
            </div>
            
            <div className="max-w-3xl space-y-12 relative z-10">
               <div className="w-24 h-24 rounded-[2.5rem] bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto shadow-2xl backdrop-blur-3xl relative group">
                  <Dna className="w-12 h-12 text-[#c9a96e] animate-pulse group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 border border-[#c9a96e]/10 rounded-[2.5rem] animate-ping opacity-20" />
               </div>
               
               <div className="space-y-6">
                  <h1 className="text-4xl lg:text-7xl font-black tracking-tighter text-white uppercase italic leading-none">Biological Identity</h1>
                  <p className="text-white/40 text-xl font-medium leading-relaxed max-w-2xl mx-auto border-l-2 border-[#c9a96e]/30 pl-8">
                    Our intelligence engine aggregates your entire dermal history, identifying your permanent skin archetypes and behavioral resilient markers.
                  </p>
               </div>

               <Button variant="flagship" className="h-20 px-16 shadow-2xl shadow-[#c9a96e]/10" onClick={handleSynthesize}>
                 Synthesize Identity Profile
               </Button>
            </div>
         </div>
      );
   }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white p-6 lg:p-12">
        {/* Background Blobs */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-[#c9a96e]/10 blur-3xl opacity-50" />
          <div className="absolute right-[-8%] top-[10%] h-[360px] w-[360px] rounded-full bg-white/[0.03] blur-3xl opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto space-y-12 md:space-y-16 relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-8 border-b border-white/5">
           <div className="flex items-center gap-8">
              <div className="w-24 h-24 rounded-[2.5rem] bg-white/[0.02] border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-3xl group transition-all hover:bg-white/[0.05]">
                 <Fingerprint className="w-12 h-12 text-[#c9a96e] group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-left space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-400/5">
                   <ShieldCheck size={14} /> Clinical Identity Unlocked
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase italic leading-none">{dna?.skinType} Archetype</h1>
                <p className="text-white/20 font-black uppercase tracking-[0.2em] text-[10px] ml-1">Biological Resilience Rank: <span className="text-[#c9a96e]">{dna?.resilienceScore}/100</span></p>
              </div>
           </div>
           <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/10 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all" onClick={handleSynthesize} disabled={isSynthesizing}>
              Resynthesize Profile
           </Button>
        </header>

        {/* Summary */}
        <Card className="bg-white/[0.03] border border-white/10 shadow-2xl relative overflow-hidden rounded-[3rem] transition-all hover:bg-white/[0.05] backdrop-blur-3xl group">
           <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a96e]/5 rounded-full blur-[100px] -z-10 group-hover:scale-110 transition-transform duration-1000" />
           <CardContent className="p-12 md:p-20 relative z-10 text-left">
              <h3 className="text-[#c9a96e] font-black text-[10px] uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                 <Dna size={20} /> Clinical Intelligence Summary
              </h3>
              <p className="text-3xl md:text-5xl leading-tight font-black text-white italic uppercase tracking-tighter">
                 "{dna?.summary}"
              </p>
           </CardContent>
        </Card>

        {/* Core Traits Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Hydration Baseline", value: dna?.hydrationBaseline, icon: Droplets, color: "text-[#c9a96e]" },
              { label: "Sensitivity Level", value: dna?.sensitivityLevel, icon: Zap, color: "text-red-400" },
              { label: "Pigmentation Tendency", value: dna?.pigmentationTendency, icon: Sun, color: "text-amber-500" },
              { label: "Resilience Score", value: dna?.resilienceScore, icon: ShieldCheck, color: "text-emerald-400", isScore: true }
            ].map((trait, idx) => (
              <Card key={idx} className="bg-white/[0.03] border border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden text-center hover:bg-white/[0.05] transition-all backdrop-blur-3xl group">
                <CardContent className="p-10 space-y-8">
                   <div className="w-16 h-16 rounded-2xl bg-black mx-auto flex items-center justify-center border border-white/10 shadow-xl group-hover:scale-110 transition-transform">
                      <trait.icon className={cn("w-8 h-8", trait.color)} />
                   </div>
                   <div className="space-y-2">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">{trait.label}</p>
                     {trait.isScore ? (
                       <p className="text-5xl font-black tracking-tighter text-white italic">
                          {trait.value}
                       </p>
                     ) : (
                       <div className="pt-2">
                         <span className={cn("inline-flex px-4 py-1.5 rounded-full text-[9px] font-black border uppercase tracking-widest shadow-lg", getTraitColor(String(trait.value)))}>
                            {trait.value}
                         </span>
                       </div>
                     )}
                   </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Strengths and Vulnerabilities */}
        <div className="grid md:grid-cols-2 gap-10 pb-20">
           <Card className="bg-white/[0.03] border border-white/10 shadow-2xl rounded-[3rem] overflow-hidden text-left backdrop-blur-3xl group">
             <div className="bg-emerald-400/5 px-10 py-8 border-b border-white/5">
               <h3 className="font-black text-2xl flex items-center gap-4 text-emerald-400 uppercase italic tracking-tight">
                 Core Strengths
               </h3>
             </div>
             <CardContent className="p-10 lg:p-14">
                <ul className="space-y-8">
                  {dna?.coreStrengths.map((str, i) => (
                     <li key={i} className="flex items-start gap-6 text-white/80 font-medium text-xl leading-snug italic group-hover:text-white transition-colors">
                        <div className="w-8 h-8 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center flex-shrink-0 font-black text-lg border border-emerald-400/20 shadow-lg shadow-emerald-400/5">
                          +
                        </div>
                        {str}
                     </li>
                  ))}
                </ul>
             </CardContent>
           </Card>

           <Card className="bg-white/[0.03] border border-white/10 shadow-2xl rounded-[3rem] overflow-hidden text-left backdrop-blur-3xl group">
             <div className="bg-red-400/5 px-10 py-8 border-b border-white/5">
               <h3 className="font-black text-2xl flex items-center gap-4 text-red-400 uppercase italic tracking-tight">
                 Key Vulnerabilities
               </h3>
             </div>
             <CardContent className="p-10 lg:p-14">
                <ul className="space-y-8">
                  {dna?.keyVulnerabilities.map((vuln, i) => (
                     <li key={i} className="flex items-start gap-6 text-white/80 font-medium text-xl leading-snug italic group-hover:text-white transition-colors">
                        <div className="w-8 h-8 rounded-xl bg-red-400/10 text-red-400 flex items-center justify-center flex-shrink-0 font-black text-lg border border-red-400/20 shadow-lg shadow-red-400/5">
                          -
                        </div>
                        {vuln}
                     </li>
                  ))}
                </ul>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
