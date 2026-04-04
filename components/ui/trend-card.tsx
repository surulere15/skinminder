"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendCardProps {
  label: string;
  value: string;
  description: string;
  progress: number;
  className?: string;
}

export function TrendCard({ 
  label, 
  value, 
  description, 
  progress,
  className 
}: TrendCardProps) {
  return (
    <Card className={cn(
      "p-8 overflow-hidden relative group rounded-[2rem] bg-white border-skin-lavender shadow-soft",
      className
    )}>
      {/* Background Motif - Beauty Vector Sweep */}
      <div className="absolute top-0 right-0 p-8 sm:p-12 opacity-[0.05] group-hover:scale-105 transition-transform duration-1000 rotate-12 pointer-events-none">
        <TrendingUp size={240} className="sm:size-[300px] text-skin-primary" />
      </div>
      <div className="absolute inset-0 bg-soft-studio opacity-40 pointer-events-none" />
      
      <div className="space-y-10 relative z-10 text-left">
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-skin-primary italic">
          Longitudinal Skin Journey
        </div>
        
        <div className="space-y-4">
          <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none italic text-skin-slate/10">
            {label}
          </h3>
          <p className="text-3xl font-black italic tracking-tighter text-skin-primary leading-none uppercase">
            {value}
          </p>
        </div>
        
        <div className="flex gap-6">
           <div className="w-1.5 h-16 bg-skin-lavender mt-1 rounded-full" />
           <p className="text-xl md:text-2xl font-bold text-skin-slate/50 leading-relaxed italic max-w-sm tracking-tight">
              {description}
           </p>
        </div>
      </div>

      {/* Progress Calibration Bar */}
      <div className="flex flex-col gap-6 pt-20 relative z-10 w-full">
        <div className="flex items-center gap-10">
           <div className="flex-1 h-3 rounded-full bg-skin-lavender overflow-hidden p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                transition={{ duration: 3, ease: [0.19, 1, 0.22, 1] }}
                className="h-full bg-skin-primary rounded-full shadow-soft"
              />
           </div>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-skin-primary italic">
             [STABILIZED]
           </span>
        </div>
        <div className="flex justify-between items-center text-[9px] font-black text-skin-slate/10 uppercase tracking-[0.4em] italic">
           <span>BASE ORIGIN</span>
           <span>OPTIMAL STATE</span>
        </div>
      </div>
    </Card>
  );
}
