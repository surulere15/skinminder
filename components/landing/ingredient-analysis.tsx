"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Beaker, Zap, CheckCircle2 } from "lucide-react";

const INGREDIENTS = [
  {
    name: "Retinol 0.2%",
    category: "Cellular Turnover",
    target: "Analysis Area #82",
    match: 94,
    desc: "Accelerates epidermal renewal to address identified micro-texture irregularities.",
    color: "text-skin-violet",
    bgColor: "bg-skin-violet/10",
  },
  {
    name: "Hyaluronic Acid",
    category: "Hydration Matrix",
    target: "Surface Area #12",
    match: 98,
    desc: "Molecular-weight optimized for identified trans-epidermal water loss zones.",
    color: "text-skin-scan",
    bgColor: "bg-skin-scan/10",
  },
  {
    name: "Niacinamide",
    category: "Barrier Support",
    target: "Pore Zone #41",
    match: 89,
    desc: "Stabilizes lipid production in T-zone sectors highlighted during analysis.",
    color: "text-white",
    bgColor: "bg-white/10",
  }
];

export function IngredientAnalysis() {
  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-3 gap-8">
        {INGREDIENTS.map((ing, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] hover:bg-white/[0.04] transition-all group h-full flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className={`w-14 h-14 rounded-2xl ${ing.bgColor} flex items-center justify-center border border-white/5`}>
                    <FlaskConical className={`${ing.color} w-6 h-6`} />
                  </div>
                  <Badge className="bg-skin-dark border-white/10 text-white/40 text-[9px] font-black tracking-widest uppercase">
                    Match: {ing.match}%
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${ing.color}`}>{ing.category}</p>
                  <h3 className="text-3xl font-black text-white tracking-tighter">{ing.name}</h3>
                  <p className="text-white/40 text-sm font-bold leading-relaxed">{ing.desc}</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Zap className="text-skin-scan w-3 h-3" />
                   <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{ing.target}</span>
                </div>
                <CheckCircle2 className="text-skin-scan w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Molecular Visualization Placeholder */}
      <Card className="bg-skin-violet/5 border-skin-violet/10 rounded-[3rem] p-12 overflow-hidden relative">
         <div className="absolute inset-0 bg-gradient-to-r from-skin-violet/10 via-transparent to-transparent" />
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-40 h-40 rounded-full border border-skin-violet/30 flex items-center justify-center bg-skin-dark/40 backdrop-blur-3xl shrink-0">
               <Beaker className="text-skin-violet w-16 h-16 animate-pulse" />
            </div>
            <div className="space-y-4">
               <h4 className="text-2xl font-black text-white tracking-tight">Dermal Intelligence Engine</h4>
               <p className="text-white/40 text-lg font-bold">
                 SkinMinder doesn't just recommend products; it simulates the molecular interaction between ingredients and your unique dermal requirements.
               </p>
            </div>
         </div>
      </Card>
    </div>
  );
}
