"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Fingerprint, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkinIdentityCardProps {
  archetype: string;
  skinAge: number;
  skinTwin: number;
  confidence: string | number;
  locationContext?: string;
}

export function SkinIdentityCard({ 
  archetype, 
  skinAge, 
  skinTwin,
  confidence,
  locationContext = "Global Skin Intelligence"
}: SkinIdentityCardProps) {
  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative w-[380px] h-[660px] bg-white rounded-[3rem] overflow-hidden shadow-soft border border-skin-lavender flex flex-col items-center p-12 text-center group"
    >
      {/* Background Atmosphere - Precision Calibration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-skin-primary/5 blur-[120px] rounded-full opacity-40 shrink-0" />
        <div className="absolute inset-0 bg-soft-studio opacity-40" />
        
        {/* Iconic Visual Signature: Analysis Ring Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full border-[0.5px] border-skin-primary/10 border-dashed animate-radar-spin" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border-[1px] border-skin-primary/5" />
      </div>

      {/* Header: Signature Badge */}
      <div className="relative z-10 flex flex-col items-center gap-4 mb-2">
        <div className="w-14 h-14 rounded-2xl bg-skin-lavender flex items-center justify-center text-skin-primary border border-skin-primary/10 shadow-soft">
          <Sparkles size={32} strokeWidth={1.5} />
        </div>
        <div className="space-y-1">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-skin-primary italic">Bio-Identity Verified</p>
        </div>
      </div>

      {/* Main Content: The Analysis Reveal */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-center gap-14">
        
        {/* 1. Skin Archetype */}
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-skin-slate/30 italic">Archetype Journey</p>
          <h2 className="text-4xl sm:text-5xl font-black text-skin-slate tracking-tighter leading-[0.85] italic uppercase">
            {archetype}
          </h2>
        </div>

        {/* 2. Skin Age (The Anchor) */}
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-skin-slate/20 italic">Skin Chronology</p>
          <div className="text-8xl font-black text-skin-slate tracking-tighter tabular-nums italic leading-none flex items-baseline justify-center">
            {skinAge}<span className="text-3xl text-skin-primary/40 ml-1">Y</span>
          </div>
        </div>

        {/* 3. High-Precision Metrics */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="p-6 rounded-[2rem] bg-skin-lavender border border-skin-primary/10 space-y-2 backdrop-blur-3xl">
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-skin-slate/30">Skin Twin</p>
            <p className="text-2xl font-black text-skin-primary italic tracking-tighter">{skinTwin}%</p>
          </div>
          <div className="p-6 rounded-[2rem] bg-skin-lavender border border-skin-primary/10 space-y-2 backdrop-blur-3xl">
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-skin-slate/30">Confidence</p>
            <p className="text-2xl font-black text-skin-slate italic tracking-tighter uppercase">{typeof confidence === 'number' ? `${confidence}%` : confidence}</p>
          </div>
        </div>
      </div>

      {/* Footer: Product Truth */}
      <div className="relative z-10 w-full mt-auto pt-10 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <p className="text-skin-slate font-black text-[18px] tracking-[0.3em] uppercase italic leading-none">SKINMINDER</p>
          <p className="text-skin-primary/30 text-[8px] font-black uppercase tracking-[0.4em] italic leading-none">Beauty Intelligence Archive</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="h-px w-6 bg-skin-lavender" />
          <div className="flex items-center gap-2 text-skin-slate/20">
            <ShieldCheck size={14} className="text-skin-primary/60" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em]">Elite Dermal Analysis</span>
          </div>
          <div className="h-px w-6 bg-skin-lavender" />
        </div>
      </div>

      {/* Atmospheric Accents */}
      <div className="absolute top-12 right-12 w-2 h-2 rounded-full bg-[rgb(var(--skin-teal))]/20 blur-sm animate-pulse" />
      <div className="absolute bottom-12 left-12 w-1.5 h-1.5 rounded-full bg-[rgb(var(--skin-blue))]/20 blur-sm animate-pulse" />
    </motion.div>
  );
}
