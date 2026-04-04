"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  AlertCircle,
  Camera,
  Sparkles,
  TrendingUp,
  Users
} from "lucide-react";
import Link from "next/link";
import { AIBrain } from "@/components/ui/ai-brain";
import { FloatingCards } from "@/components/ui/floating-cards";
import { Particles } from "@/components/ui/particles";
import { ScanDemo } from "@/components/landing/scan-demo";
import { IngredientAnalysis } from "@/components/landing/ingredient-analysis";
import { RoutineTimeline } from "@/components/landing/routine-timeline";
import { ArchetypeCard } from "@/components/ui/archetype-card";
import { MetricCard } from "@/components/ui/metric-card";
import { CapabilityHero } from "@/components/landing/capability-hero";

export default function LandingPage() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    <div className="flex flex-col min-h-screen bg-background text-skin-slate selection:bg-skin-primary/30 selection:text-skin-slate font-sans overflow-x-hidden">
      {/* 1. HEADER - Elite Beauty-Tech Navigation */}
      <header className="fixed top-0 w-full z-[100] px-10 h-24 flex items-center justify-between backdrop-blur-3xl bg-white/70 border-b border-skin-lavender shadow-soft">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-skin-primary to-skin-blue-soft flex items-center justify-center shadow-lg">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-skin-slate leading-none">SkinMinder</span>
            <span className="text-[9px] font-black text-skin-primary uppercase tracking-[0.4em] mt-0.5">Soft-Premium Intelligence</span>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-12">
           <Link href="/how-it-works" className="text-[10px] font-black text-skin-slate/40 hover:text-skin-primary transition-colors uppercase tracking-[0.4em] leading-none">The Science</Link>
           <Link href="/safety" className="text-[10px] font-black text-skin-slate/40 hover:text-skin-primary transition-colors uppercase tracking-[0.4em] leading-none">Privacy</Link>
           <Link href="/partners" className="text-[10px] font-black text-skin-slate/40 hover:text-skin-primary transition-colors uppercase tracking-[0.4em] leading-none">Atelier</Link>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/login" className="text-[10px] font-black text-skin-slate/40 hover:text-skin-primary transition-colors uppercase tracking-[0.4em] leading-none">Sign In</Link>
          <Link href="/try">
            <Button className="rounded-2xl h-12 px-8 bg-skin-primary hover:bg-skin-primary/90 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all hover:scale-105 active:scale-95">Discover Your Skin</Button>
          </Link>
        </div>
      </header>

      {/* MASTER PAGE CONTAINER */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 pt-24 pb-20 flex flex-col gap-40">
        
        {/* LAYER 1: SCAN INTERFACE (Capability Hero) */}
        <section className="pt-20">
           <CapabilityHero />
        </section>

        {/* LAYER 2: PRODUCT IDENTITY (Integrated Intelligence) */}
        <section className="w-full py-24 flex flex-col items-center gap-20 relative">
            <div className="absolute inset-0 bg-soft-studio opacity-40 pointer-events-none" />
            <div className="flex flex-col items-center gap-6 text-center z-10">
               <Badge className="bg-skin-lavender text-skin-primary border border-skin-primary/10 font-black tracking-[0.3em] uppercase text-[10px] px-8 py-2.5 rounded-full">
                  Skin Tracking
               </Badge>
               <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-skin-slate uppercase italic leading-[0.85]">
                 See What's<br /><span className="text-skin-primary opacity-40">Actually Working</span>
               </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-container w-full px-6 z-10">
               {[
                 { title: "Weekly Scans", desc: "Track your skin with quick photos using your phone." },
                 { title: "Measure Progress", desc: "See hydration, texture, and pigmentation scores." },
                 { title: "Compare Results", desc: "View historical data to understand what helps." },
                 { title: "Personalized Tips", desc: "Get recommendations based on your actual data." }
               ].map((item, i) => (
                 <div key={i} className="space-y-6 p-10 rounded-[2.5rem] bg-white border border-skin-lavender group hover:border-skin-primary/30 transition-all duration-700 shadow-soft">
                    <div className="w-10 h-10 rounded-xl bg-skin-lavender flex items-center justify-center text-skin-primary font-black text-sm group-hover:bg-skin-primary group-hover:text-white transition-all">
                       0{i + 1}
                    </div>
                     <h4 className="text-xl font-black text-skin-slate uppercase italic tracking-tighter leading-none">{item.title}</h4>
                     <p className="text-base font-bold text-skin-slate/40 italic leading-relaxed tracking-tight">{item.desc}</p>
                 </div>
               ))}
            </div>
         </section>

        {/* LAYER 3: PROOF OF INTELLIGENCE (Diagnostic Output) */}
        <section className="w-full space-y-24 py-12 relative">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-skin-primary/0 to-skin-primary/20" />
           <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-skin-lavender border border-skin-primary/10 text-skin-primary text-[10px] font-black uppercase tracking-[0.3em]">
                Science Output
              </div>
               <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-skin-slate uppercase italic leading-[0.8]">The Clinical<br /><span className="text-skin-primary/20">Archive.</span></h2>
              <p className="text-skin-slate/40 text-lg md:text-xl font-bold italic max-w-2xl mx-auto tracking-tight">Technical instrumentation revealing the biological truth beneath the surface.</p>
           </div>
           
           <div className="grid lg:grid-cols-1 gap-16">
              <ArchetypeCard 
                name="PIH-Prone Reactivator"
                description="Hyper-responsive melanocyte activity detected in sub-dermal layers. Your skin structure requires inflammatory stabilization to prevent long-term pigmentation clustering."
                populationPercent={18.4}
                confidence={98}
                skinAge={26}
                skinTwin={4.2}
                className="shadow-soft border-skin-lavender bg-white"
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard label="Hydration" value={62} trend="up" showConfidence={false} />
                <MetricCard label="Pigmentation" value={48} trend="stable" showConfidence={false} />
                <MetricCard label="Texture" value={72} trend="up" showConfidence={false} />
                <MetricCard label="Overall Score" value={78} trend="up" showConfidence={false} />
              </div>
           </div>
        </section>

        {/* LAYER 4: SYSTEM DESIGN (3-Step Diagram) */}
        <section className="w-full space-y-20 py-24">
           <div className="grid md:grid-cols-2 gap-32 items-center">
              <div className="space-y-12 text-left">
                <Badge className="bg-skin-mint text-skin-success border border-skin-success/10 font-black tracking-[0.3em] uppercase text-[10px] px-5 py-2 rounded-full">Methodology</Badge>
                 <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-skin-slate leading-[0.8] uppercase italic">Diagnostic<br />Elegance.</h2>
                <div className="space-y-16 pt-8">
                  {[
                    { step: "CAPTURE", desc: "Secure high-fidelity optical signals through our atelier module." },
                    { step: "ANALYSIS", desc: "Intelligent vision orchestrates hydration and pigment mapping." },
                    { step: "JOURNEY", desc: "Generate your unique skin pathvector based on biological twin data." }
                  ].map((item, i) => (
                    <div key={item.step} className="flex gap-10 group relative">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-skin-primary shadow-[0_0_12px_rgba(157,164,255,0.4)] group-hover:scale-125 transition-transform" />
                        {i < 2 && <div className="w-px flex-1 bg-skin-lavender" />}
                      </div>
                      <div className="space-y-3">
                         <h4 className="text-2xl font-black text-skin-slate uppercase tracking-tighter italic leading-none">{item.step}</h4>
                        <p className="text-skin-slate/40 text-lg font-bold italic tracking-tight leading-relaxed max-w-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative aspect-square rounded-[3.5rem] overflow-hidden border border-skin-lavender bg-white shadow-soft p-16 flex flex-col items-center justify-center gap-10 group transition-all hover:border-skin-primary/20">
                 <div className="absolute inset-0 bg-soft-studio opacity-[0.4]" />
                 <AIBrain className="scale-[1.8] relative z-10" />
                 <div className="relative z-10 text-center space-y-3">
                    <p className="text-[11px] font-black text-skin-primary uppercase tracking-[0.4em] animate-pulse">Intelligence Synchronizing...</p>
                    <p className="text-[10px] font-black text-skin-slate/20 uppercase tracking-[0.2em] italic leading-none">Await Clinical Connection</p>
                 </div>
              </div>
           </div>
        </section>

        {/* LAYER 5: POPULATION INTELLIGENCE (Network Effect) */}
        <section className="w-full py-32 flex flex-col items-center gap-24 relative overflow-hidden">
           <div className="absolute inset-0 bg-soft-studio opacity-[0.4]" />
           <div className="text-center space-y-8 max-w-4xl z-10">
               <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-skin-slate uppercase italic leading-[0.8] px-4">
                The Beauty<br /><span className="text-skin-primary">Alliance.</span>
              </h2>
              <p className="text-skin-slate/40 text-lg md:text-2xl font-bold italic tracking-tight px-8">
                Every scan recalibrates the global precision baseline. Our decentralized infrastructure ensures high-fidelity diagnostics for everyone, everywhere.
              </p>
           </div>

           <div className="w-full max-w-5xl px-12 z-10">
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 md:gap-4">
                 <div className="absolute top-1/2 left-0 right-0 h-px bg-skin-primary/10 hidden md:block -translate-y-1/2 z-0" />
                 
                 {[
                   { label: "Sampling", icon: "Camera" },
                   { label: "Validations", icon: "CheckCircle2" },
                   { label: "Prototypes", icon: "Sparkles" },
                   { label: "Inference", icon: "TrendingUp" }
                 ].map((node, i) => (
                   <motion.div 
                     key={node.label}
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     transition={{ delay: i * 0.2 }}
                     className="relative z-10 flex flex-col items-center gap-6 group"
                   >
                      <div className="w-24 h-24 rounded-3xl bg-white border border-skin-lavender shadow-soft flex items-center justify-center group-hover:border-skin-primary/40 group-hover:scale-110 group-hover:bg-skin-primary/5 transition-all duration-700">
                         {node.icon === "Camera" && <Camera className="text-skin-primary w-10 h-10" />}
                         {node.icon === "CheckCircle2" && <CheckCircle2 className="text-skin-primary w-10 h-10" />}
                         {node.icon === "Sparkles" && <Sparkles className="text-skin-primary w-10 h-10" />}
                         {node.icon === "TrendingUp" && <TrendingUp className="text-skin-primary w-10 h-10" />}
                      </div>
                      <div className="text-center">
                         <p className="text-[11px] font-black uppercase tracking-[0.4em] text-skin-slate italic leading-none">{node.label}</p>
                      </div>
                   </motion.div>
                 ))}
              </div>
           </div>

           <div className="grid md:grid-cols-2 gap-16 max-w-5xl text-center md:text-left z-10">
              <div className="space-y-6 p-10 rounded-3xl bg-white/20 border border-skin-lavender">
                 <h4 className="text-2xl font-black text-skin-slate uppercase italic tracking-tighter leading-none">Network Velocity</h4>
                 <p className="text-lg font-bold text-skin-slate/40 italic leading-relaxed tracking-tight">
                    Scale-driven photogrammetry accelerates sub-dermal mapping, translating global patterns into localized intelligence.
                 </p>
              </div>
              <div className="space-y-6 p-10 rounded-3xl bg-white/20 border border-skin-lavender">
                 <h4 className="text-2xl font-black text-skin-slate uppercase italic tracking-tighter leading-none">Diagnostic Moat</h4>
                 <p className="text-lg font-bold text-skin-slate/40 italic leading-relaxed tracking-tight">
                    Proprietary inference engines resolve optical signals into research-grade biomarkers with high institutional confidence.
                 </p>
              </div>
           </div>
        </section>

        {/* LAYER 7: FINAL CALL TO ACTION (Discover Your Archetype) */}
        <section className="py-60 w-full flex flex-col items-center text-center gap-16 border-t border-skin-lavender relative">
          <div className="absolute inset-0 bg-diffuse-glow opacity-30 pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-8 relative z-10"
          >
             <h2 className="text-5xl md:text-[100px] font-black tracking-[-0.05em] text-skin-slate leading-[0.75] uppercase italic">
              Define Your<br /><span className="text-skin-primary italic underline decoration-skin-primary/20 underline-offset-8">Bio-Identity.</span>
            </h2>
            <p className="text-skin-slate/40 text-xl md:text-3xl font-black italic tracking-tighter px-8">
              Initialize your 10-second longitudinal analysis.
            </p>
          </motion.div>
 
          <Link href="/try" className="relative z-10">
            <Button className="h-40 px-32 text-5xl rounded-[3rem] font-black shadow-2xl bg-skin-primary hover:bg-skin-primary/90 text-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-12 group italic">
              Begin Scan <ChevronRight className="w-16 h-16 group-hover:translate-x-6 transition-transform stroke-[4]" />
            </Button>
          </Link>
          
          <div className="flex flex-col items-center gap-4 relative z-10">
             <p className="text-skin-primary/60 text-[11px] font-black uppercase tracking-[0.4em]">No Registration Required • Absolute Privacy Guarantee</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full border-t border-skin-lavender py-32 flex flex-col lg:flex-row items-center justify-between gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-skin-slate/40">
           <div className="flex flex-wrap justify-center gap-16">
             <Link href="/privacy" className="hover:text-skin-primary transition-colors">Safety Protocol</Link>
             <Link href="/terms" className="hover:text-skin-primary transition-colors">Terms of Use</Link>
             <Link href="/safety" className="hover:text-skin-primary transition-colors">Bio-Analysis Verification</Link>
           </div>
           <div className="flex flex-col lg:items-end gap-3 text-center lg:text-right">
              <p className="opacity-40">© 2026 SkinMinder Institutional. [All Rights Reserved].</p>
              <p className="text-[9px] opacity-20 font-sans tracking-normal normal-case">Beauty-Tech Orchestration Station v2.4</p>
           </div>
        </footer>
      </main>
    </div>
  );
}
