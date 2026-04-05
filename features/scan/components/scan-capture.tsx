"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, CheckCircle2, Sun, Smartphone, Eye, X, ShieldCheck, Sparkles, Zap, Globe2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { ScanFrame } from "@/components/ui/scan-frame";

const SCAN_TIPS = [
  { icon: Sun, text: "Capture in natural light", subtext: "Face a window or step outdoors" },
  { icon: Smartphone, text: "Hold steady", subtext: "About arm's length away" },
  { icon: Eye, text: "Look at the camera", subtext: "Keep a neutral expression" },
];

export function ScanCapture({ 
  onCapture, 
  ghostImage,
  isFollowUp = false 
}: { 
  onCapture?: (file: File) => void,
  ghostImage?: string,
  isFollowUp?: boolean
}) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasCaptured, setHasCaptured] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [distance, setDistance] = useState<"ideal" | "too-far" | "too-close">("ideal");
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const startGuidedScan = () => {
    setIsCapturing(true);
    setShowTips(false);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onCapture) {
      setHasCaptured(true);
      setTimeout(() => {
        setIsCapturing(false);
        onCapture(file);
      }, 500);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {showTips ? (
          <motion.div
            key="tips"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            {/* 1. HEADLINE — Outcome-focused */}
            <div className="text-center space-y-3">
              <h3 className="text-2xl md:text-3xl font-black tracking-tight text-content-primary">
                Capture your skin in natural light
              </h3>
              <p className="text-sm md:text-base text-content-secondary leading-relaxed max-w-sm mx-auto">
                Our AI analyzes your skin condition and builds a personalized routine in seconds.
              </p>
            </div>

            {/* 2. TRUST + PROOF — Dermatology-grade positioning */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: ShieldCheck, label: "Dermatology-grade", color: "text-skin-violet", bg: "bg-skin-violet/10", border: "border-skin-violet/20" },
                { icon: Sparkles, label: "7-point analysis", color: "text-skin-gold", bg: "bg-skin-gold/10", border: "border-skin-gold/20" },
                { icon: Globe2, label: "All skin tones", color: "text-skin-glow", bg: "bg-skin-glow/10", border: "border-skin-glow/20" },
                { icon: Zap, label: "Results in 15s", color: "text-skin-violet", bg: "bg-skin-violet/10", border: "border-skin-violet/20" },
              ].map((item, i) => (
                <div key={item.label} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", item.bg, item.border, "border")}>
                    <item.icon size={16} className={item.color} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-content-secondary text-center leading-tight">{item.label}</p>
                </div>
              ))}
            </div>

            {/* 3. INSTRUCTIONS — Scan tips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SCAN_TIPS.map((tip, i) => (
                <div key={i} className="p-4 rounded-2xl border border-white/8 bg-white/[0.03] text-center backdrop-blur-sm">
                  <tip.icon className="w-6 h-6 text-skin-violet mx-auto mb-2" />
                  <p className="text-sm font-bold text-content-primary">{tip.text}</p>
                  <p className="text-xs text-content-muted mt-0.5">{tip.subtext}</p>
                </div>
              ))}
            </div>

            {/* 4. CTA */}
            <Button 
              size="lg" 
              className="w-full h-14 text-lg rounded-2xl font-black shadow-xl shadow-skin-violet/15 hover:shadow-skin-violet/25 transition-all duration-300 ease-out hover:scale-[1.01] active:scale-[0.99]"
              onClick={startGuidedScan}
            >
              <Camera className="w-5 h-5 mr-2" /> Start Skin Scan
            </Button>

            {/* 5. PRIVACY REASSURANCE */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-content-muted font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-skin-gold" />
                Encrypted & private
              </span>
              <span className="h-1 w-1 rounded-full bg-white/15" />
              <span className="flex items-center gap-1.5">
                <Globe2 size={12} className="text-skin-glow" />
                Works on all skin tones
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="capture"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            {/* Camera frame */}
            <ScanFrame 
              status={isCapturing ? "optimizing" : "stabilized"}
              distance={distance}
              hint={isCapturing ? "Hold steady" : undefined}
              className="w-full aspect-[3/4] max-w-sm mx-auto shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
            >
              {hasCaptured && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-20"
                >
                  <CheckCircle2 size={48} className="text-white" />
                </motion.div>
              )}
            </ScanFrame>

            {/* Capture button */}
            <div className="text-center space-y-4">
              <input 
                type="file" 
                accept="image/*" 
                capture="user" 
                className="hidden" 
                ref={cameraInputRef} 
                onChange={handleFile} 
              />

              {isCapturing && !hasCaptured && (
                <>
                  <Button 
                    size="lg"
                    className="h-16 px-12 text-lg rounded-2xl font-black shadow-xl shadow-skin-violet/15 hover:shadow-skin-violet/25 transition-all duration-300 ease-out hover:scale-[1.01] active:scale-[0.99]"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    <Camera className="w-5 h-5 mr-2" /> Capture
                  </Button>
                  <button 
                    onClick={() => { setShowTips(true); setIsCapturing(false); }}
                    className="block mx-auto text-sm text-content-muted hover:text-content-secondary transition-colors"
                  >
                    <X className="w-4 h-4 inline mr-1" /> Cancel
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
