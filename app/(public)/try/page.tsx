"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowLeft,
  Search,
  Globe
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScanCapture } from "@/features/scan/components/scan-capture";
import { CinematicScanner } from "@/features/scan/components/cinematic-scanner";
import { uploadScan } from "@/lib/storage";

export default function TryPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  // Station Mode context
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isStationMode = searchParams?.get('mode') === 'station';
  const stationId = searchParams?.get('stationId');
  const sessionId = searchParams?.get('sessionId');

  const handleCapture = async (capturedFile: File) => {
    setPreview(URL.createObjectURL(capturedFile));
    setIsUploading(true);
    
    try {
      const storagePath = await uploadScan(capturedFile);
      
      const res = await fetch('/api/try', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: storagePath, 
          bodyArea: "Face", 
          concerns: [],
          stationId,
          sessionId
        })
      });

      if (!res.ok) throw new Error('Failed to analyze skin');

      const scan = await res.json();
      sessionStorage.setItem('skinminder_try_result', JSON.stringify(scan));
      
      // Navigate to results after animation (handled by CinematicScanner 10s delay usually, but here we trigger navigation after a timeout)
      setTimeout(() => {
        router.push(`/try/results`);
      }, 10000);
      
    } catch (error) {
      console.error("Scan error:", error);
      alert("Error analyzing scan. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Premium Header */}
        <div className="flex justify-between items-center">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-skin-slate">
            See Your Skin Results
          </h1>
          <p className="text-skin-slate/60 max-w-lg mx-auto text-lg">
            Take a quick photo of your face. We'll analyze your skin and show you 
            hydration, texture, and more — free, in under 10 seconds.
          </p>
        </div>

        {/* The Capture Instrument */}
        <AnimatePresence mode="wait">
          {!isUploading ? (
            <motion.div
              key="capture"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-16"
            >
              <div className="bg-background border border-skin-lavender rounded-[3rem] p-8 sm:p-12 shadow-soft overflow-hidden relative">
                <div className="absolute inset-0 bg-soft-studio opacity-40 pointer-events-none" />
                <div className="relative z-10">
                  <ScanCapture onCapture={handleCapture} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 rounded-2xl bg-white border border-skin-lavender text-center">
                   <p className="font-semibold text-skin-slate">Fast</p>
                   <p className="text-sm text-skin-slate/60">Results in 10 seconds</p>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-skin-lavender text-center">
                   <p className="font-semibold text-skin-slate">Private</p>
                   <p className="text-sm text-skin-slate/60">Your photos stay yours</p>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-skin-lavender text-center">
                   <p className="font-semibold text-skin-slate">Free</p>
                   <p className="text-sm text-skin-slate/60">No credit card needed</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-[600px] flex items-center justify-center">
               {preview && <CinematicScanner preview={preview} />}
            </div>
          )}
        </AnimatePresence>

        {/* Premium Footer */}
        <div className="pt-8 text-center">
           <p className="text-skin-slate/40 text-[10px] font-black uppercase tracking-[0.4em]">
              SkinMinder // Institutional Intelligence // v2.5
           </p>
        </div>
      </div>

      {/* Background Decor */}
      <div className="fixed inset-0 bg-soft-studio opacity-40 pointer-events-none" />
    </div>
  );
}
