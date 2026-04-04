"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  className,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = React.useState(50);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);

  const handleMove = React.useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = React.useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleMouseUp = React.useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      if (isDragging.current) {
        handleMove(e.clientX);
      }
    },
    [handleMove]
  );

  const handleTouchMove = React.useCallback(
    (e: React.TouchEvent) => {
      handleMove(e.touches[0].clientX);
    },
    [handleMove]
  );

  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full aspect-square rounded-3xl overflow-hidden glass-card cursor-ew-resize",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
    >
      <div className="absolute inset-0">
        <img
          src={afterImage}
          alt="After"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={beforeImage}
            alt="Before"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      <div
        className="absolute top-0 bottom-0 w-1 bg-white/80 shadow-lg cursor-ew-resize"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-skin-violet"
          >
            <path
              d="M8 4L4 8L8 12M8 12L12 8L8 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider">
        {beforeLabel}
      </div>
      <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider">
        {afterLabel}
      </div>
    </div>
  );
}

interface ProgressCardProps {
  metric: string;
  value: number;
  change: number;
  unit?: string;
  className?: string;
}

export function ProgressCard({
  metric,
  value,
  change,
  unit = "",
  className,
}: ProgressCardProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <div className={cn("glass-card p-4 rounded-2xl", className)}>
      <p className="text-xs font-bold uppercase tracking-wider text-skin-muted mb-1">
        {metric}
      </p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black text-skin-dark">{value}{unit}</span>
        {!isNeutral && (
          <span
            className={cn(
              "text-xs font-bold",
              isPositive ? "text-skin-success" : "text-skin-rose"
            )}
          >
            {isPositive ? "+" : ""}
            {change}%
          </span>
        )}
      </div>
    </div>
  );
}

interface TrendSparklineProps {
  data: number[];
  className?: string;
}

export function TrendSparkline({ data, className }: TrendSparklineProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  const isPositive = data[data.length - 1] > data[0];

  return (
    <div className={cn("h-12 w-24", className)}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient
            id="sparkline-gradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor={isPositive ? "#68D391" : "#FC8181"}
              stopOpacity="0.5"
            />
            <stop
              offset="100%"
              stopColor={isPositive ? "#68D391" : "#FC8181"}
              stopOpacity="0"
            />
          </linearGradient>
        </defs>
        <polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#sparkline-gradient)"
        />
        <polyline
          points={points}
          fill="none"
          stroke={isPositive ? "#68D391" : "#FC8181"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}