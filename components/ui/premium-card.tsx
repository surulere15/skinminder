"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glass?: boolean;
  hoverEffect?: boolean;
}

export const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ children, className, glass = true, hoverEffect = true, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverEffect ? { 
          y: -2,
          borderColor: "rgba(255, 255, 255, 0.1)",
          transition: { duration: 0.4, ease: "easeOut" } 
        } : {}}
        className={cn(
          "rounded-2xl p-8 transition-all duration-500",
          glass ? "bg-skin-surface/60 backdrop-blur-xl border border-white/5" : "bg-skin-surface border border-white/5",
          hoverEffect && "shadow-xl",
          className
        )}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }
);

PremiumCard.displayName = "PremiumCard";
