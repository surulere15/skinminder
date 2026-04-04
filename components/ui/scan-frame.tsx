"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Maximize, Move, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScanFrameProps {
  status?: "stabilized" | "optimizing" | "error";
  distance?: "ideal" | "too-far" | "too-close";
  hint?: string;
  activeRegion?: "forehead" | "cheeks" | "chin" | null;
  children?: React.ReactNode;
  className?: string;
}

export function ScanFrame({ 
  status = "optimizing", 
  distance = "ideal",
  hint,
  activeRegion,
  children,
  className 
}: ScanFrameProps) {
  return (
    <div className={cn("relative w-full max-w-[280px] sm:max-w-xs aspect-[3/4] mx-auto group", className)}>
      {/* 0. Soft Circular Scan Pulse - CALM INTELLIGENCE */}
      <AnimatePresence>
        {status === "optimizing" && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.1, opacity: [0, 0.2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-[-15%] rounded-[5rem] border-2 border-skin-primary/30 pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      {/* 1. Biometric Oval Mask - Professional Atelier Style */}
      <div className="absolute inset-0 rounded-[4rem] sm:rounded-[5rem] overflow-hidden border border-skin-primary/20 bg-background transition-all duration-700 shadow-soft-premium z-10">
        {/* Placeholder for camera stream */}
        {children}
        
        {/* Soft Studio Motifs (Diffuse Glow) */}
        <div className="absolute inset-0 bg-diffuse-glow opacity-30 pointer-events-none" />
        
        {/* Iconic Visual Signature: Layered Biometric Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-[110%] h-[110%] border-[0.5px] border-skin-primary/10 rounded-full" />
           <div className="w-[95%] h-[95%] border-[1px] border-skin-primary/15 rounded-full" />
           <div className="w-[85%] h-[85%] border-[2px] border-skin-primary/5 rounded-full" />
        </div>

        {/* Phase 3: Region Segmentation Overlay (Dynamic Highlights) */}
        <div className="absolute inset-0 pointer-events-none">
           {/* Forehead Zone */}
           <motion.div 
             animate={{ opacity: activeRegion === "forehead" ? 0.8 : 0.2 }}
             className={cn(
               "absolute top-[10%] left-1/2 -translate-x-1/2 w-[60%] h-[15%] border-b border-t border-dashed border-[rgb(var(--skin-teal))] transition-colors",
               activeRegion === "forehead" && "bg-[rgb(var(--skin-teal))]/5"
             )} 
           />
           {/* Cheeks & Nose Zones */}
           <motion.div 
             animate={{ opacity: activeRegion === "cheeks" ? 0.8 : 0.2 }}
             className={cn(
               "absolute top-[25%] left-1/2 -translate-x-1/2 w-[70%] h-[40%] border-l border-r border-dashed border-[rgb(var(--skin-teal))] transition-colors",
               activeRegion === "cheeks" && "bg-[rgb(var(--skin-teal))]/5"
             )} 
           />
           {/* Chin Zone */}
           <motion.div 
             animate={{ opacity: activeRegion === "chin" ? 0.8 : 0.2 }}
             className={cn(
               "absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[40%] h-[15%] border border-dashed border-[rgb(var(--skin-teal))] rounded-full transition-colors",
               activeRegion === "chin" && "bg-[rgb(var(--skin-teal))]/5"
             )} 
           />
        </div>

        {/* Measurement Markers (Ruler Line Ticks) */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-0 bottom-0 left-4 w-px flex flex-col justify-between py-12">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-1.5 h-px bg-skin-primary/20" />
              ))}
           </div>
           <div className="absolute top-0 bottom-0 right-4 w-px flex flex-col justify-between py-12">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-1.5 h-px bg-skin-primary/20 ml-auto" />
              ))}
           </div>
        </div>

        {/* Precision Lavender Analysis Highlight - Gentle Flow */}
        {status === "optimizing" && (
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-diffuse-glow opacity-30 animate-pulse" />
          </div>
        )}

        {/* Axis Crosshairs - Precision Markers */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-14 h-px bg-[rgb(var(--skin-teal))]/40 -translate-x-20" />
           <div className="w-14 h-px bg-[rgb(var(--skin-teal))]/40 translate-x-20" />
           <div className="h-14 w-px bg-[rgb(var(--skin-teal))]/40 -translate-y-24" />
           <div className="h-14 w-px bg-[rgb(var(--skin-teal))]/40 translate-y-24" />
           
           {/* Circular Analysis Points */}
           <motion.div 
             animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
             transition={{ duration: 5, repeat: Infinity }}
             className="absolute w-44 h-44 border border-[rgb(var(--skin-teal))]/20 rounded-full" 
           />
           <div className="w-2.5 h-2.5 rounded-full border border-[rgb(var(--skin-teal))] bg-[rgb(var(--skin-teal))]/40 shadow-[0_0_10px_rgba(var(--skin-teal),0.8)]" />
        </div>

        {/* Real-time Guidance Hint (Professional Prompt) */}
        <AnimatePresence mode="wait">
          {hint && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="absolute bottom-32 left-0 right-0 z-30 flex justify-center pointer-events-none px-6"
            >
               <div className="px-5 py-2.5 rounded-xl bg-[rgb(var(--skin-navy))]/95 border border-[rgb(var(--skin-teal))]/40 backdrop-blur-md text-[rgb(var(--skin-teal))] text-[10px] font-bold uppercase tracking-[0.3em] shadow-xl">
                  {hint}
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Technical Guidance Data (Top Area) */}
        <div className="absolute top-12 left-10 space-y-1">
          <div className="text-[8px] font-black text-skin-primary uppercase tracking-[0.2em] opacity-40">Pos_Alignment</div>
          <div className="text-[8px] font-black text-skin-primary uppercase tracking-[0.2em] opacity-40">Sensor_Active</div>
        </div>
        <div className="absolute top-12 right-10 text-right">
          <div className="text-[8px] font-black text-skin-primary uppercase tracking-[0.3em] leading-none">Studio_Aperture</div>
          <div className="text-[8px] font-black text-skin-primary opacity-20 uppercase tracking-[0.2em] italic mt-1.5">v2.0</div>
        </div>
        
        {/* Technical Status Bar (Bottom Area) */}
        <div className="absolute bottom-20 left-10 right-10 flex justify-between items-center">
           <div className="text-[8px] font-black text-skin-primary/30 uppercase tracking-widest">High_Fidelity</div>
           <div className="text-[8px] font-black text-skin-primary/30 uppercase tracking-widest italic">Clinical_Atelier</div>
        </div>
      </div>

      {/* 2. Calibration Indicators - Floating Clinical Modules */}
      <div className="absolute top-6 left-6 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-skin-primary/5 shadow-md z-20">
        <div className={cn(
          "w-2 h-2 rounded-full transition-all duration-500",
          status === "stabilized" ? "bg-skin-success shadow-[0_0_8px_rgba(104,211,145,0.4)]" : "bg-skin-primary/30 animate-slow-breathe"
        )} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-skin-slate">
          {status === "stabilized" ? "Analysis Ready" : "Calibrating..."}
        </span>
      </div>

      {/* 3. Optimal Proximity - Distance Help */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-5 px-6 py-3 rounded-2xl bg-white border border-skin-primary/10 shadow-lg z-20 whitespace-nowrap">
        <div className="flex items-center gap-2.5">
           <div className={cn("w-1.5 h-3.5 rounded-full", distance === "ideal" ? "bg-skin-primary" : "bg-skin-primary/10")} />
           <div className={cn("w-1.5 h-6 rounded-full", distance === "ideal" ? "bg-skin-primary" : "bg-skin-primary/10")} />
           <div className={cn("w-1.5 h-3.5 rounded-full", distance === "ideal" ? "bg-skin-primary" : "bg-skin-primary/10")} />
        </div>
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-skin-slate">
          {distance === "ideal" ? "Optimal Range" : distance === "too-far" ? "Bring Closer" : "Move Back"}
        </span>
      </div>

      {/* 4. Analysis Velocity - Side Module */}
      <div className="absolute right-[-25px] sm:right-[-45px] top-1/2 -translate-y-1/2 flex flex-col gap-5 z-20">
        <div className="flex flex-col items-center gap-4">
          <Activity size={14} strokeWidth={2.5} className="text-skin-primary/40" />
          <div className="w-[1px] h-24 bg-skin-primary/10 rounded-full overflow-hidden relative border border-skin-primary/20">
            <motion.div 
              animate={{ height: status === "stabilized" ? "90%" : "20%" }}
              className="absolute bottom-0 w-full bg-skin-primary shadow-[0_0_8px_rgba(157,164,255,0.4)]" 
            />
          </div>
          <span className="text-[8px] font-black text-skin-primary/40 uppercase vertical-text tracking-widest leading-none">Flow</span>
        </div>
      </div>
    </div>
  );
}
