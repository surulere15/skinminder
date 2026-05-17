"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumCard } from "@/components/ui/premium-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  ShieldCheck, 
  Sun, 
  Moon, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ChevronRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { RoutineSimulator } from "@/components/ui/routine-simulator";

export default function RoutinePage() {
  const [activeRoutine, setActiveRoutine] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function loadRoutine() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data } = await supabase
          .from("routine_history")
          .select("*")
          .eq("user_id", user.id)
          .order("recorded_at", { ascending: false })
          .limit(1)
          .single();
        
        if (data) {
          try {
            setActiveRoutine(JSON.parse(data.notes));
          } catch (e) {
            console.error("Failed to parse routine notes", e);
          }
        }
      } catch (err) {
        console.warn("Could not load routine history:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadRoutine();
  }, []);

  const handleGenerateRoutine = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/routine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concerns: ["texture", "dryness"],
          skinType: "combination",
          difficulty: "intermediate"
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveRoutine(data);
        setIsGenerating(false);
        return;
      }
    } catch (err) {
      console.warn("API unavailable, falling back to local simulation:", err);
    }
    
    setTimeout(() => {
      setActiveRoutine({
        morning: [
          { step: 1, productType: "Gentle Foaming Cleanser", action: "Wash face with lukewarm water", durationMinutes: 2, notes: "Avoid hot water which strips moisture." },
          { step: 2, productType: "Vitamin C Serum", action: "Apply 3-5 drops to face and neck", durationMinutes: 1, notes: "Brightens and protects from pollution." },
          { step: 3, productType: "Broad Spectrum SPF 50", action: "Apply liberally as the final step", durationMinutes: 2, notes: "Essential for protecting your progress." },
        ],
        night: [
          { step: 1, productType: "Oil Cleanser", action: "Massage dry skin to dissolve makeup", durationMinutes: 2, notes: "First step of double cleansing." },
          { step: 2, productType: "Hyaluronic Acid", action: "Apply to damp skin", durationMinutes: 1, notes: "Locks in hydration overnight." },
          { step: 3, productType: "Retinol Cream", action: "Pea-sized amount 3x a week", durationMinutes: 1, notes: "Start slow to avoid irritation." },
        ],
        difficultyLevel: "beginner",
        summary: "This routine matches your recent scan's hydration needs."
      });
      setIsGenerating(false);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[60vh] bg-black text-white relative">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-diagnostic text-white/40">Exploring your ritual...</p>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-16 space-y-16 max-w-7xl mx-auto bg-black min-h-full text-white relative">
      {/* Header: Diagnostic Title */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10 border-b border-white/5 pb-12">
        <div className="space-y-4 text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20 shadow-glow">
            <ShieldCheck size={14} /> Adaptive Routine Protocol
          </div>
          <h1 className="text-4xl lg:text-6xl text-diagnostic leading-none">Daily Treatment Protocol</h1>
          <p className="text-white/50 font-medium text-lg max-w-xl text-left border-l-2 border-primary/30 pl-6">
            A specialized clinical ritual designed for your dermal profile — adapting to environment, biomarkers, and long-term goals.
          </p>
        </div>
        {!activeRoutine && (
          <Button size="lg" variant="clinical" className="h-16 px-10 shadow-glow" onClick={handleGenerateRoutine} disabled={isGenerating}>
             {isGenerating ? <><Loader2 className="mr-3 animate-spin" /> Sequencing...</> : <><ShieldCheck className="mr-3 w-5 h-5" /> Generate Protocol</>}
          </Button>
        )}
      </header>

      {activeRoutine ? (
        <div className="grid lg:grid-cols-2 gap-12 relative z-10">
           {/* Morning Routine: Activation */}
           <section className="space-y-8">
               <div className="flex items-center gap-4 ml-2">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-glow">
                     <Sun size={28} />
                  </div>
                  <div className="text-left">
                     <h2 className="text-3xl text-diagnostic">Morning Protocol</h2>
                     <p className="text-label text-primary/60">Dermal Activation Phase</p>
                  </div>
               </div>
              <div className="space-y-6">
                 {activeRoutine.morning.map((stepObj: any, idx: number) => (
                    <PremiumCard key={idx} variant="elevated" className="p-8 flex gap-8 border-white/5 group hover:border-primary/20 transition-all duration-500">
                      <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center font-black text-primary flex-shrink-0 border border-white/10 shadow-elite group-hover:scale-110 transition-transform">
                        {stepObj.step}
                      </div>
                      <div className="space-y-5 text-left flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-xl text-white uppercase italic tracking-tight">{stepObj.productType}</h4>
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-primary/60 uppercase px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
                            <Clock size={12} /> {stepObj.durationMinutes}m
                          </div>
                        </div>
                        <p className="text-base font-medium text-white/50 leading-relaxed">{stepObj.action}</p>
                        <div className="p-5 rounded-2xl bg-black/40 border border-primary/10 text-xs font-bold italic text-primary/50 relative overflow-hidden">
                          <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary/40" />
                          Diagnostic Note: {stepObj.notes || "Consistency is vital for molecular absorption."}
                        </div>
                      </div>
                    </PremiumCard>
                 ))}
              </div>
           </section>

           {/* Night Routine: Recovery */}
           <section className="space-y-8">
               <div className="flex items-center gap-4 ml-2">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center text-white/40 border border-white/10">
                     <Moon size={28} />
                  </div>
                  <div className="text-left">
                     <h2 className="text-3xl text-diagnostic">Evening Protocol</h2>
                     <p className="text-label">Cellular Recovery Phase</p>
                  </div>
               </div>
              <div className="space-y-6">
                 {activeRoutine.night.map((stepObj: any, idx: number) => (
                    <PremiumCard key={idx} variant="elevated" className="p-8 flex gap-8 border-white/5 group hover:border-white/20 transition-all duration-500">
                      <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center font-black text-white/40 flex-shrink-0 border border-white/5 shadow-elite group-hover:scale-110 transition-transform">
                        {stepObj.step}
                      </div>
                      <div className="space-y-5 text-left flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-xl text-white uppercase italic tracking-tight opacity-90">{stepObj.productType}</h4>
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-white/30 uppercase px-3 py-1 bg-white/5 rounded-full border border-white/5">
                            <Clock size={12} /> {stepObj.durationMinutes}m
                          </div>
                        </div>
                        <p className="text-base font-medium text-white/40 leading-relaxed">{stepObj.action}</p>
                        <div className="p-5 rounded-2xl bg-black/40 border border-white/5 text-xs font-bold italic text-white/30 relative overflow-hidden">
                          <div className="absolute top-0 left-0 bottom-0 w-1 bg-white/10" />
                          Diagnostic Note: {stepObj.notes || "Consistency is vital for overnight restoration."}
                        </div>
                      </div>
                    </PremiumCard>
                 ))}
              </div>
           </section>

           {/* Outcome Simulation */}
            <section className="lg:col-span-2 space-y-10 pt-16">
               <div className="flex items-center gap-4 ml-2">
                  <h3 className="text-label">Biological Outcome Simulation</h3>
                  <div className="h-[1px] flex-1 bg-white/5" />
               </div>
               <RoutineSimulator />
            </section>

            {/* Bottom Actions: Calibration */}
            <div className="lg:col-span-2 pt-16 flex flex-col md:flex-row gap-8 items-center border-t border-white/5">
                <div className="flex-1 space-y-2 text-left">
                   <h3 className="text-2xl font-black uppercase italic text-white">Need an adjustment?</h3>
                   <p className="text-white/40 font-medium text-lg">Your protocol automatically adapts after every clinical skin scan to match your shifting dermal patterns.</p>
                </div>
               <div className="flex gap-4">
                  <Button variant="clinical-ghost" className="h-14 px-10" onClick={handleGenerateRoutine} disabled={isGenerating}>
                     {isGenerating ? <Loader2 className="animate-spin" /> : "Recalibrate Protocol"}
                  </Button>
                  <Button variant="clinical" className="h-14 px-10 shadow-glow">
                     Export Analysis
                  </Button>
               </div>
            </div>
        </div>
      ) : (
        <PremiumCard variant="master" className="p-16 text-center flex flex-col items-center space-y-10 relative z-10 transition-all hover:border-primary/20">
           <div className="w-28 h-28 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary shadow-glow border border-primary/20">
              <Zap size={56} className="fill-primary" />
           </div>
            <div className="space-y-4">
               <h2 className="text-5xl lg:text-6xl text-diagnostic">Your Ritual Awaits</h2>
               <p className="text-white/40 text-xl font-medium max-w-lg mx-auto">
                  Sequencing a self-care ritual that's uniquely yours. Start with a clinical scan to calibrate your baseline.
               </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 pt-6">
                <Link href="/scan/new">
                   <Button size="lg" variant="flagship" className="h-16 px-12 shadow-glow">
                      Start Analysis
                   </Button>
                </Link>
               <Button size="lg" variant="secondary" className="h-16 px-12" onClick={handleGenerateRoutine} disabled={isGenerating}>
                  {isGenerating ? <><Loader2 className="mr-3 animate-spin" /> Analysing...</> : "Generate Baseline"}
               </Button>
            </div>
        </PremiumCard>
      )}

      {/* Wellness Disclaimer */}
      <footer className="glass-master rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary border border-primary/20 shadow-glow">
           <AlertCircle size={28} />
        </div>
        <div className="space-y-2 text-center md:text-left">
           <h4 className="text-xl text-diagnostic">Cosmetic Wellness Disclaimer</h4>
           <p className="text-sm text-white/40 font-medium leading-relaxed max-w-3xl">
              SkinMinder provides general cosmetic insights based on AI pattern recognition. recommendations are for wellness enhancement only and do not constitute medical prescriptions. Always patch test and consult a clinical professional for medical diagnosis.
           </p>
        </div>
      </footer>
    </div>
  );
}
