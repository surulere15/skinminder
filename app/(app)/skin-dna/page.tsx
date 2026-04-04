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
    if (t === 'low' || t === 'normal') return 'text-success bg-success/10 border-success/20';
    if (t === 'mild' || t === 'oily') return 'text-primary bg-primary/10 border-primary/20';
    if (t === 'moderate' || t === 'dry') return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    if (t === 'high' || t === 'severe') return 'text-destructive bg-destructive/10 border-destructive/20';
    if (t === 'combination') return 'text-primary bg-primary/10 border-primary/20';
    
    return 'text-content-secondary bg-skin-surface border-white/5';
  };

  if (loading) {
     return (
        <div className="flex-1 min-h-[60vh] flex items-center justify-center bg-background">
           <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
     );
  }

  if (!dna && !isSynthesizing) {
     return (
        <div className="flex-1 p-8 pt-20 flex flex-col items-center justify-center text-center max-w-2xl mx-auto bg-background">
           <div className="w-20 h-20 rounded-2xl bg-skin-surface flex items-center justify-center mb-8 relative border border-white/5 shadow-xl">
              <Dna className="w-10 h-10 text-primary absolute animate-pulse" />
           </div>
           
           <h1 className="text-4xl font-semibold tracking-tight mb-4 text-content-primary">Discover Your Biological Identity</h1>
           <p className="text-content-secondary text-lg mb-10 leading-relaxed font-normal opacity-90">
             Our intelligence engine aggregates your entire dermal history, identifying your permanent skin archetypes, sensitivities, and core strengths.
           </p>

           <Button variant="clinical" size="lg" className="h-16 px-12" onClick={handleSynthesize}>
             Synthesize Identity Profile
           </Button>
        </div>
     );
  }

  return (
    <div className="flex-1 space-y-12 p-4 md:p-8 pt-6 pb-20 max-w-5xl mx-auto bg-skin-pearl min-h-screen">
        {/* Synthesizing Loading State */}
        <AnimatePresence>
          {isSynthesizing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6"
            >
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                  <Dna className="absolute inset-0 m-auto w-10 h-10 text-primary animate-pulse" />
                </div>
                <h2 className="text-3xl font-semibold mb-4 text-content-primary">Sequencing Identity Profile...</h2>
                <p className="text-content-secondary font-medium text-lg max-w-sm">Aggregating historical scans, biological markers, and dermal trends.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-white/5">
           <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-skin-surface border border-white/5 flex items-center justify-center shadow-xl">
                 <Fingerprint className="w-10 h-10 text-primary" />
              </div>
              <div className="text-left space-y-1">
                <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest">
                   <ShieldCheck size={14} className="text-success" /> Verified Clinical Identity
                </div>
                <h1 className="text-4xl font-semibold tracking-tight text-content-primary capitalize">{dna?.skinType} Archetype</h1>
                <p className="text-content-muted font-bold uppercase tracking-widest text-[10px]">Biological Resilience Rank: {dna?.resilienceScore}/100</p>
              </div>
           </div>
           <Button variant="clinical-ghost" className="h-12 px-6" onClick={handleSynthesize} disabled={isSynthesizing}>
              Resynthesize Profile
           </Button>
        </div>

        {/* Summary */}
        <Card className="bg-skin-surface border border-white/5 shadow-2xl relative overflow-hidden rounded-2xl transition-all hover:bg-white/[0.02]">
          <CardContent className="p-10 md:p-14 relative z-10 text-left">
             <h3 className="text-primary font-bold text-[10px] uppercase tracking-widest mb-6 flex items-center gap-3">
                <Dna size={16} /> Clinical Intelligence Summary
             </h3>
             <p className="text-2xl md:text-3xl leading-relaxed font-medium text-content-primary">
                "{dna?.summary}"
             </p>
          </CardContent>
        </Card>

        {/* Core Traits Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {[
             { label: "Hydration Baseline", value: dna?.hydrationBaseline, icon: Droplets, color: "text-primary" },
             { label: "Sensitivity Level", value: dna?.sensitivityLevel, icon: Zap, color: "text-destructive" },
             { label: "Pigmentation Tendency", value: dna?.pigmentationTendency, icon: Sun, color: "text-amber-500" },
             { label: "Resilience Score", value: dna?.resilienceScore, icon: ShieldCheck, color: "text-success", isScore: true }
           ].map((trait, idx) => (
             <Card key={idx} className="bg-skin-surface border border-white/5 shadow-xl rounded-2xl overflow-hidden text-center hover:bg-white/[0.02] transition-all">
               <CardContent className="p-8 space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-background mx-auto flex items-center justify-center border border-white/5">
                     <trait.icon className={cn("w-6 h-6", trait.color)} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-content-muted mb-3">{trait.label}</p>
                    {trait.isScore ? (
                      <span className="text-4xl font-semibold tracking-tight text-content-primary">
                         {trait.value}
                      </span>
                    ) : (
                      <span className={cn("inline-flex px-4 py-1.5 rounded-full text-[10px] font-bold border uppercase tracking-widest", getTraitColor(String(trait.value)))}>
                         {trait.value}
                      </span>
                    )}
                  </div>
               </CardContent>
             </Card>
           ))}
        </div>

        {/* Strengths and Vulnerabilities */}
        <div className="grid md:grid-cols-2 gap-8">
           <Card className="bg-skin-surface border border-white/5 shadow-xl rounded-2xl overflow-hidden text-left">
             <div className="bg-success/5 px-10 py-6 border-b border-success/10">
               <h3 className="font-semibold text-xl flex items-center gap-3 text-success">
                 Core Strengths
               </h3>
             </div>
             <CardContent className="p-10">
                <ul className="space-y-6">
                  {dna?.coreStrengths.map((str, i) => (
                     <li key={i} className="flex items-start gap-4 text-content-primary font-medium text-lg leading-tight">
                        <span className="w-6 h-6 rounded bg-success/10 text-success flex items-center justify-center flex-shrink-0 font-bold text-sm border border-success/20">
                          +
                        </span>
                        {str}
                     </li>
                  ))}
                </ul>
             </CardContent>
           </Card>

           <Card className="bg-skin-surface border border-white/5 shadow-xl rounded-2xl overflow-hidden text-left">
             <div className="bg-destructive/5 px-10 py-6 border-b border-destructive/10">
               <h3 className="font-semibold text-xl flex items-center gap-3 text-destructive">
                 Key Vulnerabilities
               </h3>
             </div>
             <CardContent className="p-10">
                <ul className="space-y-6">
                  {dna?.keyVulnerabilities.map((vuln, i) => (
                     <li key={i} className="flex items-start gap-4 text-content-primary font-medium text-lg leading-tight">
                        <span className="w-6 h-6 rounded bg-destructive/10 text-destructive flex items-center justify-center flex-shrink-0 font-bold text-sm border border-destructive/20">
                          -
                        </span>
                        {vuln}
                     </li>
                  ))}
                </ul>
             </CardContent>
           </Card>
        </div>
    </div>
  );
}
