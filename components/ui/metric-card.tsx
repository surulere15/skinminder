"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Droplets, Focus, Grid, Droplet, TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [value, count]);

  useEffect(() => {
    return rounded.on("change", (latest) => setDisplayValue(latest));
  }, [rounded]);

  return <>{displayValue}</>;
}

interface MetricCardProps {
  label: string;
  value: number;
  confidence?: number;
  trend?: "up" | "down" | "stable";
  previousValue?: number;
  className?: string;
  showConfidence?: boolean;
}

const getIconForLabel = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes("hydration")) return <Droplets strokeWidth={2} size={18} />;
  if (l.includes("pigmentation")) return <Focus strokeWidth={2} size={18} />;
  if (l.includes("texture")) return <Grid strokeWidth={2} size={18} />;
  if (l.includes("oil")) return <Droplet strokeWidth={2} size={18} />;
  return <Droplets strokeWidth={2} size={18} />;
};

export function MetricCard({ 
  label, 
  value, 
  confidence,
  trend = "stable", 
  previousValue,
  className,
  showConfidence = true,
}: MetricCardProps) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const trendChange = previousValue ? Math.round(value - previousValue) : null;
  
  const getConfidenceLabel = (conf: number) => {
    if (conf >= 90) return "High confidence";
    if (conf >= 70) return "Medium confidence";
    return "Low confidence - try another photo";
  };

  return (
    <Card className={cn(
      "p-6 rounded-2xl bg-white border border-skin-lavender",
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-skin-primary mb-1">
          {getIconForLabel(label)}
        </div>
        {trendChange !== null && (
          <div className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            trendChange > 0 ? "bg-green-100 text-green-700" : 
            trendChange < 0 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
          )}>
            {trendChange > 0 ? "+" : ""}{trendChange}%
          </div>
        )}
      </div>

      <p className="text-sm font-medium text-skin-slate mb-1">{label}</p>
      
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-skin-slate">
          <AnimatedNumber value={value} />
        </span>
        <span className="text-sm text-skin-slate/50">/ 100</span>
      </div>

      {showConfidence && confidence !== undefined && (
        <div className="mt-3 pt-3 border-t border-skin-lavender/50">
          <div className="flex items-center gap-2">
            <Info size={14} className="text-skin-slate/40" />
            <p className="text-xs text-skin-slate/60">
              {getConfidenceLabel(confidence)}
            </p>
          </div>
        </div>
      )}

      {previousValue === undefined && (
        <div className="mt-3 pt-3 border-t border-skin-lavender/50">
          <p className="text-xs text-skin-slate/50">
            Scan again in 1 week to track changes
          </p>
        </div>
      )}
    </Card>
  );
}
