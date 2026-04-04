"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface HeroCoreProps {
  variant?: "analysis" | "core";
  size?: number;
  activeState?: AnalysisState;
  showOrbit?: boolean;
  showLens?: boolean;
}

type AnalysisState = "mapping" | "analyzing" | "resolving";

export function HeroCore({ 
  variant = "core", 
  size = 72, 
  activeState,
  showOrbit = true,
  showLens = true
}: HeroCoreProps) {
  const isAnalysis = variant === "analysis";
  const [internalState, setInternalState] = useState<AnalysisState>("mapping");
  const state = activeState || internalState;

  useEffect(() => {
    if (isAnalysis || activeState) return; 

    const cycle = setInterval(() => {
      setInternalState((prev: AnalysisState) => {
        if (prev === "mapping") return "analyzing";
        if (prev === "analyzing") return "resolving";
        return "mapping";
      });
    }, 4000);

    return () => clearInterval(cycle);
  }, [isAnalysis, activeState]);
  
  return (
    <div 
      className="relative pointer-events-none flex items-center justify-center"
      style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
    >
      
      {/* 1. LAYER: Outer Glow Ring (Subdued Medical Blue) */}
      {showOrbit && (
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: isAnalysis ? [0.03, 0.1, 0.03] : [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute w-[170%] h-[170%] rounded-full blur-[90px] -z-20 bg-primary/10`}
        />
      )}


       {/* NEW: 1.5 LAYER - Faint Outer Halo Glow (Atmospheric anchor) */}
       {showOrbit && (
         <div className={`absolute w-[140%] h-[140%] rounded-full border border-primary/5 shadow-[0_0_60px_rgba(47,107,255,0.05)] -z-15 pointer-events-none transition-opacity duration-1000 ${isAnalysis ? 'opacity-0' : 'opacity-100'}`} />
       )}

       {/* Radiating Energy Waves (Active Processing Pulses) */}
       {showOrbit && !isAnalysis && [0, 1, 2].map((i) => (
         <motion.div
           key={i}
           animate={{ scale: [1, 2], opacity: [0.15, 0] }}
           transition={{ duration: 8, repeat: Infinity, delay: i * 2.6, ease: "easeOut" }}
           className="absolute w-full h-full border border-primary/10 rounded-full pointer-events-none -z-10"
         />
       ))}

       {/* 2. LAYER: Orbiting Particles (Monochromatic) */}
       {showOrbit && (
         <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: isAnalysis ? 60 : 40, repeat: Infinity, ease: "linear" }}
           className="absolute w-[130%] h-[130%] rounded-full -z-10"
         >
            <div className={`absolute top-[12%] left-[22%] rounded-full bg-primary/40 shadow-[0_0_10px_rgba(47,107,255,0.4)] ${isAnalysis ? 'w-1 h-1' : 'w-1.5 h-1.5'}`} />
            <div className={`absolute bottom-[22%] right-[12%] rounded-full bg-accent/40 shadow-[0_0_10px_rgba(122,214,179,0.4)] ${isAnalysis ? 'w-1.5 h-1.5' : 'w-2 h-2'}`} />
         </motion.div>
       )}

       {/* 3. LAYER: Glass Sphere Shell & Core */}
       {showLens && (
         <div className="relative w-full h-full flex items-center justify-center">
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 2, type: "spring", bounce: 0.2 }}
             className="relative w-full h-full rounded-full flex flex-col items-center justify-center overflow-hidden"
             style={{
               background: "radial-gradient(circle at 35% 35%, rgba(47,107,255,0.05) 0%, rgba(15,23,42,0.6) 50%, rgba(0,0,0,0.95) 100%)",
               backdropFilter: "blur(40px)",
               WebkitBackdropFilter: "blur(40px)",
               boxShadow: "0 40px 100px rgba(0,0,0,0.8), inset 0 0 60px rgba(0,0,0,1), inset 0 2px 10px rgba(255,255,255,0.1), inset 0 -4px 20px rgba(47,107,255,0.1)",
               border: "1px solid rgba(255,255,255,0.05)"
             }}
           >
             {/* Soft Breathing Inner Glow */}
             <motion.div 
               animate={{ opacity: [0.1, 0.2, 0.1] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="absolute inset-0 bg-primary/5 blur-3xl pointer-events-none"
             />
             
             <div className="absolute inset-0 rounded-full border border-primary/20 shadow-[0_0_15px_rgba(47,107,255,0.2),inset_0_0_15px_rgba(47,107,255,0.2)] pointer-events-none" />
             <div className="absolute top-[-15%] left-[-15%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-white/10 to-transparent blur-2xl rotate-[-30deg] pointer-events-none" />
             
             {/* Cinematic Specular Glint */}
             <motion.div 
               animate={{ x: ["-100%", "200%"], opacity: [0, 0.4, 0] }}
               transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-[50%] h-full -rotate-45 blur-xl pointer-events-none"
             />

              {/* 4. LAYER: Dermal Lifecycle Transitions (Simplified Gateway Scanner) */}
              <div className="absolute inset-0 z-10 overflow-hidden rounded-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {state === "mapping" && (
                    <motion.div
                      key="mapping"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {/* Stylized Face Silhouette */}
                      <svg width="60%" height="60%" viewBox="0 0 100 120" className="opacity-40 fill-none stroke-skin-scan/40 stroke-[0.5]">
                        <motion.path 
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 3, ease: "easeInOut" }}
                          d="M50 10 C25 10 15 40 15 65 C15 90 30 110 50 110 C70 110 85 90 85 65 C85 40 75 10 50 10 Z" 
                        />
                        <motion.path 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 0.5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          d="M30 50 Q50 45 70 50" 
                        />
                      </svg>
                      <div className="absolute inset-0 bg-gradient-to-t from-skin-violet/20 to-transparent" />
                    </motion.div>
                  )}

                  {state === "analyzing" && (
                    <motion.div
                      key="analyzing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {/* Silhouette and Scanning Points */}
                      <svg width="60%" height="60%" viewBox="0 0 100 120" className="fill-none stroke-primary/60 stroke-[0.5]">
                        <path d="M50 10 C25 10 15 40 15 65 C15 90 30 110 50 110 C70 110 85 90 85 65 C85 40 75 10 50 10 Z" />
                        
                        {/* Dermal Analysis Points */}
                        {[
                          [35, 45], [65, 45], [50, 60], [35, 80], [65, 80], [50, 95]
                        ].map(([cx, cy], i) => (
                          <motion.circle
                            key={i}
                            cx={cx}
                            cy={cy}
                            r="1.5"
                            fill="var(--primary)"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.6] }}
                            transition={{ delay: i * 0.2, duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                          />
                        ))}
                      </svg>

                      {/* Active High-Intensity Scan Line */}
                      <motion.div 
                        animate={{ y: ["-10%", "110%"] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-0 left-[-20%] w-[140%] h-[4px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_35px_var(--primary)] z-20"
                      />
                      <div className="absolute inset-0 bg-primary/10 blur-xl px-20" />
                    </motion.div>
                  )}

                  {state === "resolving" && (
                    <motion.div
                      key="resolving"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center bg-primary/5 backdrop-blur-md"
                    >
                      {/* Pure Visual Anchor - Glowing Core Pulse */}
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5],
                          boxShadow: [
                            "0 0 40px 10px rgba(47, 107, 255, 0.2)",
                            "0 0 70px 25px rgba(47, 107, 255, 0.4)",
                            "0 0 40px 10px rgba(47, 107, 255, 0.2)"
                          ]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-12 h-12 rounded-full bg-white/10 blur-sm"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Simplified Overlay Center */}
                <div className="absolute inset-0 flex items-center justify-center z-10 mix-blend-screen overflow-hidden">
                   {showOrbit && (
                     <motion.svg
                       viewBox="0 0 240 240"
                       className="absolute w-[90%] h-[90%] opacity-20"
                       animate={{ rotate: 360 }}
                       transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                     >
                       <circle cx="120" cy="120" r="110" fill="none" stroke="var(--primary)" strokeWidth="0.5" strokeDasharray="1 10" />
                     </motion.svg>
                   )}
                   
                   <motion.div 
                     animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
                     transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                     className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_40px_10px_white,0_0_60px_20px_rgba(47,107,255,0.4)]"
                   />
                </div>
              </div>
            </motion.div>


           {/* 6. LAYER: Depth Separation Shadow */}
           <div className="absolute bottom-[-10%] w-[120%] h-20 bg-black/40 blur-3xl -z-30 rounded-[100%] scale-x-[0.8] opacity-50" />
         </div>
       )}
    </div>
  );
}
