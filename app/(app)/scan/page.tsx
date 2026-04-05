"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Loader2, 
  ShieldCheck,
  Zap,
  ChevronRight,
  ArrowLeft,
  AlertTriangle,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BODY_AREAS, SKIN_CONCERNS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ScanCapture } from "@/features/scan/components/scan-capture";
import { PremiumCard } from "@/components/ui/premium-card";
import { uploadScan } from "@/lib/storage";
import { createClient } from "@/lib/supabase/client";

// Compress image before upload (max 1920px, 0.7 quality)
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_SIZE = 1920;
      let width = img.width;
      let height = img.height;
      if (width > MAX_SIZE || height > MAX_SIZE) {
        if (width > height) { height = (height / width) * MAX_SIZE; width = MAX_SIZE; }
        else { width = (width / height) * MAX_SIZE; height = MAX_SIZE; }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => resolve(new File([blob!], file.name, { type: "image/jpeg" })),
        "image/jpeg",
        0.7
      );
    };
    img.src = URL.createObjectURL(file);
  });
}

export default function ScanPage() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [bodyArea, setBodyArea] = useState("");
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [scanError, setScanError] = useState<string | null>(null);
  const [showAllAreas, setShowAllAreas] = useState(false);
  const [showAllConcerns, setShowAllConcerns] = useState(false);
  const router = useRouter();

  const analysisSteps = [
    "Face detected",
    "Analyzing hydration",
    "Analyzing texture",
    "Calculating pigmentation",
    "Generating profile"
  ];

  // Clean up object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Cycle analysis steps only while uploading
  useEffect(() => {
    if (!isUploading) return;
    const interval = setInterval(() => {
      setAnalysisStep(prev => (prev + 1) % analysisSteps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isUploading]);

  const handleCapture = useCallback((capturedFile: File) => {
    // Validate file size (max 10MB)
    if (capturedFile.size > 10 * 1024 * 1024) {
      setScanError("Image too large. Please use an image under 10MB.");
      return;
    }
    setFile(capturedFile);
    setPreview(URL.createObjectURL(capturedFile));
    setStep(2);
    setScanError(null);
  }, []);

  const toggleConcern = useCallback((concern: string) => {
    setSelectedConcerns(prev => 
      prev.includes(concern) 
        ? prev.filter(c => c !== concern) 
        : [...prev, concern]
    );
  }, []);

  const handleStartAnalysis = useCallback(async () => {
    if (!file || !bodyArea) return;
    
    setIsUploading(true);
    setScanError(null);
    setAnalysisStep(0);
    
    try {
      // 1. Compress image
      const compressedFile = await compressImage(file);
      
      // 2. Upload image to private Supabase storage
      const imageUrl = await uploadScan(compressedFile);
      
      // 3. Get auth token
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Session expired. Please sign in again.");
      }
      
      // 4. Transmit to orchestrator via API
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          imageUrl,
          bodyArea,
          concerns: selectedConcerns
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || `Analysis failed (${res.status})`);
      }

      const scan = await res.json();
      router.push(`/scan/${scan.id}`);
    } catch (error: any) {
      console.error("Scan error:", error);
      setScanError(error.message || "There was an error analyzing your scan. Please try again.");
      setIsUploading(false);
    }
  }, [file, bodyArea, selectedConcerns, router]);

  const handleCancel = useCallback(() => {
    setIsUploading(false);
    setScanError(null);
    setAnalysisStep(0);
  }, []);

  const handleRetry = useCallback(() => {
    setScanError(null);
    handleStartAnalysis();
  }, [handleStartAnalysis]);

  const visibleAreas = showAllAreas ? BODY_AREAS : BODY_AREAS.slice(0, 6);
  const visibleConcerns = showAllConcerns ? SKIN_CONCERNS : SKIN_CONCERNS.slice(0, 12);

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 max-w-3xl mx-auto space-y-8 md:space-y-12 bg-skin-dark text-content-primary">
      {/* Header */}
      <header className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3 md:gap-4">
           {step > 1 && !isUploading && (
             <Button variant="ghost" size="icon" onClick={() => setStep(step - 1)} className="rounded-full hover:bg-skin-muted/10 text-content-primary">
                <ArrowLeft size={20} />
             </Button>
           )}
           <div>
              <h1 className="text-2xl md:text-3xl font-outfit font-black tracking-tight text-content-primary">Skin Analysis</h1>
              <p className="text-xs text-content-muted font-medium mt-0.5">Understand your skin in 10 seconds</p>
           </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-skin-surface text-content-secondary text-[10px] md:text-xs font-black uppercase tracking-widest border border-white/5 shadow-xl">
          <ShieldCheck size={12} className="text-skin-violet" /> Private & Encrypted
        </div>
      </header>

      {/* Error Banner */}
      <AnimatePresence>
        {scanError && !isUploading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20"
          >
            <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-300 font-medium">{scanError}</p>
              <div className="flex gap-3 mt-3">
                <button onClick={handleRetry} className="text-xs font-bold text-red-300 hover:text-red-200 transition-colors">Try Again</button>
                <button onClick={() => { setScanError(null); setStep(1); }} className="text-xs font-bold text-white/50 hover:text-white/70 transition-colors">Start Over</button>
              </div>
            </div>
            <button onClick={() => setScanError(null)} className="text-white/30 hover:text-white/60 transition-colors">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8 md:space-y-12 relative z-10"
          >
             <ScanCapture onCapture={handleCapture} />

             {/* Trust signals */}
             <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs text-content-muted font-medium">
                <span className="flex items-center gap-1.5">
                   <Zap size={14} className="text-skin-violet" />
                   10-second scan
                </span>
                <span className="hidden md:block h-1 w-1 rounded-full bg-white/20" />
                <span className="flex items-center gap-1.5">
                   <ShieldCheck size={14} className="text-skin-gold" />
                   Private & encrypted
                </span>
                <span className="hidden md:block h-1 w-1 rounded-full bg-white/20" />
                <span className="flex items-center gap-1.5">
                   <Sparkles size={14} className="text-skin-glow" />
                   7 AI metrics
                </span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <PremiumCard glass={false} className="p-5 md:p-6 rounded-[2rem] flex items-start gap-4 bg-skin-surface border border-white/5 shadow-xl hover:bg-white/5 transition-all">
                   <div className="w-10 h-10 rounded-xl bg-skin-violet/10 flex items-center justify-center text-skin-violet flex-shrink-0 border border-skin-violet/20">
                      <Zap size={20} />
                   </div>
                   <p className="text-sm font-black leading-tight text-content-secondary opacity-90">Instant results in seconds</p>
                </PremiumCard>
                <PremiumCard glass={false} className="p-5 md:p-6 rounded-[2rem] flex items-start gap-4 bg-skin-surface border border-white/5 shadow-xl hover:bg-white/5 transition-all">
                   <div className="w-10 h-10 rounded-xl bg-skin-gold/10 flex items-center justify-center text-skin-gold flex-shrink-0 border border-skin-gold/20">
                      <Sparkles size={20} />
                   </div>
                   <p className="text-sm font-black leading-tight text-content-secondary opacity-90">7 specific AI metrics scored</p>
                </PremiumCard>
                <PremiumCard glass={false} className="p-5 md:p-6 rounded-[2rem] flex items-start gap-4 bg-skin-surface border border-white/5 shadow-xl hover:bg-white/5 transition-all">
                   <div className="w-10 h-10 rounded-xl bg-skin-glow/10 flex items-center justify-center text-skin-glow flex-shrink-0 border border-skin-glow/20">
                      <ShieldCheck size={20} />
                   </div>
                   <p className="text-sm font-black leading-tight text-content-secondary opacity-90">Encrypted data pipeline</p>
                </PremiumCard>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 md:space-y-8 relative z-10"
          >
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
               <div className="space-y-4 md:space-y-6">
                  <div className="aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-2 md:border-4 border-white/10 group relative bg-skin-surface">
                     {preview && (
                       <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <Button variant="clinical-ghost" className="w-full h-12 md:h-14 rounded-2xl font-black border-white/5 text-content-secondary hover:bg-white/5 hover:text-content-primary transition-all" onClick={() => setStep(1)}>
                    Retake Photo
                  </Button>
               </div>

               <div className="space-y-8 md:space-y-10">
                  <section className="space-y-4 md:space-y-5 text-left">
                     <h3 className="text-xs font-black uppercase tracking-widest text-skin-muted ml-1">1. Body Area</h3>
                     <div className="grid grid-cols-2 gap-2 md:gap-3">
                        {visibleAreas.map(area => (
                          <button
                            key={area}
                            onClick={() => setBodyArea(area)}
                            className={cn(
                              "p-3 md:p-4 rounded-xl md:rounded-2xl border-2 text-xs md:text-sm font-black capitalize transition-all",
                              bodyArea === area 
                                ? "border-skin-violet bg-skin-violet/10 text-content-primary shadow-lg shadow-skin-violet/10" 
                                : "border-white/5 bg-skin-surface text-content-muted hover:border-white/10 hover:text-content-secondary"
                            )}
                          >
                            {area}
                          </button>
                        ))}
                     </div>
                     {BODY_AREAS.length > 6 && !showAllAreas && (
                       <button onClick={() => setShowAllAreas(true)} className="text-xs font-bold text-skin-violet hover:text-skin-violet/80 transition-colors ml-1">
                         Show all {BODY_AREAS.length} areas →
                       </button>
                     )}
                  </section>

                  <section className="space-y-4 md:space-y-5 text-left">
                     <h3 className="text-xs font-black uppercase tracking-widest text-skin-muted ml-1">2. Current Concerns <span className="text-white/30 font-normal normal-case tracking-normal">(optional)</span></h3>
                     <div className="flex flex-wrap gap-2">
                        {visibleConcerns.map(concern => (
                          <button
                            key={concern}
                            onClick={() => toggleConcern(concern)}
                            className={cn(
                              "px-4 py-2 md:px-5 md:py-2.5 rounded-full border-2 text-[11px] md:text-xs font-black capitalize transition-all",
                              selectedConcerns.includes(concern) 
                                ? "border-skin-violet bg-skin-violet/10 text-content-primary shadow-lg shadow-skin-violet/10" 
                                : "border-white/5 bg-skin-surface text-content-muted hover:border-white/10 hover:text-content-secondary"
                            )}
                          >
                            {concern}
                          </button>
                        ))}
                     </div>
                     {SKIN_CONCERNS.length > 12 && !showAllConcerns && (
                       <button onClick={() => setShowAllConcerns(true)} className="text-xs font-bold text-skin-violet hover:text-skin-violet/80 transition-colors ml-1">
                         Show all {SKIN_CONCERNS.length} concerns →
                       </button>
                     )}
                   </section>

                   {/* Results Preview — "What you'll get" */}
                   <section className="space-y-4 text-left">
                      <h3 className="text-xs font-black uppercase tracking-widest text-skin-muted ml-1">What you'll get</h3>
                      <div className="rounded-2xl border border-white/8 bg-skin-surface/50 overflow-hidden">
                        {[
                          ["Skin type classification", "Know your skin's baseline"],
                          ["Acne & pigmentation detection", "See visible concerns clearly"],
                          ["Oil & hydration levels", "Understand your skin's balance"],
                          ["Personalized routine", "Simple steps tailored to you"],
                          ["Product recommendations", "Matches your actual skin needs"],
                        ].map(([title, desc], i) => (
                          <div key={title} className={cn(
                            "flex items-start gap-3 px-4 py-3",
                            i < 4 && "border-b border-white/5"
                          )}>
                            <div className="w-5 h-5 rounded-full bg-skin-violet/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Sparkles size={10} className="text-skin-violet" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-content-primary">{title}</p>
                              <p className="text-[11px] text-content-muted leading-relaxed">{desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                   </section>

                    <div className="pt-4 md:pt-8 space-y-3 md:space-y-4">
                       <Button 
                         size="lg" 
                         variant="premium" 
                         className={cn(
                           "w-full h-[72px] text-lg font-black rounded-3xl shadow-2xl shadow-skin-violet/20 transition-all",
                           !bodyArea ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"
                         )}
                         disabled={!bodyArea || isUploading}
                         onClick={handleStartAnalysis}
                       >
                         {isUploading ? (
                           <><Loader2 className="mr-3 animate-spin w-6 h-6" /> Running AI Core...</>
                         ) : (
                           <>Start Skin Analysis <ChevronRight className="ml-2 w-6 h-6" /></>
                         )}
                       </Button>
                       <p className="text-center text-xs text-content-muted font-medium">
                         Takes ~15 seconds • Private • No extra signup required
                       </p>

                       {/* Micro trust row */}
                       <div className="flex flex-col items-center gap-2 pt-2">
                          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-content-muted font-medium">
                             <span className="flex items-center gap-1.5">
                                <ShieldCheck size={12} className="text-skin-gold" />
                                Encrypted analysis
                             </span>
                             <span className="flex items-center gap-1.5">
                                <Sparkles size={12} className="text-skin-violet" />
                                Dermatology-aligned logic
                             </span>
                             <span className="flex items-center gap-1.5">
                                <Zap size={12} className="text-skin-glow" />
                                Works on all skin tones
                             </span>
                          </div>
                       </div>
                    </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanning Animation Overlay */}
      <AnimatePresence>
        {isUploading && preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-skin-dark/95 backdrop-blur-xl flex flex-col items-center justify-center p-6"
          >
            <div className="relative w-56 md:w-64 h-72 md:h-80 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/20 mb-8 md:mb-10 bg-skin-surface">
              <img src={preview} alt="Scanning area" className="w-full h-full object-cover opacity-60" />
              {/* Scanning Laser Line */}
              <motion.div 
                className="absolute left-0 right-0 h-1 bg-skin-violet shadow-[0_0_25px_8px_rgba(108,123,255,0.7)] z-20"
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="absolute inset-0 border-2 border-white/20 rounded-[3rem] m-2 pointer-events-none z-10" />
              <div className="absolute inset-0 bg-gradient-to-b from-skin-violet/20 to-transparent" />
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-5 md:gap-6 text-center max-w-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-3">
                   <Sparkles className="animate-pulse w-5 h-5 text-skin-violet" />
                   <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-content-primary">Analyzing your skin</h2>
                </div>
                <div className="h-6 overflow-hidden">
                   <motion.p 
                     key={analysisStep}
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     exit={{ y: -20, opacity: 0 }}
                     className="text-skin-violet font-bold uppercase tracking-widest text-[10px]"
                   >
                     {analysisSteps[analysisStep]}
                   </motion.p>
                </div>
              </div>
              <p className="text-content-secondary font-medium opacity-80 text-sm leading-relaxed">
                Our AI is reading visible skin patterns and building your personalized profile.
              </p>
              <button 
                onClick={handleCancel}
                className="mt-2 text-xs font-bold text-white/40 hover:text-white/60 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust Message */}
      <footer className="text-center pt-8 md:pt-16 relative z-10">
         <div className="max-w-md mx-auto p-5 md:p-6 rounded-2xl md:rounded-3xl bg-skin-surface border border-white/5 opacity-80 backdrop-blur-sm shadow-2xl">
            <p className="text-[10px] text-content-muted font-black uppercase tracking-widest mb-3">Built for trust</p>
            <p className="text-xs text-content-secondary font-bold leading-relaxed">
              Your photos are encrypted and only visible to you. 
              SkinMinder provides cosmetic analysis — not medical diagnosis.
            </p>
         </div>
      </footer>
    </div>
  );
}
