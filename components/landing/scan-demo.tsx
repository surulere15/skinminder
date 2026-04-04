"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Zap, CheckCircle2, BarChart3, Fingerprint } from "lucide-react";
import { HeroCore } from "@/components/ui/hero-core";

type SimpleStep = "upload" | "scanning" | "report";

export function ScanDemo() {
  const [step, setStep] = useState<SimpleStep>("upload");

  const startScan = () => {
    setStep("scanning");
    setTimeout(() => setStep("report"), 4000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-20">
      <div className="flex justify-center mb-16 gap-4">
        {[
          { id: "upload", icon: Upload, label: "Capture" },
          { id: "scanning", icon: Fingerprint, label: "Analysis" },
          { id: "report", icon: BarChart3, label: "Regimen" }
        ].map((s) => (
          <div 
            key={s.id} 
            className={`flex items-center gap-3 px-6 py-2 rounded-full border transition-all ${
              step === s.id 
                ? "bg-skin-violet/10 border-skin-violet text-skin-violet" 
                : "border-white/5 opacity-30"
            }`}
          >
            <s.icon size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center gap-10"
          >
            <div className="w-full aspect-video md:aspect-[21/9] rounded-[3rem] border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-8 group hover:border-skin-scan/30 transition-all cursor-pointer overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-br from-skin-violet/5 via-transparent to-skin-scan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                  <Camera className="w-10 h-10 text-white/40 group-hover:text-skin-scan transition-colors" />
               </div>
               <div className="text-center space-y-2 relative z-10">
                  <p className="text-2xl font-bold text-white">Initialize Optical Capture</p>
                  <p className="text-white/30 text-sm tracking-tight">Drop portrait or select multi-spectral file</p>
               </div>
            </div>
            <Button 
              onClick={startScan}
              className="h-20 px-16 rounded-[2rem] bg-white text-skin-dark font-black text-xl hover:scale-105 transition-all shadow-2xl"
            >
              Start AI Analysis
            </Button>
          </motion.div>
        )}

        {step === "scanning" && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-16 py-10"
          >
            <div className="relative">
               <div className="absolute inset-0 bg-skin-scan/20 blur-[100px] animate-pulse rounded-full" />
               <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                 className="w-80 h-80 rounded-full border border-skin-scan/30 border-t-skin-scan border-l-skin-scan"
               />
               <div className="absolute inset-0 flex items-center justify-center scale-75">
                  <HeroCore variant="core" />
               </div>
            </div>
            <div className="text-center space-y-4">
               <p className="text-3xl font-black text-white tracking-tight animate-pulse">Refining Dermal Profile...</p>
               <p className="text-skin-scan text-[11px] font-black uppercase tracking-[0.5em]">Cross-referencing 800,000+ data points</p>
            </div>
          </motion.div>
        )}

        {step === "report" && (
          <motion.div
            key="report"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid lg:grid-cols-12 gap-8"
          >
            <Card className="lg:col-span-8 bg-white/[0.03] border-white/10 p-16 rounded-[3rem] backdrop-blur-3xl overflow-hidden relative">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <CheckCircle2 size={80} className="text-skin-scan" />
               </div>
               <div className="space-y-12 relative z-10">
                  <div className="space-y-2">
                     <p className="text-skin-scan text-[10px] font-black uppercase tracking-[0.4em]">Analysis Complete</p>
                     <h3 className="text-5xl font-black text-white tracking-tighter">Clinical Report V4.2</h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                     {[
                       { label: "Hydration", val: "88%", color: "skin-scan" },
                       { label: "Elasticity", val: "94%", color: "skin-violet" },
                       { label: "Sebum", val: "Normal", color: "white" }
                     ].map((stat) => (
                       <div key={stat.label} className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{stat.label}</p>
                          <p className={`text-4xl font-black text-white`}>{stat.val}</p>
                          <div className="w-full h-1 bg-white/5 rounded-full mt-4">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: "80%" }}
                               className={`h-full bg-skin-scan rounded-full`}
                             />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </Card>
            <div className="lg:col-span-4 flex flex-col gap-8">
               <Card className="flex-1 bg-skin-violet p-12 rounded-[3rem] text-white flex flex-col justify-center gap-4 shadow-[0_20px_60px_rgba(106,92,255,0.4)]">
                  <Zap size={32} />
                  <p className="text-3xl font-black leading-tight">Insight: Increase peptides for seasonal support.</p>
               </Card>
               <Button 
                onClick={() => setStep("upload")}
                className="h-20 rounded-[2rem] bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10"
               >
                 Restart Analysis
               </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
