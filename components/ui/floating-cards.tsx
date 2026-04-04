"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, Brain, UserCheck, Sparkles } from "lucide-react";

export function FloatingCards() {
  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 0.3, scale: 1, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      className="absolute inset-0 pointer-events-none"
    >



      {/* Card 1 - TOP: Hydration Matrix */}
      <motion.div
        variants={item}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[130%] md:-translate-y-[180%] pointer-events-auto group min-w-[200px]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet/20 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500 rounded-[24px] blur-xl -z-10" />
        <div className="glass-panel px-5 py-3 flex items-center gap-3 shadow-xl select-none group-hover:border-violet/30 transition-colors duration-500">
          <div className="w-9 h-9 rounded-full bg-violet/10 flex items-center justify-center border border-violet/20 group-hover:scale-110 group-hover:bg-violet/20 transition-all duration-500 shadow-[0_0_15px_rgba(124,108,255,0.2)]">
              <Sparkles className="w-4 h-4 text-violet/80" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black tracking-widest text-violet/60 uppercase leading-tight">Hydration</span>
            <span className="text-sm font-outfit font-black text-content-primary/90">Optimizing</span>
          </div>
        </div>
      </motion.div>

      {/* Card 2 - LEFT: Sebum Balance */}
      <motion.div
        variants={item}
        animate={{ y: [0, 10, 0], x: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute left-0 top-1/2 -translate-x-[65%] md:-translate-x-[160%] -translate-y-1/2 pointer-events-auto group min-w-[160px]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-rose/20 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500 rounded-[24px] blur-xl -z-10" />
        <div className="glass-panel px-5 py-3 flex items-center gap-3 shadow-xl select-none group-hover:border-rose/30 transition-colors duration-500">
          <div className="w-9 h-9 rounded-full bg-rose/10 flex items-center justify-center border border-rose/20 group-hover:scale-110 group-hover:bg-rose/20 transition-all duration-500 shadow-[0_0_15px_rgba(255,122,162,0.2)]">
              <Camera className="w-4 h-4 text-rose/80" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black tracking-widest text-rose/60 uppercase leading-tight">Sebum</span>
            <span className="text-sm font-outfit font-bold text-content-primary/90">Balanced</span>
          </div>
        </div>
      </motion.div>

      {/* Card 3 - RIGHT: Texture Profile */}
      <motion.div
        variants={item}
        animate={{ y: [0, -10, 0], x: [0, 6, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute right-0 top-1/2 translate-x-[65%] md:translate-x-[160%] -translate-y-1/2 pointer-events-auto group min-w-[200px]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/20 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500 rounded-[24px] blur-xl -z-10" />
        <div className="glass-panel px-5 py-3 flex items-center gap-3 shadow-xl select-none group-hover:border-accent-gold/30 transition-colors duration-500">
          <div className="w-9 h-9 rounded-full bg-accent-gold/10 flex items-center justify-center border border-accent-gold/20 group-hover:scale-110 group-hover:bg-accent-gold/20 transition-all duration-500 shadow-[0_0_15px_rgba(255,216,155,0.2)]">
              <Brain className="w-4 h-4 text-accent-gold/80" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black tracking-widest text-accent-gold/60 uppercase leading-tight">Texture</span>
            <span className="text-sm font-outfit font-bold text-content-primary/90">Micro-refinement</span>
          </div>
        </div>
      </motion.div>

      {/* Card 4 - BOTTOM: Sensitivity Index */}
      <motion.div
        variants={item}
        animate={{ y: [0, 14, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[130%] md:translate-y-[200%] pointer-events-auto group min-w-[180px]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet/20 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500 rounded-[24px] blur-xl -z-10" />
        <div className="glass-panel px-5 py-3 flex items-center gap-3 shadow-xl select-none group-hover:border-violet/30 transition-colors duration-500">
          <div className="w-9 h-9 rounded-full bg-violet/10 flex items-center justify-center border border-violet/20 group-hover:scale-110 group-hover:bg-violet/20 transition-all duration-500 shadow-[0_0_15px_rgba(124,108,255,0.2)]">
              <UserCheck className="w-4 h-4 text-violet/80" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black tracking-widest text-violet/60 uppercase leading-tight">Sensitivity</span>
            <span className="text-sm font-outfit font-bold text-content-primary/90">Low Risk</span>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}
