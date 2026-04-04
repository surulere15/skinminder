"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, Info, CheckCircle2, FlaskConical, Zap } from "lucide-react";

interface Product {
  name: string;
  type: string;
  why: string;
  match: string;
  benefit: string;
  synergy?: boolean;
}

interface PrescriptionProps {
  morning: Product[];
  night: Product[];
}

export function ClinicalPrescription({ morning, night }: PrescriptionProps) {
  return (
    <div className="space-y-12 text-left">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-[1.25rem] bg-[rgb(var(--skin-blue))]/10 flex items-center justify-center text-[rgb(var(--skin-blue))] border border-[rgb(var(--skin-blue))]/20 shadow-inner">
          <FlaskConical size={32} strokeWidth={2} />
        </div>
        <div className="space-y-1">
          <h3 className="h3 text-[rgb(var(--skin-navy))]">Clinical_Prescription</h3>
          <div className="flex items-center gap-4">
            <p className="label text-[rgb(var(--skin-navy))] opacity-40">AI Protocol #PX-9920-SM</p>
            <span className="w-1 h-1 rounded-full bg-[rgb(var(--skin-blue))]/40" />
            <p className="label text-[rgb(var(--skin-blue))]">Diagnostic_Verified</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Morning Protocol */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-amber-500/10 text-amber-500 label border border-amber-500/20 w-fit italic">
            <Sun size={14} strokeWidth={2.5} /> Morning Protocol
          </div>
          <div className="space-y-6">
            {morning.map((p, i) => (
              <Card key={i} className="bg-[rgb(var(--skin-surface))] border border-[rgb(var(--skin-gray))] rounded-3xl overflow-hidden hover:border-[rgb(var(--skin-blue))]/20 transition-all shadow-md">
                <div className="p-8 space-y-6">
                   <div className="flex items-start justify-between">
                      <div className="space-y-2">
                         <h4 className="text-xl font-bold text-[rgb(var(--skin-navy))]">{p.name}</h4>
                         <div className="flex items-center gap-3">
                           <div className="px-3 py-1 rounded-lg bg-[rgb(var(--skin-gray))] border border-[rgb(var(--skin-gray))] text-[9px] font-black uppercase text-[rgb(var(--skin-navy))]/60">
                             {p.type}
                           </div>
                           <span className="label text-[rgb(var(--skin-teal))] flex items-center gap-2 italic">
                              <CheckCircle2 size={12} strokeWidth={2.5} /> Clinical Match {p.match}
                           </span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-10 border-t border-[rgb(var(--skin-gray))] pt-8">
                      <div className="space-y-3">
                         <p className="label text-[rgb(var(--skin-navy))] opacity-30">Biochemical Rationale</p>
                         <p className="body text-sm leading-relaxed">{p.why}</p>
                      </div>
                      <div className="space-y-3">
                         <p className="label text-[rgb(var(--skin-navy))] opacity-30">Biological Target</p>
                         <div className="flex items-center gap-3">
                            <Zap size={14} strokeWidth={2.5} className="text-[rgb(var(--skin-blue))]" />
                            <p className="body text-sm font-bold text-[rgb(var(--skin-navy))]">{p.benefit}</p>
                         </div>
                      </div>
                   </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Night Protocol */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-500/10 text-indigo-500 label border border-indigo-500/20 w-fit italic">
            <Moon size={14} strokeWidth={2.5} /> Night Protocol
          </div>
          <div className="space-y-6">
            {night.map((p, i) => (
              <Card key={i} className="bg-[rgb(var(--skin-surface))] border border-[rgb(var(--skin-gray))] rounded-3xl overflow-hidden hover:border-[rgb(var(--skin-blue))]/20 transition-all shadow-md">
                <div className="p-8 space-y-6">
                   <div className="flex items-start justify-between">
                      <div className="space-y-2">
                         <h4 className="text-xl font-bold text-[rgb(var(--skin-navy))]">{p.name}</h4>
                         <div className="flex items-center gap-3">
                           <div className="px-3 py-1 rounded-lg bg-[rgb(var(--skin-gray))] border border-[rgb(var(--skin-gray))] text-[9px] font-black uppercase text-[rgb(var(--skin-navy))]/60">
                             {p.type}
                           </div>
                           <span className="label text-[rgb(var(--skin-teal))] flex items-center gap-2 italic">
                              <CheckCircle2 size={12} strokeWidth={2.5} /> Clinical Match {p.match}
                           </span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-10 border-t border-[rgb(var(--skin-gray))] pt-8">
                      <div className="space-y-3">
                         <p className="label text-[rgb(var(--skin-navy))] opacity-30">Biochemical Rationale</p>
                         <p className="body text-sm leading-relaxed">{p.why}</p>
                      </div>
                      <div className="space-y-3">
                         <p className="label text-[rgb(var(--skin-navy))] opacity-30">Biological Target</p>
                         <div className="flex items-center gap-3">
                            <Zap size={14} strokeWidth={2.5} className="text-[rgb(var(--skin-blue))]" />
                            <p className="body text-sm font-bold text-[rgb(var(--skin-navy))]">{p.benefit}</p>
                         </div>
                      </div>
                   </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-10 p-10 rounded-[2.5rem] bg-[rgb(var(--skin-blue))]/5 border border-[rgb(var(--skin-blue))]/10 relative overflow-hidden">
         <div className="flex gap-6 relative z-10">
            <Info size={24} strokeWidth={2} className="text-[rgb(var(--skin-blue))] flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
               <p className="label text-[rgb(var(--skin-navy))]">Clinical_Disclaimer</p>
               <p className="body text-[13px] leading-relaxed max-w-lg">
                  This protocol is optimized for your current hydration levels and environmental exposure. 
                  Remember to apply SPF daily as the final step of your morning routine.
               </p>
            </div>
         </div>
         
         {/* Medical Stamp Component */}
         <div className="flex-shrink-0 relative z-10">
            <div className="w-28 h-28 rounded-full border-2 border-[rgb(var(--skin-blue))]/20 flex flex-col items-center justify-center p-3 text-center rotate-12 bg-white/40 shadow-diagnostic">
               <div className="w-full h-full rounded-full border border-[rgb(var(--skin-blue))]/20 border-dashed flex flex-col items-center justify-center">
                  <p className="text-[9px] font-black text-[rgb(var(--skin-blue))] uppercase leading-tight">Authentic<br/>Diagnostic</p>
                  <CheckCircle2 size={18} strokeWidth={2.5} className="text-[rgb(var(--skin-blue))] my-2" />
                  <p className="text-[9px] font-black text-[rgb(var(--skin-blue))]/60 uppercase">SM-2026</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
