"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Particles() {
  const [particles, setParticles] = useState<{ id: number; top: number; left: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate random particles only on client to avoid hydration mismatch
    const newParticles = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => {
        // 3-Layer Depth System for 9.5/10 push
        const isMicro = p.id >= 40;
        const isDistant = p.id < 20;
        
        return (
          <motion.div
            key={p.id}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: isMicro ? [0, -10, 0] : (isDistant ? [0, -30, 0] : [0, -60, 0]),
              opacity: isMicro ? [0, 0.1, 0] : (isDistant ? [0, 0.25, 0] : [0, 0.5, 0]),
              x: isMicro ? [0, 2, 0] : (isDistant ? [0, 8, 0] : [0, -20, 0]),
            }}
            transition={{
              duration: isMicro ? Math.random() * 80 + 60 : (isDistant ? Math.random() * 50 + 50 : Math.random() * 30 + 30),
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
            className="absolute rounded-full bg-white shadow-[0_0_10px_1px_rgba(255,255,255,0.3)]"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              width: isMicro ? `${p.size * 0.3}px` : (isDistant ? `${p.size * 0.6}px` : `${p.size}px`),
              height: isMicro ? `${p.size * 0.3}px` : (isDistant ? `${p.size * 0.6}px` : `${p.size}px`),
              filter: isMicro || isDistant ? "blur(1px)" : "none",
            }}
          />
        );
      })}
      
      {/* Deep Space Gradients with Breathing Motion */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.08, 0.03] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-accent-lavender blur-[120px] rounded-full mix-blend-screen" 
      />
      <motion.div 
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.03, 0.07, 0.03] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-accent-pink blur-[150px] rounded-full mix-blend-screen" 
      />
    </div>
  );
}
