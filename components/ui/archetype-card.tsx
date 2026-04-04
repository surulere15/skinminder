"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Users, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ArchetypeCardProps {
  name: string;
  description: string;
  populationPercent: number;
  confidence?: number;
  skinAge?: number;
  skinTwin?: number;
  id?: string;
  className?: string;
}

export function ArchetypeCard({ 
  name, 
  description, 
  populationPercent,
  confidence,
  skinAge,
  skinTwin,
  id,
  className 
}: ArchetypeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      <Card className={cn(
      "p-6 sm:p-12 relative overflow-hidden group hover:border-skin-primary/20 transition-all duration-700 bg-white border-skin-lavender shadow-soft rounded-[3rem]",
      className
    )}>
      {/* Diagnostic Motifs - Precision Grid & Circular Sampling */}
      <div className="absolute inset-0 bg-soft-studio opacity-[0.4] pointer-events-none" />
      <div className="absolute inset-[-100px] border border-skin-lavender rounded-full pointer-events-none" />
      
      {/* 2. Archetype Motif (Circular Sampling UI) */}
      <motion.div 
        whileHover={{ rotate: 5, scale: 1.05 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute top-0 right-0 p-6 sm:p-12 opacity-[0.1] pointer-events-none"
      >
         <svg width="180" height="180" viewBox="0 0 240 240" className="sm:w-[260px] sm:h-[260px] stroke-skin-primary fill-none">
            <circle cx="120" cy="120" r="100" strokeWidth="0.5" strokeDasharray="3 6" />
            <circle cx="120" cy="120" r="85" strokeWidth="1" opacity="0.3" />
            <path d="M120 10 L120 30 M230 120 L210 120 M120 230 L120 210 M10 120 L30 120" strokeWidth="2" strokeLinecap="round" />
         </svg>
      </motion.div>

    <div className="space-y-10 sm:space-y-14 relative z-10">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
         <div className="space-y-4">
            <div className="label text-[rgb(var(--skin-teal))]">
               BIOLOGICAL_STATION_ID
            </div>
            {/* 1. Technical ArchetypeName */}
            <h1 className="h1 text-[rgb(var(--skin-navy))] leading-[0.9]">
               {name}
            </h1>
         </div>
         
         {/* 4. Population Segment Analysis */}
         <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1">
            <div className="flex items-center gap-3 text-[rgb(var(--skin-blue))]">
               <Users size={24} strokeWidth={2} />
               <span className="text-3xl sm:text-4xl font-black tracking-tighter tabular-nums italic">{populationPercent}%</span>
            </div>
            <span className="text-[9px] font-bold text-[rgb(var(--skin-text-secondary))] uppercase tracking-[0.3em] opacity-60 text-right">
               GLOBAL_DISTRIBUTION
            </span>
         </div>
      </div>

      {/* Diagnostic Passport Data */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-12 sm:gap-20 pt-10 border-t border-skin-lavender">
         {id && (
           <div className="space-y-2">
              <span className="text-[10px] font-black text-skin-slate/40 uppercase tracking-[0.4em] leading-none">ARCHIVE ID</span>
              <p className="text-[11px] font-black tracking-[0.2em] text-skin-primary uppercase">{id.slice(0, 13)}</p>
           </div>
         )}
         {confidence !== undefined && (
           <div className="space-y-2">
              <span className="text-[10px] font-black text-skin-slate/40 uppercase tracking-[0.4em] leading-none">CONFIDENCE</span>
              <p className="text-3xl font-black tracking-tighter text-skin-slate uppercase italic leading-none">{confidence}% <span className="text-[10px] text-skin-primary not-italic tracking-[0.2em] font-black ml-2">[ELITE]</span></p>
           </div>
         )}
         {skinAge !== undefined && (
           <div className="space-y-2">
              <span className="text-[10px] font-black text-skin-slate/40 uppercase tracking-[0.4em] leading-none">SKIN AGE</span>
              <p className="text-3xl font-black tracking-tighter text-skin-slate uppercase italic leading-none">{skinAge}.0</p>
           </div>
         )}
         {skinTwin !== undefined && (
           <div className="space-y-2">
              <span className="text-[10px] font-black text-skin-slate/40 uppercase tracking-[0.4em] leading-none">IDENTITY MATCH</span>
              <p className="text-3xl font-black tracking-tighter text-skin-slate uppercase italic leading-none">{skinTwin}%</p>
           </div>
         )}
      </div>

      {/* 3. Clinical Summary */}
      <div className="flex gap-8 items-start">
         <div className="w-1.5 h-16 bg-skin-primary/20 rounded-full shrink-0" />
         <p className="text-xl md:text-2xl font-bold text-skin-slate/80 leading-relaxed italic max-w-4xl tracking-tight">
            "{description}"
         </p>
      </div>
    </div>
  </Card>
    </motion.div>
  );
}
