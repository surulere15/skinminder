"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Lock, 
  Heart, 
  Info, 
  CheckCircle2, 
  Scale,
  Cloud,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F4F6FF] selection:bg-[#14B8A6]/30 selection:text-white font-sans pt-40 pb-32 px-8">
      <div className="max-w-5xl mx-auto space-y-24">
        {/* Header */}
        <header className="space-y-8 text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-dermal-grid opacity-[0.03] -z-10" />
           <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#14B8A6]/10 text-[#14B8A6] text-[10px] font-black uppercase tracking-[0.5em] border border-[#14B8A6]/20 italic">
              <ShieldCheck size={14} /> RESPONSIBILITY_FRAMEWORK_V9.2
           </div>
           <h1 className="text-6xl md:text-[100px] font-black tracking-tighter leading-[0.8] text-white uppercase italic">Safety & <br /><span className="text-white/20">Privacy.</span></h1>
           <p className="text-xl md:text-2xl text-white/40 font-bold max-w-3xl mx-auto leading-tight italic tracking-tight">
              Intelligence is nothing without trust. We've built SkinMinder on a foundation of ethical AI, absolute data sovereignty, and responsible biological claims.
           </p>
        </header>

        {/* Core Principles */}
        <div className="grid gap-10">
           {[
             {
               title: "Inference Intelligence",
               icon: Info,
               description: "SkinMinder is a cosmetic and wellness instrumentation platform. Our AI resolves aesthetic and health-baseline biometrics to provide supportive protocols. We do NOT diagnose, treat, or prevent skin diseases."
             },
             {
               title: "Ethical Visual Synthesis",
               icon: Heart,
               description: "Our predictive simulations and longitudinal projections are carefully calibrated to be realistic and scientifically grounded. We strictly avoid 'perfectionist' biases and promote biological health via precision data."
             },
             {
               title: "End-to-End Sovereignty",
               icon: Lock,
               description: "Your biometric data is yours alone. We use military-grade encryption for all optical signals and scan results. We never sell your skin intelligence to third parties. All data is localized by default."
             }
           ].map((item, i) => (
             <Card key={i} className="border border-white/5 bg-[#1E293B]/40 rounded-[3rem] p-12 flex flex-col md:flex-row gap-12 items-start shadow-diagnostic transition-all hover:border-[#14B8A6]/20">
                <div className="w-20 h-20 rounded-[2rem] bg-[#14B8A6]/10 border border-[#14B8A6]/20 flex items-center justify-center flex-shrink-0 text-[#14B8A6] shadow-diagnostic">
                   <item.icon size={40} />
                </div>
                <div className="space-y-5">
                   <h3 className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none">{item.title}</h3>
                   <p className="text-lg font-bold text-white/40 italic leading-relaxed tracking-tight">
                      {item.description}
                   </p>
                </div>
             </Card>
           ))}
        </div>

        {/* Commitment Checklist */}
        <section className="p-16 rounded-[5rem] bg-[#1E293B] text-white space-y-12 relative overflow-hidden shadow-2xl border border-white/5">
           <div className="space-y-3 relative z-10">
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">Professional Commitments</h3>
              <p className="text-[#14B8A6] font-black text-[11px] uppercase tracking-[0.5em] italic">Verified standards for Bio-Tech excellence.</p>
           </div>
           <div className="grid md:grid-cols-2 gap-8 relative z-10">
              {[
                "Zero medical diagnosis claims",
                "Strict ingredient safety cross-checks",
                "Anonymized aggregate population data",
                "Transparent AI confidence intervals",
                "Instant data deletion at any time",
                "Expert-vetted prompt architecture"
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-6 group">
                   <div className="w-10 h-10 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#14B8A6] group-hover:text-[#0F172A] transition-all duration-500">
                      <CheckCircle2 size={20} className="text-[#14B8A6] group-hover:text-[#0F172A]" />
                   </div>
                   <p className="text-lg font-bold text-white/60 group-hover:text-white transition-colors italic tracking-tight">{c}</p>
                </div>
               ))}
           </div>
           {/* Background Glow */}
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#14B8A6]/5 rounded-full blur-[100px]" />
        </section>

        {/* Legal Footer Note */}
        <div className="text-center space-y-6 pt-16 border-t border-white/5">
           <div className="flex items-center justify-center gap-3 text-[#14B8A6]">
              <Scale size={20} />
              <p className="text-[11px] font-black uppercase tracking-[0.6em] italic">REGULATORY_STATUS</p>
           </div>
           <p className="text-sm font-bold text-white/30 max-w-4xl mx-auto leading-relaxed italic tracking-tight">
             SkinMinder is compliant with standard cosmetic wellness guidelines. Our AI services bridge the gap between beauty retail and personal care, providing informational support that should be used in conjunction with professional dermatological advice. Proprietary photogrammetric engine v9.2.4-STABLE.
           </p>
        </div>
      </div>
    </div>
  );
}
