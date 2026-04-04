"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SkinScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export function SkinScoreRing({
  score,
  size = 160,
  strokeWidth = 12,
  className,
  showLabel = true,
  label = "Skin Score",
}: SkinScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-skin-success";
    if (score >= 60) return "text-skin-gold";
    if (score >= 40) return "text-skin-warning";
    return "text-skin-rose";
  };

  const getGradientId = (score: number) => {
    if (score >= 80) return "score-success";
    if (score >= 60) return "score-good";
    if (score >= 40) return "score-moderate";
    return "score-low";
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="score-success" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#68D391" />
            <stop offset="100%" stopColor="#4FD1C5" />
          </linearGradient>
          <linearGradient id="score-good" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C6A85B" />
            <stop offset="100%" stopColor="#D4A853" />
          </linearGradient>
          <linearGradient id="score-moderate" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F6AD55" />
            <stop offset="100%" stopColor="#ED8936" />
          </linearGradient>
          <linearGradient id="score-low" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FC8181" />
            <stop offset="100%" stopColor="#F56565" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth={strokeWidth}
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${getGradientId(score)})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter="url(#glow)"
          className="transition-all duration-1000 ease-out"
          style={{
            transition: "stroke-dashoffset 1s ease-out",
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "text-4xl font-black font-outfit tabular-nums tracking-tight",
            getScoreColor(score)
          )}
        >
          {Math.round(score)}
        </span>
        {showLabel && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-skin-muted mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

interface MiniScoreRingProps {
  score: number;
  size?: number;
  className?: string;
}

export function MiniScoreRing({ score, size = 48, className }: MiniScoreRingProps) {
  const radius = (size - 4) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={3}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#score-success)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <span className="absolute text-xs font-bold text-skin-dark">
        {Math.round(score)}
      </span>
    </div>
  );
}