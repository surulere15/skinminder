"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glass?: boolean;
  hoverEffect?: boolean;
  variant?: "default" | "elevated" | "master";
}

export const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ children, className, glass = true, hoverEffect = true, variant = "default", ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverEffect ? { 
          y: -4,
          borderColor: "hsla(39, 50%, 61%, 0.2)",
          transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } 
        } : {}}
        className={cn(
          "relative rounded-[2.5rem] p-8 overflow-hidden transition-all duration-500",
          glass && "bg-black/40 backdrop-blur-3xl border border-white/5",
          variant === "master" && "glass-master",
          variant === "elevated" && "bg-white/[0.03] border-white/10",
          hoverEffect && "shadow-elite hover:shadow-glow",
          className
        )}
        {...(props as any)}
      >
        {/* Elite Top Edge Sheen */}
        {glass && (
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-10" />
        )}
        
        {/* Inner Depth Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }
);

PremiumCard.displayName = "PremiumCard";
