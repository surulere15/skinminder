"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * HIGH-FIDELITY CSS 3D LOGO
 * A premium, volumetric glassmorphism implementation that bypasses 
 * dependency blocks while maintaining the 10/10 aesthetic.
 */
export function Logo3D({ className }: { className?: string }) {
  return (
    <div className={cn("relative z-10 flex flex-col items-start justify-center select-none", className)}>
      <motion.div 
        animate={{ 
          y: [0, -8, 0],
          rotateX: [0, 5, 0],
          rotateY: [0, 10, 0]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{ perspective: 1000 }}
        className="relative group cursor-default"
      >
        {/* 1. LAYER: Ambient Backdrop Glow (The "Aura") */}
        <div className="absolute -inset-4 bg-gradient-to-r from-skin-violet/20 via-skin-rose/20 to-skin-violet/20 blur-2xl rounded-full opacity-40 group-hover:opacity-70 transition-opacity duration-1000" />
        
        {/* 2. LAYER: The Volumetric Glass Shadow (Depth) */}
        <div className="absolute inset-0 translate-y-3 blur-md opacity-20 text-black font-outfit font-black tracking-tighter text-2xl md:text-3xl">
          SkinMinder
        </div>

        {/* 3. LAYER: The Main Glass Corpus */}
        <span 
          className="relative text-2xl md:text-3xl font-outfit font-black tracking-tighter block"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 50%, rgba(200,200,200,0.9) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0px 2px 1px rgba(255,255,255,0.8))",
          }}
        >
          SkinMinder
        </span>

        {/* 4. LAYER: Specular Rim Lighting (Refinement) */}
        <span 
          className="absolute inset-0 text-2xl md:text-3xl font-outfit font-black tracking-tighter pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            transform: "translateY(-0.5px) translateX(-0.5px)",
            opacity: 0.9,
          }}
        >
          SkinMinder
        </span>

        {/* 5. LAYER: Dynamic Refraction Shine (Animation) */}
        <span 
          className="absolute inset-0 text-2xl md:text-3xl font-outfit font-black tracking-tighter pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0) 25%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 75%, transparent 100%)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mixBlendMode: "overlay",
          }}
        >
          <motion.span
            className="block"
            animate={{ backgroundPosition: ["100% 0", "-100% 0"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
            style={{ 
              background: "inherit", 
              WebkitBackgroundClip: "inherit",
              WebkitTextFillColor: "inherit"
            }}
          >
            SkinMinder
          </motion.span>
        </span>
      </motion.div>

      {/* 6. LAYER: Floor Contact Shadow */}
      <motion.div 
        animate={{ scaleX: [0.8, 1, 0.8], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-2 w-3/4 h-1 bg-black/20 blur-lg rounded-full"
      />
    </div>
  );
}
