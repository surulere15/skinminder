"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Move } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfidenceBadgeProps {
  quality?: "high" | "standard" | "low";
  lighting?: number;
  alignment?: number;
  className?: string;
}

export function ConfidenceBadge({ 
  quality = "high", 
  lighting = 98, 
  alignment = 96,
  className 
}: ConfidenceBadgeProps) {
  const isHighQuality = quality === "high";

  return (
    <motion.div 
      initial={isHighQuality ? { boxShadow: "0 0 0px rgba(var(--skin-teal), 0)" } : {}}
      animate={isHighQuality ? { 
        boxShadow: [
          "0 0 0px rgba(var(--skin-teal), 0)",
          "0 0 20px rgba(var(--skin-teal), 0.1)",
          "0 0 0px rgba(var(--skin-teal), 0)"
        ]
      } : {}}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className={cn(
        "inline-flex items-center gap-8 px-6 py-4 rounded-2xl bg-[rgb(var(--skin-surface))] border border-[rgb(var(--skin-gray))] shadow-md relative overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-dermal-grid opacity-[0.03] pointer-events-none" />
      
      {/* 1. Fidelity Score */}
      <div className="flex items-center gap-4 pr-8 border-r border-[rgb(var(--skin-gray))] relative z-10">
        <div className="w-10 h-10 rounded-xl bg-[rgba(var(--skin-teal),0.1)] flex items-center justify-center text-[rgb(var(--skin-teal))] border border-[rgba(var(--skin-teal),0.2)]">
          <ShieldCheck size={22} strokeWidth={2} />
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-[rgb(var(--skin-text-secondary))] opacity-40 uppercase tracking-[0.4em]">FIDELITY_INDEX</span>
          <span className="text-[10px] font-black text-[rgb(var(--skin-teal))] uppercase tracking-[0.3em] leading-none italic">{quality}_CONF</span>
        </div>
      </div>

      {/* 2. Luminance Level */}
      <div className="flex flex-col relative z-10">
        <span className="text-[9px] font-black text-[rgb(var(--skin-text-secondary))] opacity-40 uppercase tracking-[0.4em]">LUMINANCE_LVL</span>
        <div className="flex items-center gap-2">
           <Zap size={12} strokeWidth={2} className="text-[rgb(var(--skin-blue))]" />
           <span className="text-[11px] font-mono font-black text-[rgb(var(--skin-navy))] leading-none italic">{lighting}.0</span>
        </div>
      </div>

      {/* 3. Vector Alignment */}
      <div className="flex flex-col relative z-10 text-right">
        <span className="text-[9px] font-black text-[rgb(var(--skin-text-secondary))] opacity-40 uppercase tracking-[0.4em]">VECTOR_ALIGN</span>
        <div className="flex items-center gap-2 justify-end">
           <Move size={12} strokeWidth={2} className="text-[rgb(var(--skin-text-secondary))]/40" />
           <span className="text-[11px] font-mono font-black text-[rgb(var(--skin-navy))] leading-none italic">{alignment}.0</span>
        </div>
      </div>
    </motion.div>
  );
}
