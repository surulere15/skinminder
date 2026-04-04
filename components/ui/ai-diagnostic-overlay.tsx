"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AIDiagnosticOverlayProps {
  className?: string;
  markers?: { x: number; y: number; label: string }[];
}

export function AIDiagnosticOverlay({ className, markers = [] }: AIDiagnosticOverlayProps) {
  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
      {/* 0. Dermal Grid Motif - Visual Signature */}
      <div className="absolute inset-0 bg-dermal-grid opacity-10" />

      {/* 1. Cinematic Scanning Line */}
      <motion.div
        className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[rgb(var(--skin-teal))]/40 to-transparent z-20"
        initial={{ top: "0%" }}
        animate={{ top: "100%" }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* 2. Medical Crosshair (Center) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 opacity-20">
         <svg viewBox="0 0 100 100" className="w-full h-full text-[rgb(var(--skin-teal))]">
            <line x1="50" y1="0" x2="50" y2="12" stroke="currentColor" strokeWidth="1.5" />
            <line x1="50" y1="88" x2="50" y2="100" stroke="currentColor" strokeWidth="1.5" />
            <line x1="0" y1="50" x2="12" y2="50" stroke="currentColor" strokeWidth="1.5" />
            <line x1="88" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
         </svg>
      </div>

      {/* 3. Localized Diagnostic Markers (Hotspots) */}
      {markers.map((marker, i) => (
        <motion.div
          key={i}
          className="absolute z-30 flex flex-col items-start"
          style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.4, duration: 1.2, ease: "easeOut" }}
        >
          {/* Diagnostic Pulse Dot */}
          <div className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
            <div className="w-2.5 h-2.5 rounded-full bg-[rgb(var(--skin-teal))] shadow-[0_0_12px_rgba(var(--skin-teal),0.8)]" />
            <motion.div 
               className="absolute w-10 h-10 rounded-full border border-[rgb(var(--skin-teal))]/40"
               animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
               transition={{ duration: 4, repeat: Infinity }}
            />
            {/* Corner Bracket (Top-Left) */}
            <div className="absolute -top-5 -left-5 w-3 h-3 border-t border-l border-[rgb(var(--skin-teal))]/60" />
          </div>

          {/* Telemetry Label */}
          <div className="mt-5 px-4 py-2 rounded-br-2xl bg-[rgb(var(--skin-navy))]/60 backdrop-blur-xl border border-white/10 shadow-2xl relative">
             <div className="absolute top-0 left-0 w-1 h-full bg-[rgb(var(--skin-teal))]" />
             <div className="flex flex-col">
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-[rgb(var(--skin-teal))]/60 leading-none mb-1.5">Telemetry active</p>
                <div className="label text-white whitespace-nowrap">
                   {marker.label}
                </div>
                <div className="flex items-center gap-2 mt-1.5 opacity-40">
                   <div className="w-1 h-1 rounded-full bg-[rgb(var(--skin-teal))] animate-pulse" />
                   <p className="text-[7px] font-medium text-white/50 uppercase tracking-tighter">Diagnostic seq. sync</p>
                </div>
             </div>
          </div>
        </motion.div>
      ))}

      {/* 4. Ambient Data Flurry - Very Subtle */}
      <div className="absolute inset-0 opacity-[0.05]">
         {[...Array(20)].map((_, i) => (
           <motion.div
             key={i}
             className="absolute w-[1px] h-[1px] bg-white rounded-full"
             style={{ 
               left: `${Math.random() * 100}%`, 
               top: `${Math.random() * 100}%` 
             }}
             animate={{
               opacity: [0, 1, 0],
               scale: [1, 1.5, 1],
             }}
             transition={{
               duration: 2 + Math.random() * 3,
               repeat: Infinity,
               delay: Math.random() * 5,
             }}
           />
         ))}
      </div>
    </div>
  );
}
