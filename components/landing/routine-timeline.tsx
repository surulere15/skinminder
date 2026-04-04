"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Clock, ArrowRight } from "lucide-react";

const ROUTINE = [
  {
    phase: "08:00 AM",
    title: "Morning Regimen",
    icon: Sun,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    steps: [
      { action: "Cleansing", detail: "pH-Balanced Dermal Solution" },
      { action: "Targeting", detail: "Serum Peptide 01 + Vitamin C" },
      { action: "Protection", detail: "Broad-Spectrum Active Filter" }
    ]
  },
  {
    phase: "09:00 PM",
    title: "Evening Regimen",
    icon: Moon,
    color: "text-skin-violet",
    bgColor: "bg-skin-violet/10",
    steps: [
      { action: "Detoxification", detail: "Molecular Oil Cleanser" },
      { action: "Interrogation", detail: "Retinol 0.2% Vector Match" },
      { action: "Resurrection", detail: "Ceramide Synthesis Complex" }
    ]
  }
];

export function RoutineTimeline() {
  return (
    <div className="grid md:grid-cols-2 gap-10 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-white/5 hidden md:block" />
      
      {ROUTINE.map((proto, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 space-y-10 relative overflow-hidden group hover:bg-white/[0.04] transition-all">
            <div className={`absolute top-0 right-0 p-10 opacity-5 scale-[2] ${proto.color}`}>
               <proto.icon size={120} />
            </div>
            
            <div className="flex items-center gap-6">
               <div className={`w-16 h-16 rounded-2xl ${proto.bgColor} flex items-center justify-center border border-white/5`}>
                  <proto.icon className={`${proto.color} w-8 h-8`} />
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-2">
                    <Clock size={10} /> {proto.phase}
                  </p>
                  <h3 className="text-4xl font-black text-white tracking-tighter">{proto.title}</h3>
               </div>
            </div>

            <div className="space-y-4">
              {proto.steps.map((step, si) => (
                <div key={si} className="flex items-center gap-6 p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                   <div className="w-2 h-2 rounded-full bg-skin-scan" />
                   <div className="flex-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-skin-scan">{step.action}</p>
                      <p className="text-lg font-bold text-white">{step.detail}</p>
                   </div>
                   <ArrowRight size={16} className="text-white/20 group-hover:text-skin-scan transition-colors" />
                </div>
              ))}
            </div>
            
            <p className="text-white/20 text-xs font-mono uppercase tracking-[0.2em] pt-4">Generated via Analysis Index #94.2</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
