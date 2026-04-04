"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  tilt?: boolean;
  floatSpeed?: number;
}

export function FloatingCard({
  children,
  className,
  depth = 20,
  tilt = true,
  floatSpeed = 6,
}: FloatingCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current || !tilt) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -depth;
      const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * depth;

      setRotation({ x: rotateX, y: rotateY });
    },
    [depth, tilt]
  );

  const handleMouseLeave = React.useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        "glass-card rounded-3xl transition-all duration-300 ease-out",
        isHovered && "shadow-2xl shadow-skin-violet/10",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(${isHovered ? 0 : -10}px)`,
        transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
      }}
    >
      {children}
    </div>
  );
}

interface ParallaxContainerProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function ParallaxContainer({
  children,
  className,
  intensity = 10,
}: ParallaxContainerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const offsetX = ((e.clientX - centerX) / rect.width) * intensity;
      const offsetY = ((e.clientY - centerY) / rect.height) * intensity;

      setOffset({ x: offsetX, y: offsetY });
    },
    [intensity]
  );

  const handleMouseLeave = React.useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {React.Children.map(children, (child, index) => {
        const depth = (index + 1) * 5;
        return (
          <div
            key={index}
            className="absolute inset-0 transition-transform duration-500 ease-out pointer-events-none"
            style={{
              transform: `translate(${offset.x * depth}px, ${offset.y * depth}px)`,
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}

interface GlassLayerProps {
  children: React.ReactNode;
  blur?: number;
  opacity?: number;
  className?: string;
  zIndex?: number;
}

export function GlassLayer({
  children,
  blur = 20,
  opacity = 0.6,
  className,
  zIndex = 0,
}: GlassLayerProps) {
  return (
    <div
      className={cn("absolute inset-0 rounded-3xl", className)}
      style={{ zIndex }}
    >
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          background: `rgba(255, 255, 255, ${opacity})`,
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
        }}
      />
      <div className="absolute inset-0 rounded-3xl border border-white/40" />
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}

interface FloatingBadgeProps {
  children: React.ReactNode;
  className?: string;
  pulse?: boolean;
}

export function FloatingBadge({
  children,
  className,
  pulse = false,
}: FloatingBadgeProps) {
  return (
    <div
      className={cn(
        "glass-float px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider",
        pulse && "animate-pulse",
        className
      )}
    >
      {children}
    </div>
  );
}

interface DepthCardProps {
  children: React.ReactNode;
  depth?: "shallow" | "medium" | "deep";
  className?: string;
}

export function DepthCard({
  children,
  depth = "medium",
  className,
}: DepthCardProps) {
  const depthStyles = {
    shallow: {
      background: "rgba(255, 255, 255, 0.5)",
      blur: 12,
      shadow: "0 4px 12px -2px rgba(0, 0, 0, 0.06)",
    },
    medium: {
      background: "rgba(255, 255, 255, 0.65)",
      blur: 20,
      shadow: "0 8px 24px -4px rgba(0, 0, 0, 0.1)",
    },
    deep: {
      background: "rgba(255, 255, 255, 0.8)",
      blur: 40,
      shadow: "0 16px 48px -8px rgba(0, 0, 0, 0.15)",
    },
  };

  const style = depthStyles[depth];

  return (
    <div
      className={cn("relative rounded-3xl overflow-hidden", className)}
      style={{
        background: style.background,
        backdropFilter: `blur(${style.blur}px)`,
        WebkitBackdropFilter: `blur(${style.blur}px)`,
        boxShadow: style.shadow,
      }}
    >
      <div className="absolute inset-0 border border-white/40 rounded-3xl" />
      <div className="relative p-6">{children}</div>
    </div>
  );
}