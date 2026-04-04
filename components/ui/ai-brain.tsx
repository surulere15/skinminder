"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

export interface AIBrainProps {
  className?: string;
  isProcessing?: boolean;
  metrics?: {
    hydration?: number;
    texture?: number;
    skinScore?: number;
  };
}

export function AIBrain({ className, isProcessing = false, metrics }: AIBrainProps) {
  // Derive visual states from metrics
  // Derive visual states from metrics
  const hydration = metrics?.hydration ?? 0.7;
  
  // High hydration = vibrant blue, Low = more muted/teal
  const coreColor = hydration > 0.5 ? "var(--skin-blue)" : "var(--skin-teal)";
  const pulseDuration = 6;

  return (
    <div className={cn("relative flex items-center justify-center w-[220px] h-[220px]", className)}>
      {/* 1. Subtle Scanner Pulse */}
      <motion.div
        className="absolute w-[180px] h-[180px] rounded-full border border-[rgb(var(--skin-blue))]/10 bg-[rgb(var(--skin-blue))]/2"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: pulseDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ borderColor: `rgba(var(${coreColor}), 0.2)` }}
      />

      {/* 2. Precision Scanning Crosshair */}
      <svg viewBox="0 0 200 200" className="absolute w-full h-full opacity-30 z-10" style={{ color: `rgb(var(${coreColor}))` }}>
        <line x1="100" y1="15" x2="100" y2="40" stroke="currentColor" strokeWidth="1.5" />
        <line x1="100" y1="160" x2="100" y2="185" stroke="currentColor" strokeWidth="1.5" />
        <line x1="15" y1="100" x2="40" y2="100" stroke="currentColor" strokeWidth="1.5" />
        <line x1="160" y1="100" x2="185" y2="100" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 6" />
      </svg>

      {/* 3. The Central Sensor */}
      <motion.div
        className="relative z-30 w-[80px] h-[80px] rounded-full flex items-center justify-center border border-white/10"
        style={{
          background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.1) 0%, rgba(var(${coreColor}),0.15) 45%, rgb(var(--skin-navy)) 100%)`,
          backdropFilter: "blur(20px)",
        }}
        animate={isProcessing ? {
          scale: [1, 1.1, 1],
          opacity: [0.9, 1, 0.9],
        } : {
          scale: [1, 1.02, 1],
        }}
        transition={{ 
          duration: pulseDuration - 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.div 
          className="w-4 h-4 rounded-full blur-sm" 
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ backgroundColor: `rgb(var(${coreColor}))` }}
        />
        <div className="absolute w-2 h-2 rounded-full bg-white/40 blur-[1px]" />
      </motion.div>

      {/* 4. Scanning Data Points */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            initial={{ 
              x: 100, 
              y: 100,
              opacity: 0
            }}
            animate={{
              x: 100 + Math.cos((i * 45) * Math.PI / 180) * 80,
              y: 100 + Math.sin((i * 45) * Math.PI / 180) * 80,
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: pulseDuration,
              delay: i * (pulseDuration / 8),
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ 
              left: -1.5, 
              top: -1.5,
              backgroundColor: `rgb(var(${coreColor}))`
            }}
          />
        ))}
      </div>
    </div>
  );
}

