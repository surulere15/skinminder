"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumCard } from "@/components/ui/premium-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  ShieldCheck, 
  Sun, 
  Moon, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ChevronRight,
  Plus,
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
    
    // Fallback if API or DB fails (e.g. local dev without Supabase keys)
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
      <div className="p-12 flex flex-col items-center justify-center min-h-[60vh] bg-skin-dark text-content-primary">
        <Loader2 className="w-12 h-12 text-skin-violet animate-spin mb-4" />
        <p className="font-outfit font-black tracking-tight text-content-primary">Exploring your ritual...</p>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 space-y-12 max-w-6xl mx-auto bg-skin-dark min-h-screen text-content-primary">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skin-surface text-content-secondary text-[10px] font-bold uppercase tracking-widest border border-white/5 shadow-md">
            <ShieldCheck size={12} className="text-primary" /> Adaptive Routine
          </div>
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-content-primary">Daily Treatment Protocol</h1>
          <p className="text-content-secondary font-medium text-lg max-w-xl text-left">
            A specialized clinical ritual designed for your dermal profile — adapting to environment, biomarkers, and long-term goals.
          </p>
        </div>
        {!activeRoutine && (
          <Button size="lg" variant="clinical" className="h-14 px-8 shadow-lg" onClick={handleGenerateRoutine} disabled={isGenerating}>
             {isGenerating ? <><Loader2 className="mr-2 animate-spin" /> Analyzing...</> : <><ShieldCheck className="mr-2 w-5 h-5" /> Generate Protocol</>}
          </Button>
        )}
      </header>

      {activeRoutine ? (
        <div className="grid lg:grid-cols-2 gap-8 relative z-10">
           {/* Morning Routine */}
           <section className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                     <Sun size={24} />
                  </div>
                  <div className="text-left">
                     <h2 className="text-2xl font-semibold tracking-tight text-content-primary">Morning Protocol</h2>
                     <p className="text-[10px] font-bold text-content-muted uppercase tracking-widest">Dermal Activation</p>
                  </div>
               </div>
              <div className="space-y-4">
                 {activeRoutine.morning.map((stepObj: any, idx: number) => (
                     <PremiumCard key={idx} glass={false} className="p-6 flex gap-6 border-none bg-skin-elevated border border-white/5 hover:bg-white/5 transition-all rounded-[2.5rem]">
                        <div className="w-10 h-10 rounded-full bg-skin-dark flex items-center justify-center font-black text-content-primary flex-shrink-0 border border-white/5">
                           {stepObj.step}
                        </div>
                        <div className="space-y-4 text-left">
                           <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-lg text-content-primary">{stepObj.productType}</h4>
                              <div className="flex items-center gap-1 text-[10px] font-black text-content-secondary uppercase px-2 py-0.5 bg-skin-surface rounded-full border border-white/5">
                                 <Clock size={10} /> {stepObj.durationMinutes}m
                              </div>
                           </div>
                           <p className="text-sm font-medium text-content-secondary leading-relaxed opacity-90">{stepObj.action}</p>
                           <div className="p-4 rounded-2xl bg-skin-surface border border-primary/10 text-xs font-bold italic text-content-secondary/70">
                              Pro Tip: {stepObj.notes || "Consistency is key."}
                           </div>
                        </div>
                     </PremiumCard>
                 ))}
              </div>
           </section>

           {/* Night Routine */}
           <section className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-skin-surface flex items-center justify-center text-primary/60 border border-white/5">
                     <Moon size={24} />
                  </div>
                  <div className="text-left">
                     <h2 className="text-2xl font-semibold tracking-tight text-content-primary">Evening Protocol</h2>
                     <p className="text-[10px] font-bold text-content-muted uppercase tracking-widest">Cellular Recovery</p>
                  </div>
               </div>
              <div className="space-y-4">
                 {activeRoutine.night.map((stepObj: any, idx: number) => (
                     <PremiumCard key={idx} glass={false} className="p-6 flex gap-6 border-none bg-skin-elevated border border-white/5 hover:bg-white/5 transition-all rounded-[2.5rem]">
                        <div className="w-10 h-10 rounded-full bg-skin-dark flex items-center justify-center font-black text-content-primary flex-shrink-0 border border-white/5">
                           {stepObj.step}
                        </div>
                        <div className="space-y-4 text-left">
                           <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-lg text-content-primary">{stepObj.productType}</h4>
                              <div className="flex items-center gap-1 text-[10px] font-black text-content-secondary uppercase px-2 py-0.5 bg-skin-surface rounded-full border border-white/5">
                                 <Clock size={10} /> {stepObj.durationMinutes}m
                              </div>
                           </div>
                           <p className="text-sm font-medium text-content-secondary leading-relaxed opacity-90">{stepObj.action}</p>
                           <div className="p-4 rounded-2xl bg-skin-surface border border-primary/10 text-xs font-bold italic text-content-secondary/70">
                              Pro Tip: {stepObj.notes || "Consistency is key."}
                           </div>
                        </div>
                     </PremiumCard>
                 ))}
              </div>
           </section>

           {/* Routine Actions */}
            {/* Predictive Outcome Simulation */}
            <section className="lg:col-span-2 space-y-8 pt-12">
               <div className="flex items-center gap-3 ml-2">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-content-muted">Outcome Simulation</h3>
                  <div className="h-[1px] flex-1 bg-white/5" />
               </div>
               <RoutineSimulator />
            </section>

             <div className="lg:col-span-2 pt-12 flex flex-col md:flex-row gap-6 items-center border-t border-white/5">
                <div className="flex-1 space-y-1 text-left">
                   <h3 className="text-xl font-semibold tracking-tight text-content-primary">Need an adjustment?</h3>
                   <p className="text-content-secondary font-normal">Your protocol automatically adapts after every clinical skin scan.</p>
                </div>
               <div className="flex gap-4">
                   <Button variant="clinical-ghost" className="rounded-xl px-8 h-12 border-white/5" onClick={handleGenerateRoutine} disabled={isGenerating}>
                      {isGenerating ? <Loader2 className="animate-spin" /> : "Recalibrate Protocol"}
                   </Button>
                  <Button variant="clinical" className="rounded-xl px-8 h-12 shadow-lg">
                     Export Analysis Report
                  </Button>
               </div>
            </div>
        </div>
      ) : (
        <Card className="border-dashed border-4 border-white/10 bg-skin-surface/40 overflow-hidden rounded-[4rem] relative z-10 transition-all hover:border-white/20">
           <CardContent className="p-20 text-center flex flex-col items-center space-y-8">
              <div className="w-24 h-24 rounded-[2rem] bg-skin-muted/5 flex items-center justify-center text-skin-gold shadow-inner border border-skin-border/10">
                 <Zap size={48} className="fill-skin-gold" />
              </div>
               <div className="space-y-2">
                  <h2 className="text-4xl font-outfit font-black tracking-tight text-content-primary">Your Ritual Awaits</h2>
                  <p className="text-content-secondary text-xl font-medium max-w-md mx-auto opacity-90">
                     Let's build a self-care ritual that's uniquely yours. Start with a quick scan, or create a gentle baseline to begin your journey.
                  </p>
               </div>
               <div className="flex flex-col sm:flex-row gap-4 pt-4">
                   <Link href="/scan/new">
                      <Button size="lg" className="h-14 px-8 rounded-xl shadow-lg" variant="clinical">
                         Start Analysis
                      </Button>
                   </Link>
                  <Button size="lg" className="h-14 px-8 rounded-xl border border-white/10" variant="clinical-ghost" onClick={handleGenerateRoutine} disabled={isGenerating}>
                     {isGenerating ? <><Loader2 className="mr-2 animate-spin" /> Analysing profile...</> : "Generate Baseline"}
                  </Button>
               </div>
           </CardContent>
        </Card>
      )}

      {/* Routine Logic Disclaimer */}
       <footer className="bg-skin-surface shadow-2xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-skin-violet/10 flex-shrink-0 flex items-center justify-center text-skin-violet border border-white/5 shadow-lg">
             <AlertCircle />
          </div>
          <div className="space-y-1 text-center md:text-left">
             <h4 className="font-outfit font-black text-lg tracking-tight text-content-primary">Cosmetic Wellness Disclaimer</h4>
             <p className="text-sm text-content-secondary font-medium leading-relaxed opacity-80">
                SkinMinder provides general cosmetic advice only. Our routine recommendations are designed for wellness enhancement and not as medical prescriptions. Always patch test new products.
             </p>
          </div>
       </footer>
    </div>
  );
}
