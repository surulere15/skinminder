"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Camera, 
  Cpu, 
  Sparkles, 
  Beaker, 
  LineChart, 
  ShieldCheck,
  ChevronRight,
  Zap,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Scan Your Skin",
    description: "Take a photo of your face using your phone. Our AI analyzes hydration, texture, and pigmentation levels.",
    icon: Camera,
    color: "bg-skin-violet/10 text-skin-violet"
  },
  {
    title: "Get Your Analysis",
    description: "Our AI compares your skin against proven benchmarks to understand your unique skin profile and what's affecting it.",
    icon: Cpu,
    color: "bg-skin-lavender/10 text-skin-lavender"
  },
  {
    title: "Track Over Time",
    description: "Scan weekly to see what's actually working. Compare results and build a routine backed by data, not guesswork.",
    icon: Sparkles,
    color: "bg-skin-gold/10 text-skin-gold"
  }
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F4F6FF] selection:bg-[#14B8A6]/30 selection:text-white font-sans">
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-10 relative z-10">
           <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#14B8A6]/10 text-[#14B8A6] text-[10px] font-black uppercase tracking-[0.5em] border border-[#14B8A6]/20 italic">
              SYSTEM_CORE_LOGIC_V9.2
           </div>
          <h1 className="text-6xl md:text-[120px] font-black tracking-tighter leading-[0.8] text-white uppercase italic">
               See What's<span className="text-white/20"><br />Working.</span>
            </h1>
            <p className="text-xl md:text-3xl text-white/40 font-bold max-w-4xl mx-auto leading-tight italic tracking-tight">
               Stop guessing. Track your skin's progress with weekly scans and see real results over time.
            </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-6">
              <Link href="/try">
                <Button className="h-20 px-16 rounded-[2rem] font-black text-xl bg-[#14B8A6] text-[#0F172A] hover:bg-[#14B8A6]/90 shadow-2xl italic tracking-tighter">
                   Initialize_First_Scan
                </Button>
              </Link>
              <Button variant="outline" className="h-20 px-12 rounded-[2rem] font-black gap-4 border-white/5 text-white/40 hover:bg-white/5 hover:text-white transition-all italic text-lg tracking-tighter">
                 <div className="w-12 h-12 rounded-full bg-[#14B8A6] flex items-center justify-center text-[#0F172A] shadow-lg shadow-[#14B8A6]/20"><Play size={20} fill="currentColor" /></div> VISION_TECH_DEMO
              </Button>
           </div>
        </div>
        {/* Abstract Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#14B8A6]/5 rounded-full blur-[140px] -z-10" />
        <div className="absolute inset-0 bg-dermal-grid opacity-[0.03] -z-10" />
      </section>

      {/* The 1-2-3 Step Section */}
      <section className="py-40 px-8 bg-[#1E293B]/30 border-y border-white/5 relative">
         <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-20">
            {[
              {
                title: "Optical Capture",
                description: "Our high-frequency imaging system captures dermal signals at a microscopic level, resolving hydration peaks and texture valleys invisible to the naked eye.",
                icon: Camera,
              },
              {
                title: "Inference Synthesis",
                description: "Seven specialized neural engines cross-reference capture data against 1.2M+ skin archetypes to resolve your unique biological station.",
                icon: Cpu,
              },
              {
                title: "Pathvector Generation",
                description: "We translate machine logic into actionable intelligence—providing your Bio-ID transcript and a longitudinal protocol that evolves with your environment.",
                icon: Sparkles,
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="space-y-8 group"
              >
                 <div className="w-24 h-24 rounded-[2.5rem] bg-[#1E293B] border border-[#14B8A6]/20 flex items-center justify-center shadow-diagnostic text-[#14B8A6] group-hover:border-[#14B8A6] group-hover:bg-[#14B8A6]/5 transition-all duration-700">
                    <step.icon size={40} />
                 </div>
                 <div className="space-y-5">
                    <h3 className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none">{step.title}</h3>
                    <p className="text-lg font-bold text-white/40 italic leading-relaxed tracking-tight group-hover:text-white/60 transition-colors">
                       {step.description}
                    </p>
                 </div>
              </motion.div>
            ))}
         </div>
      </section>

      {/* Narrative Section 1 */}
      <section className="py-48 px-8 relative overflow-hidden">
         <div className="absolute inset-0 bg-radial-glow opacity-10" />
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-32">
            <div className="flex-1 space-y-12 text-left">
               <div className="space-y-16">
                  <div className="space-y-8">
                     <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] text-white uppercase italic">Machine<br /><span className="text-white/20">Objective.</span></h2>
                     <p className="text-xl md:text-2xl font-bold text-white/40 italic leading-snug tracking-tight">
                        While consumer-grade apps focus on the surface, SkinMinder resolves deeper. Our engines are trained on proprietary datasets to detect early signs of cumulative barrier damage and lipid depletion.
                     </p>
                  </div>
                  <div className="grid grid-cols-2 gap-12">
                     <div className="space-y-3">
                        <h4 className="text-5xl font-black tracking-tighter text-[#14B8A6] italic">98.2%</h4>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic">SCAN_FIDELITY</p>
                     </div>
                     <div className="space-y-3">
                        <h4 className="text-5xl font-black tracking-tighter text-[#14B8A6] italic">1.2M+</h4>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic">ARCHETYPE_VAULT</p>
                     </div>
                  </div>
               </div>
               <Button className="h-16 px-12 rounded-2xl font-black text-lg shadow-diagnostic bg-[#14B8A6] text-[#0F172A] hover:bg-[#14B8A6]/90 italic tracking-tighter">
                  TECHNICAL_DEEP_DIVE <ChevronRight className="ml-2" />
               </Button>
            </div>
            <div className="flex-1 w-full aspect-square bg-[#1E293B]/40 rounded-[6rem] border border-[#14B8A6]/20 shadow-diagnostic relative overflow-hidden flex items-center justify-center group transition-all hover:border-[#14B8A6]/40">
               <div className="absolute inset-0 bg-dermal-grid opacity-[0.05]" />
               <div className="w-80 h-80 rounded-full border border-white/5 flex items-center justify-center relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-t-2 border-[#14B8A6] rounded-full shadow-[0_0_15px_#14B8A6]" 
                  />
                  <Sparkles size={100} className="text-[#14B8A6]/20" />
               </div>
               <div className="absolute bottom-12 left-12 p-8 rounded-[2rem] bg-[#0F172A]/90 backdrop-blur-xl shadow-diagnostic border border-[#14B8A6]/30 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#14B8A6] italic">DETECTION_MODE</p>
                  <p className="font-black text-xl text-white uppercase italic tracking-tighter leading-none">Multispectral_Analysis</p>
               </div>
            </div>
         </div>
      </section>

      {/* Safety Banner */}
      <section className="py-32 px-8">
         <div className="max-w-7xl mx-auto rounded-[5rem] bg-[#1E293B] text-white p-12 md:p-24 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden shadow-2xl border border-white/5">
            <div className="space-y-8 relative z-10 flex-1 text-left">
               <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-[0.4em] border border-white/10 italic">
                  <ShieldCheck size={14} className="text-[#14B8A6]" /> PRINCIPLES_OF_INTELLIGENCE
               </div>
               <h2 className="text-6xl font-black tracking-tighter leading-[0.85] uppercase italic">The Trust<br /><span className="text-[#14B8A6]">Layer.</span></h2>
               <p className="text-white/40 text-xl font-bold max-w-xl italic tracking-tight leading-relaxed">
                  SkinMinder is not a medical device. We don't diagnose. We empower you with data-driven protocols that celebrate your unique biology.
               </p>
               <Link href="/safety">
                 <Button className="bg-[#14B8A6] text-[#0F172A] hover:bg-[#14B8A6]/90 font-black rounded-[1.5rem] h-16 px-10 mt-6 italic tracking-tighter text-lg">
                    COMMITMENTS_MANIFESTO
                 </Button>
               </Link>
            </div>
            <div className="w-full md:w-1/3 aspect-square bg-[#0F172A]/50 rounded-[4rem] flex flex-col items-center justify-center p-12 gap-6 border border-white/5 relative group hover:border-[#14B8A6]/20 transition-all">
               <div className="w-28 h-28 rounded-3xl bg-[#14B8A6]/10 border border-[#14B8A6]/20 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-[#14B8A6] group-hover:text-[#0F172A] transition-all duration-700">
                  <Zap size={40} className="text-[#14B8A6] group-hover:text-[#0F172A]" />
               </div>
               <p className="text-center font-black text-[11px] uppercase tracking-[0.4em] text-white/20 italic">
                 End-to-End_Encryption_v4.0
               </p>
            </div>
            {/* Background Glow */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#14B8A6]/5 rounded-full blur-[120px] -z-1" />
         </div>
      </section>
    </div>
  );
}
