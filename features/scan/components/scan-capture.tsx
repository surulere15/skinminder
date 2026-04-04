"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, CheckCircle2, Loader2, Sun, Smartphone, Eye, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { ScanFrame } from "@/components/ui/scan-frame";

const SCAN_TIPS = [
  { icon: Sun, text: "Use natural light", subtext: "Face a window or go outdoors" },
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
    <div className="w-full max-w-lg mx-auto space-y-8">
      <AnimatePresence mode="wait">
        {showTips ? (
          <motion.div
            key="tips"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Simple explanation */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-skin-slate">Take a photo of your face</h3>
              <p className="text-sm text-skin-slate/60">We'll analyze your skin and show you the results</p>
            </div>

            {/* Tips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SCAN_TIPS.map((tip, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-skin-lavender text-center">
                  <tip.icon className="w-6 h-6 text-skin-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-skin-slate">{tip.text}</p>
                  <p className="text-xs text-skin-slate/50">{tip.subtext}</p>
                </div>
              ))}
            </div>

            {/* Main CTA */}
            <Button 
              size="lg" 
              className="w-full h-14 text-lg rounded-2xl font-semibold"
              onClick={startGuidedScan}
            >
              <Camera className="w-5 h-5 mr-2" /> Take Photo
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="capture"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Camera frame */}
            <ScanFrame 
              status={isCapturing ? "optimizing" : "stabilized"}
              distance={distance}
              hint={isCapturing ? "Hold steady" : undefined}
              className="w-full aspect-[3/4] max-w-sm mx-auto shadow-lg"
            >
              {hasCaptured && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-20"
                >
                  <CheckCircle2 size={48} className="text-white" />
                </motion.div>
              )}
            </ScanFrame>

            {/* Capture button */}
            <div className="text-center">
              <input 
                type="file" 
                accept="image/*" 
                capture="user" 
                className="hidden" 
                ref={cameraInputRef} 
                onChange={handleFile} 
              />

              {isCapturing && !hasCaptured && (
                <div className="space-y-4">
                  <Button 
                    size="lg"
                    className="h-16 px-12 text-lg rounded-2xl font-semibold"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    <Camera className="w-5 h-5 mr-2" /> Capture
                  </Button>
                  <button 
                    onClick={() => { setShowTips(true); setIsCapturing(false); }}
                    className="block mx-auto text-sm text-skin-slate/50 hover:text-skin-slate"
                  >
                    <X className="w-4 h-4 inline mr-1" /> Cancel
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
