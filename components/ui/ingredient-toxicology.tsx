"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert, FlaskConical, Beaker, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface ToxicologyMarkerProps {
  label: string;
  value: number; // 0-100
  threshold: number;
}

const ToxicologyMarker = ({ label, value, threshold }: ToxicologyMarkerProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-black uppercase tracking-widest text-content-muted">{label}</span>
      <span className={`text-[10px] font-black uppercase tracking-widest ${value > threshold ? 'text-[#FF6B6B]' : 'text-[#3FB68B]'}`}>
        {value > threshold ? 'Above Baseline' : 'Controlled'}
      </span>
    </div>
    <div className="h-1.5 w-full bg-background rounded-full overflow-hidden border border-white/5">
       <motion.div 
         initial={{ width: 0 }}
         animate={{ width: `${value}%` }}
         className={`h-full ${value > threshold ? 'bg-[#FF6B6B]' : 'bg-[#3FB68B]'}`}
       />
    </div>
  </div>
);

export function IngredientToxicology() {
  return (
    <Card className="bg-skin-surface border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-8 space-y-8 text-left">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-[#3FB68B]/10 flex items-center justify-center text-[#3FB68B] border border-[#3FB68B]/20">
              <ShieldCheck size={24} />
           </div>
           <div>
              <h3 className="text-xl font-semibold text-content-primary tracking-tight">Predictive Toxicology</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#3FB68B]">Computational Biocompatibility Model</p>
           </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-white/2 border border-white/5 space-y-4">
                 <div className="flex items-center gap-2">
                    <FlaskConical size={14} className="text-primary" />
                    <span className="text-xs font-bold text-content-primary">Sensitization Forecasting</span>
                 </div>
                 <div className="space-y-4">
                    <ToxicologyMarker label="Dermal Sensitization" value={14} threshold={30} />
                    <ToxicologyMarker label="Cytotoxicity Index" value={8} threshold={20} />
                    <ToxicologyMarker label="Phototoxicity Risk" value={5} threshold={15} />
                 </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl bg-[#3FB68B]/5 border border-[#3FB68B]/10">
                 <CheckCircle2 size={18} className="text-[#3FB68B] flex-shrink-0" />
                 <p className="text-xs font-medium text-content-secondary leading-relaxed">
                    AI analysis confirms high <span className="text-[#3FB68B] font-bold">Molecular Biocompatibility</span> with user's lipid profile. No irritant triggers detected in the current formulation batch.
                 </p>
              </div>
           </div>

           <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-white/2 border border-white/5 space-y-4">
                 <div className="flex items-center gap-2">
                    <Beaker size={14} className="text-[#6C7BFF]" />
                    <span className="text-xs font-bold text-content-primary">Formulation Stability Model</span>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "pH Range", val: "5.4 - 5.8", status: "Optimal" },
                      { label: "Oxidation", val: "Nil", status: "Stable" },
                      { label: "Polymer Mix", val: "Synthesized", status: "Verified" },
                      { label: "Shelf Drift", val: "0.02%", status: "Minimum" }
                    ].map((m, i) => (
                      <div key={i} className="space-y-1">
                         <span className="text-[8px] font-black uppercase tracking-[0.15em] text-content-muted opacity-60">{m.label}</span>
                         <p className="text-xs font-bold text-content-primary">{m.val}</p>
                         <p className="text-[9px] font-black uppercase text-[#3FB68B] tracking-widest">{m.status}</p>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-3">
                 <Info size={16} className="text-primary flex-shrink-0 mt-0.5" />
                 <p className="text-[10px] font-medium text-content-secondary leading-normal italic">
                    Based on MDPI Computational Toxicology standards. Predictive modeling assumes protocol adherence and typical environmental exposure.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </Card>
  );
}
