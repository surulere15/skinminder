"use client";

import React from "react";
import { motion } from "framer-motion";
import { ScanFrame } from "@/components/ui/scan-frame";
import { Badge } from "@/components/ui/badge";
import { Zap, ShieldCheck, Activity } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function CapabilityHero() {
  return (
    <div className="relative w-full flex flex-col items-center py-24 pb-40">
      {/* 1. THE INSTRUMENT (Priority #1) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-5xl aspect-[16/10] md:aspect-[21/9] flex items-center justify-center group"
      >
        {/* Glow Effects - Soft Lavender Studio */}
        <div className="absolute inset-0 bg-skin-primary/5 blur-[140px] rounded-full opacity-60 pointer-events-none" />
        
        {/* The Frame */}
        <div className="w-full h-full max-w-4xl relative">
          <ScanFrame className="shadow-soft shadow-skin-primary/5">
            {/* Biometric Oval Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 1.5 }}
                className="w-[65%] h-[85%] border-2 border-skin-primary/20 rounded-[100%] border-dashed flex items-center justify-center"
              >
                <div className="w-[95%] h-[95%] border border-skin-primary/5 rounded-[100%] bg-skin-primary/5 backdrop-blur-[4px]" />
              </motion.div>
            </div>

            {/* Metric Preview Floating Cards - Clinical Style */}
            <div className="absolute top-1/2 -right-12 -translate-y-1/2 space-y-6 hidden lg:block">
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="p-6 rounded-2xl bg-white/90 backdrop-blur-3xl border border-skin-lavender shadow-soft w-56 space-y-3"
              >
                 <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-skin-primary uppercase tracking-[0.3em]">Hydration Index</span>
                    <Activity className="text-skin-primary w-4 h-4" />
                 </div>
                 <div className="text-3xl font-black tracking-tighter text-skin-slate italic">64%</div>
                 <div className="h-1 bg-skin-lavender rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "64%" }}
                      transition={{ delay: 1.5, duration: 1 }}
                      className="h-full bg-skin-primary" 
                    />
                 </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="p-6 rounded-2xl bg-white/90 backdrop-blur-3xl border border-skin-lavender shadow-soft w-56 space-y-3"
              >
                 <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-skin-primary uppercase tracking-[0.3em]">Melanin Map</span>
                    <Zap className="text-skin-primary w-4 h-4" />
                 </div>
                 <div className="text-3xl font-black tracking-tighter text-skin-slate uppercase">Optimized</div>
                 <div className="text-[9px] font-black text-skin-slate/20 uppercase tracking-[0.3em] leading-none">Baseline Match</div>
              </motion.div>
            </div>
          </ScanFrame>
          
          {/* Internal HUD Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 border border-skin-primary/5 rounded-full flex items-center justify-center overflow-hidden pointer-events-none">
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 border-t border-skin-primary/20 rounded-full"
             />
             <Activity className="text-skin-primary/10 w-16 h-16" />
          </div>
        </div>

        {/* Tactical Badges */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute -left-6 md:-left-12 top-1/3 z-20"
        >
          <div className="px-6 py-3 rounded-2xl bg-white border border-skin-lavender shadow-soft flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-skin-success animate-pulse shadow-[0_0_8px_rgba(104,211,145,0.4)]" />
            <span className="text-[11px] font-black text-skin-primary uppercase tracking-[0.2em]">Studio Capture Active</span>
          </div>
        </motion.div>
      </motion.div>

      {/* 2. PRODUCT IDENTITY + CTA (Secondary Layer) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-20 text-center space-y-12 max-w-4xl relative z-10 px-6"
      >
        <div className="space-y-6">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-skin-slate uppercase italic leading-[0.8] px-4">
            AI Skin Intelligence<br /><span className="text-skin-primary opacity-20">Elite System</span>
          </h1>
          <p className="text-skin-slate/40 text-xl md:text-2xl font-bold leading-relaxed max-w-3xl mx-auto italic tracking-tight">
            Measure hydration, pigmentation, and biological patterns in 10 seconds.
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <Link href="/try">
            <Button className="h-24 px-20 text-3xl rounded-[2.5rem] font-black shadow-2xl bg-skin-primary hover:bg-skin-primary/90 text-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-8 group italic">
              Begin Journey <ChevronRight className="w-10 h-10 group-hover:translate-x-4 transition-transform stroke-[3]" />
            </Button>
          </Link>
          <div className="flex items-center gap-10 opacity-30">
             <div className="flex items-center gap-3">
                <ShieldCheck size={14} className="text-skin-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Privacy-First Protocol</span>
             </div>
             <div className="w-1.5 h-1.5 rounded-full bg-skin-slate/20" />
             <div className="flex items-center gap-3">
                <Activity size={14} className="text-skin-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Elite Scientific Calibration</span>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
