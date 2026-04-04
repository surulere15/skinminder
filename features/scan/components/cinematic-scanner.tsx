"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ShieldCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScanFrame } from "@/components/ui/scan-frame";

interface CinematicScannerProps {
  preview: string;
}

export function CinematicScanner({ preview }: CinematicScannerProps) {
  const [elapsed, setElapsed] = useState(0);
  const totalDuration = 10000; // 10 seconds

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const current = Date.now() - start;
      setElapsed(Math.min(current, totalDuration));
      if (current >= totalDuration) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const progress = (elapsed / totalDuration) * 100;
  
  // Phase mapping for the 10-second sequence
  const isPhase1 = elapsed < 2000;  // 0-2s: Alignment
  const isPhase2 = elapsed >= 2000 && elapsed < 4000; // 2-4s: Calibration
  const isPhase3 = elapsed >= 4000 && elapsed < 8000; // 4-8s: Analysis
  const isPhase4 = elapsed >= 8000; // 8-10s: Reveal

  // Active Region Logic for Phase 3
  const activeRegion = 
    elapsed >= 4000 && elapsed < 5300 ? "forehead" :
    elapsed >= 5300 && elapsed < 6600 ? "cheeks" :
    elapsed >= 6600 && elapsed < 8000 ? "chin" : null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center p-6 overflow-hidden"
    >
      {/* 1. ANALYTICAL INFRASTRUCTURE LAYER (Background Grid & Markers) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-soft-studio opacity-40" />
        <div className="absolute inset-0 bg-diffuse-glow opacity-30" />
        
        {/* Floating Analytical Marker Particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.05, 0.2, 0.05],
              y: [0, -30, 0]
            }}
            transition={{ 
              duration: Math.random() * 6 + 4, 
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute text-[7px] font-bold text-skin-primary/30 uppercase tracking-widest"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%` 
            }}
          >
            SIG_{Math.random().toString(16).substring(2, 8).toUpperCase()}
          </motion.div>
        ))}
      </div>

      <div className="relative w-full max-w-lg space-y-12 z-20">
        
        {/* 2. THE DIAGNOSTIC INSTRUMENT */}
        <div className="relative aspect-square flex items-center justify-center">
          
          <ScanFrame 
            status={elapsed > 1000 ? "stabilized" : "optimizing"}
            activeRegion={activeRegion as any}
            className="shadow-diagnostic scale-110"
          >
            {/* Captured Preview with Analytical FX */}
            <div className="relative w-full h-full">
              <img 
                src={preview} 
                alt="Scan preview" 
                className="w-full h-full object-cover opacity-60 rounded-full"
              />
              
              {/* Clinical Depth Overlay */}
              <div className="absolute inset-0 bg-skin-primary/5 mix-blend-soft-light" />

              {/* Phase 2 & 3: Professional Analysis HUD */}
              <AnimatePresence>
                {(isPhase2 || isPhase3) && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                  >
                     {/* Horizontal Analysis Sweep (Teal Laser) */}
                     <motion.div 
                       animate={{ top: ["0%", "100%", "0%"] }}
                       transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                       className="absolute left-0 right-0 h-0.5 bg-[#7AD6B3] shadow-[0_0_15px_#7AD6B3] z-30"
                     />
                     
                     {/* Phase 3: Region Segmentation & Sampling Overlay Text */}
                     {isPhase3 && (
                       <div className="absolute inset-0 flex items-center justify-center">
                          {/* Forehead Section Labeller */}
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: activeRegion === "forehead" ? 0.8 : 0.2 }}
                            className="absolute top-[12%] w-[50%] h-[18%] flex items-center justify-center"
                          >
                             <div className="text-[6px] font-black text-skin-primary uppercase tracking-[0.3em]">SEC_01_FRONTAL</div>
                          </motion.div>

                          {/* Cheeks Section Labeller */}
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: activeRegion === "cheeks" ? 0.8 : 0.2 }}
                            className="absolute top-[40%] left-[8%] w-[35%] h-[22%] flex items-center justify-center"
                          >
                             <div className="text-[6px] font-black text-skin-primary uppercase tracking-[0.3em] leading-none text-center">SEC_02<br/>LAT_L</div>
                          </motion.div>
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: activeRegion === "cheeks" ? 0.8 : 0.2 }}
                            className="absolute top-[40%] right-[8%] w-[35%] h-[22%] flex items-center justify-center"
                          >
                             <div className="text-[6px] font-black text-skin-primary uppercase tracking-[0.3em] leading-none text-center">SEC_03<br/>LAT_R</div>
                          </motion.div>

                          {/* Nose/Chin Section Labeller */}
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: activeRegion === "chin" ? 0.8 : 0.2 }}
                            className="absolute bottom-[8%] w-[30%] h-[15%] flex items-center justify-center"
                          >
                             <div className="text-[6px] font-black text-skin-primary uppercase tracking-[0.3em]">SEC_04_MENT</div>
                          </motion.div>

                          {/* Precision Micro-Sampling Grid */}
                          <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-px opacity-15">
                             {Array.from({ length: 144 }).map((_, i) => (
                               <motion.div 
                                 key={i}
                                 animate={{ 
                                   opacity: [0.1, 0.4, 0.1]
                                 }}
                                 transition={{ 
                                   duration: 3, 
                                   repeat: Infinity,
                                   delay: Math.random() * 3
                                 }}
                                 className="w-px h-px bg-skin-primary/40 rounded-full"
                               />
                             ))}
                          </div>
                       </div>
                     )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Phase 4: Data Consolidation (Archetype Reveal Transition) */}
              <AnimatePresence>
                 {isPhase4 && (
                   <motion.div 
                     initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                     animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
                     className="absolute inset-0 bg-white/40 flex items-center justify-center z-[50]"
                   >
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [1, 1.5, 1.2], opacity: [0.3, 0, 0.1] }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="absolute w-full h-full border-2 border-skin-primary rounded-full pointer-events-none"
                      />
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 border border-skin-primary/10 border-t-skin-primary rounded-full"
                      />
                      <div className="absolute text-skin-primary text-[10px] font-black uppercase tracking-[0.4em]">Finalizing Intelligence</div>
                   </motion.div>
                 )}
              </AnimatePresence>
            </div>
          </ScanFrame>

          {/* Clinical Status Rings (Outer Layer) */}
          <div className="absolute inset-0 pointer-events-none">
             <motion.div 
               animate={{ rotate: -360 }}
               transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
               className="absolute inset-[-30px] border border-white/5 rounded-full"
             />
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
               className="absolute inset-[-50px] border border-skin-primary/10 rounded-full border-dashed"
             />
          </div>
        </div>

        {/* 3. NARRATIVE FEED (The Analytical Status) */}
        <div className="space-y-10 text-center relative z-30">
          
          {/* Diagnostic Phases */}
          <div className="flex items-center justify-center gap-8">
            {[
              { id: 1, label: "INIT", active: isPhase1 },
              { id: 2, label: "CALIB", active: isPhase2 },
              { id: 3, label: "ANALYS", active: isPhase3 },
              { id: 4, label: "SYNC", active: isPhase4 },
            ].map((p) => (
              <div key={p.id} className="flex flex-col items-center gap-2">
                 <div className={cn(
                   "w-1.5 h-1.5 rounded-full transition-all duration-700",
                   p.active ? "bg-[#14B8A6] scale-125 shadow-[0_0_8px_#14B8A6]" : "bg-white/5"
                 )} />
                 <span className={cn(
                   "text-[9px] font-bold uppercase tracking-[0.2em]",
                   p.active ? "text-[#14B8A6]" : "text-white/10"
                 )}>{p.label}</span>
              </div>
            ))}
          </div>

          {/* Clinical Status Messages */}
          <div className="h-20 flex flex-col items-center justify-center gap-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={isPhase1 ? '1' : isPhase2 ? '2' : isPhase3 ? '3' : '4'}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-1"
              >
                <h3 className="text-2xl font-black tracking-tight text-white uppercase italic">
                  {isPhase1 && "Diagnostic_Aperture: READY"}
                  {isPhase2 && "Synchronizing_Sensor_Array"}
                  {isPhase3 && "Performing_Dermal_Mapping"}
                  {isPhase4 && "Vaulting_Analysis_Metrics"}
                </h3>
                <p className="text-[11px] font-bold text-[#14B8A6] uppercase tracking-[0.5em] opacity-50">
                  {isPhase1 && "Initializing capture sequence..."}
                  {isPhase2 && "Refining biometric coordinates..."}
                  {isPhase3 && "Extracting multi-layer biomarkers..."}
                  {isPhase4 && "Finalizing clinical report..."}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Analytical Progress Indicator */}
          <div className="w-full max-w-[280px] mx-auto space-y-4">
             <div className="flex justify-between items-center text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">
                <span>Data_Integrity: HIGH</span>
                <span className="text-[#14B8A6] font-mono">{Math.floor(progress)}%</span>
             </div>
             <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-[#14B8A6] shadow-[0_0_10px_rgba(20,184,166,0.3)]"
                />
             </div>
          </div>
        </div>
      </div>

      {/* 4. CLINICAL PROOF OVERLAY (Scientific Signal) */}
      <AnimatePresence>
        {elapsed > 3500 && elapsed < 8500 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-6"
          >
            <div className="p-10 rounded-[3rem] bg-white border border-skin-primary/20 shadow-diagnostic flex items-start gap-8">
              <div className="p-5 rounded-2xl bg-skin-mint text-skin-success mt-1">
                <ShieldCheck size={36} />
              </div>
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skin-mint text-skin-success text-[10px] font-black tracking-[0.3em] uppercase border border-skin-success/10">
                  Precision Assessment
                </div>
                <p className="text-xl font-black text-skin-slate leading-tight italic uppercase tracking-tight">
                  Comparing <span className="text-skin-primary">1,247 skin twins</span> for clinical accuracy.
                </p>
                <div className="flex items-center gap-6 text-skin-slate/40">
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-skin-primary/40" />
                      <span className="text-[9px] font-black uppercase tracking-widest leading-none">Global Norms</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-skin-primary/40" />
                      <span className="text-[9px] font-black uppercase tracking-widest leading-none">Confidence_Fidelity</span>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

