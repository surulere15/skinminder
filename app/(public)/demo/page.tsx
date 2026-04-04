"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo3D } from "@/components/ui/logo-3d";
import { Sparkles, Activity, Droplets, Layers, ShieldCheck, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Ambient particles generator
const generateParticles = (count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));
};

export default function HeroDemoPage() {
  const [particles] = useState(() => generateParticles(40));
  const [activeMetric, setActiveMetric] = useState(0);

  // Rotate through highlighted metrics for the floating panels
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { label: "Hydration Map", value: "82%", icon: <Droplets size={16} />, color: "text-skin-violet", glow: "shadow-skin-violet/40" },
    { label: "Texture Analysis", value: "Smooth", icon: <Layers size={16} />, color: "text-skin-gold", glow: "shadow-skin-gold/40" },
    { label: "Vitality Score", value: "94", icon: <Activity size={16} />, color: "text-skin-glow", glow: "shadow-skin-glow/40" },
  ];

  return (
    <div className="relative min-h-screen bg-skin-graphite text-skin-pearl overflow-hidden flex flex-col items-center justify-center font-outfit">
      
      {/* 1. Glowing Ambient Background Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Deep ambient glows */}
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-skin-violet/10 rounded-full blur-[120px] mix-blend-screen opacity-50" />
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-skin-rose/10 rounded-full blur-[150px] mix-blend-screen opacity-40" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-skin-gold/5 rounded-full blur-[100px] mix-blend-screen" />

        {/* Floating Particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: ["0%", "-100%"],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              y: { duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay },
              opacity: { duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.delay },
              scale: { duration: p.duration / 2, repeat: Infinity, ease: "easeInOut", delay: p.delay },
            }}
          />
        ))}
      </div>

      {/* Top Nav / Logo */}
      <div className="absolute top-0 w-full z-50 p-8 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
           <Logo3D className="w-32 h-10 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] brightness-150" />
        </Link>
        <div className="flex items-center gap-4">
           <Link href="/try">
              <Button className="bg-white/10 hover:bg-white/20 text-skin-pearl border border-white/20 rounded-full px-6 backdrop-blur-md font-black uppercase text-[10px] tracking-widest h-11">
                 Start Live Scan <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
           </Link>
        </div>
      </div>

      {/* Main Showcase Container */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 flex flex-col items-center">
        
        {/* Title Area */}
        <div className="text-center space-y-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-skin-violet backdrop-blur-sm shadow-xl"
          >
            <Sparkles size={14} className="text-skin-gold" /> SkinMinder AI Intelligence v2.0
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-skin-rose-400 to-skin-violet drop-shadow-2xl leading-[1.1]"
          >
            See What Your Skin<br />Is Trying To Tell You.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.3 }}
            className="text-lg font-bold text-skin-pearl max-w-xl mx-auto tracking-wide"
          >
            Our core AI sequences dermal markers to reveal your unique path to luminous health.
          </motion.p>
        </div>

        {/* 3D Visualization Grid */}
        <div className="relative w-full aspect-[4/3] md:aspect-[21/9] max-h-[600px] flex items-center justify-center perspective-[2000px]">
           
           {/* Center Portrait / Scan Loop */}
           <motion.div 
             className="relative z-30 w-72 md:w-96 aspect-[3/4] rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/20 bg-black"
             initial={{ rotateY: -15, rotateX: 5, scale: 0.9, opacity: 0 }}
             animate={{ rotateY: 0, rotateX: 0, scale: 1, opacity: 1 }}
             transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.2 }}
             style={{ transformStyle: "preserve-3d" }}
           >
              {/* Using a high-quality placeholder for the demo face */}
              <img 
                src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop" 
                alt="Demo Subject" 
                className="w-full h-full object-cover opacity-60 mix-blend-luminosity grayscale group-hover:grayscale-0 transition-all duration-1000"
              />
              
              {/* Overlay scanning effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-skin-violet/20 via-transparent to-skin-violet/20 mix-blend-overlay" />
              
              {/* Tech grid overlay */}
              <div 
                className="absolute inset-0 opacity-10 mix-blend-screen"
                style={{
                   backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                   backgroundSize: '30px 30px'
                }}
              />

              {/* Scanning Laser Line */}
              <motion.div 
                className="absolute left-0 right-0 h-1 bg-skin-violet shadow-[0_0_30px_10px_rgba(124,108,255,0.6)] z-20"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 4, ease: "linear", repeat: Infinity }}
              >
                 <div className="absolute inset-0 bg-white/50 blur-[2px]" />
                 {/* Laser trailing glow */}
                 <div className="absolute bottom-full left-0 right-0 h-40 bg-gradient-to-t from-skin-violet/40 to-transparent" />
              </motion.div>

              {/* Facial Tracking Points (Mock) */}
              <AnimatePresence>
                 {activeMetric === 0 && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-[35%] left-[35%] w-3 h-3 rounded-full bg-skin-violet shadow-[0_0_20px_rgba(124,108,255,1)] ring-4 ring-skin-violet/30 animate-ping" />
                      <div className="absolute top-[42%] right-[30%] w-3 h-3 rounded-full bg-skin-violet shadow-[0_0_20px_rgba(124,108,255,1)] ring-4 ring-skin-violet/30 animate-ping" style={{ animationDelay: '0.5s' }} />
                   </motion.div>
                 )}
                 {activeMetric === 1 && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-[55%] left-[25%] w-24 h-24 border-2 border-skin-gold/40 rounded-full animate-pulse blur-[1px]" />
                      <div className="absolute top-[55%] right-[25%] w-24 h-24 border-2 border-skin-gold/40 rounded-full animate-pulse blur-[1px]" style={{ animationDelay: '0.2s' }} />
                   </motion.div>
                 )}
              </AnimatePresence>
           </motion.div>

           {/* Orbiting Glass Panels */}
           {metrics.map((metric, idx) => {
             // Calculate 3D positions for a cinematic sweep
             const angles = [-1, 1, 0]; // left, right, top
             const xOffsets = [-220, 220, 0];
             const yOffsets = [40, -40, -220];
             const zOffsets = [150, 80, -50];

             const isActive = activeMetric === idx;

             return (
               <motion.div
                 key={metric.label}
                 className="absolute z-40 hidden md:flex"
                 initial={{ opacity: 0, x: 0, y: 0, z: -200 }}
                 animate={{ 
                   opacity: isActive ? 1 : 0.3, 
                   x: xOffsets[idx] + (isActive ? angles[idx] * 30 : 0),
                   y: yOffsets[idx] + (Math.sin(Date.now() / 1500 + idx) * 15), // slower hover
                   z: zOffsets[idx] + (isActive ? 100 : 0),
                   scale: isActive ? 1.2 : 0.9,
                 }}
                 transition={{ 
                   duration: 1.2, 
                   y: { duration: 3, repeat: Infinity, ease: "easeInOut" } 
                 }}
                 style={{
                   transformStyle: "preserve-3d",
                   marginLeft: `${angles[idx] * 15}%`
                 }}
               >
                 <div className={cn(
                   "p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/20 min-w-[220px] transition-all duration-500",
                   isActive ? "shadow-[0_40px_80px_rgba(0,0,0,0.6)]" : "shadow-none",
                   isActive && metric.glow
                 )}>
                    <div className="flex items-center gap-3 mb-3">
                       <span className={cn(metric.color, "drop-shadow-sm scale-125")}>{metric.icon}</span>
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">{metric.label}</span>
                    </div>
                    <div className="text-4xl font-outfit font-black tracking-tight text-white drop-shadow-2xl">
                       {metric.value}
                    </div>
                    
                    {/* Active highlight line */}
                    {isActive && (
                      <motion.div layoutId="activeHighlight" className="absolute -bottom-px left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                    )}
                 </div>
               </motion.div>
             );
           })}

           {/* Mobile-only active metric display */}
           <div className="absolute bottom-[-100px] w-full md:hidden flex justify-center z-40">
              <AnimatePresence mode="wait">
                 <motion.div
                   key={activeMetric}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="p-6 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 text-center min-w-[220px] shadow-2xl"
                 >
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">{metrics[activeMetric].label}</div>
                    <div className="text-3xl font-black text-white">{metrics[activeMetric].value}</div>
                 </motion.div>
              </AnimatePresence>
           </div>
        </div>
      </main>

      {/* Footer hint */}
      <div className="absolute bottom-12 w-full text-center z-50">
         <div className="flex items-center justify-center gap-3 text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">
            <ShieldCheck size={16} className="text-skin-glow opacity-50" /> Secure AI Dermal Pipeline
         </div>
      </div>
    </div>
  );
}
