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
  X,
  Fingerprint,
  Activity,
  Dna
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BODY_AREAS, SKIN_CONCERNS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ScanCapture } from "@/features/scan/components/scan-capture";
import { uploadScan } from "@/lib/storage";
import { createClient } from "@/lib/supabase/client";
import { PremiumCard } from "@/components/ui/premium-card";

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
    "Dermal Surface Mapping...",
    "Sequencing Hydration Biomarkers...",
    "Analyzing Structural Integrity...",
    "Calculating Pigmentation Delta...",
    "Synthesizing Diagnostic Profile..."
  ];

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    if (!isUploading) return;
    const interval = setInterval(() => {
      setAnalysisStep(prev => (prev + 1) % analysisSteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isUploading]);

  const handleCapture = useCallback((capturedFile: File) => {
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
      const compressedFile = await compressImage(file);
      const imageUrl = await uploadScan(compressedFile);
      
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Session expired. Please sign in again.");
      }
      
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

  const visibleAreas = showAllAreas ? BODY_AREAS : BODY_AREAS.slice(0, 6);
  const visibleConcerns = showAllConcerns ? SKIN_CONCERNS : SKIN_CONCERNS.slice(0, 12);

  return (
    <div className="p-8 lg:p-16 space-y-16 max-w-4xl mx-auto bg-transparent min-h-full text-white relative">
      
      {/* Header: Diagnostic Title */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10 border-b border-white/5 pb-12">
        <div className="space-y-4 text-left flex-1">
          <div className="flex items-center gap-4">
             {step > 1 && !isUploading && (
               <Button variant="clinical-ghost" size="icon" onClick={() => setStep(step - 1)} className="rounded-2xl h-12 w-12 border-white/5">
                  <ArrowLeft size={20} />
               </Button>
             )}
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20 shadow-glow italic">
               <Fingerprint size={14} /> Guided Intel System
             </div>
          </div>
          <h1 className="text-4xl lg:text-6xl text-diagnostic leading-none">Diagnostic Capture</h1>
          <p className="text-white/40 text-xl font-medium max-w-xl border-l-2 border-primary/30 pl-8 py-1">
             Synchronizing optical sensors with neural dermal analysis for real-time biological profiling.
          </p>
        </div>
        {!isUploading && (
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-elite">
             <div className="relative flex h-2.5 w-2.5">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
               <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white/60 italic">Private & Encrypted Sequence</span>
          </div>
        )}
      </header>

      {/* Error Banner */}
      <AnimatePresence>
        {scanError && !isUploading && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-start gap-5 p-8 rounded-[2rem] bg-red-500/10 border border-red-500/20 backdrop-blur-xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-red-500/40" />
            <AlertTriangle size={24} className="text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-left space-y-4">
              <p className="text-lg text-red-300 font-bold italic uppercase tracking-tight">{scanError}</p>
              <div className="flex gap-6">
                <button onClick={() => handleCapture(file!)} className="text-xs font-black text-red-300 hover:text-red-200 transition-colors uppercase tracking-widest border-b border-red-500/20">Retry Sequence</button>
                <button onClick={() => { setScanError(null); setStep(1); }} className="text-xs font-black text-white/30 hover:text-white/50 transition-colors uppercase tracking-widest">Restart Initialization</button>
              </div>
            </div>
            <button onClick={() => setScanError(null)} className="text-white/20 hover:text-white/50 transition-colors">
              <X size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="space-y-12 relative z-10"
          >
             <div className="glass-master rounded-[3.5rem] p-4 border-white/5">
               <ScanCapture onCapture={handleCapture} />
             </div>

             {/* Dynamic Feature Highlights */}
             <div className="grid md:grid-cols-3 gap-8">
                {[
                  { icon: Zap, label: "Neural Synthesis", desc: "15s Analysis Loop" },
                  { icon: Sparkles, label: "7 Bio-Metrics", desc: "Precision Profiling" },
                  { icon: ShieldCheck, label: "Data Isolation", desc: "Military Encryption" }
                ].map((feat, i) => (
                  <PremiumCard key={i} variant="elevated" className="p-8 text-left border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-glow mb-6">
                      <feat.icon size={22} />
                    </div>
                    <p className="text-label text-primary/70">{feat.label}</p>
                    <p className="text-lg font-black text-white italic uppercase tracking-tighter mt-1">{feat.desc}</p>
                  </PremiumCard>
                ))}
             </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="space-y-16 relative z-10"
          >
            <div className="grid lg:grid-cols-2 gap-16 items-start">
               {/* Optical Capture Preview */}
               <div className="space-y-8">
                   <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-elite border-8 border-white/5 group relative bg-black">
                      {preview && (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale brightness-125" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
                      
                      {/* Diagnostic Overlay */}
                      <div className="absolute bottom-6 left-6 right-6 p-5 rounded-3xl bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <Activity size={18} className="text-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic">Optical Fidelity Confirmed</span>
                         </div>
                         <div className="text-xl font-black text-emerald-400 italic">98%</div>
                      </div>
                   </div>
                  <Button variant="clinical-ghost" className="w-full h-16 text-sm border-white/5" onClick={() => setStep(1)}>
                    Recalibrate Optical Input
                  </Button>
               </div>

               <div className="space-y-12">
                  {/* Selection Logic */}
                  <section className="space-y-6 text-left">
                     <h3 className="text-label ml-2">I. Regional Mapping</h3>
                     <div className="grid grid-cols-2 gap-4">
                        {visibleAreas.map(area => (
                          <button
                            key={area}
                            onClick={() => setBodyArea(area)}
                             className={cn(
                               "h-16 px-6 rounded-2xl border-2 text-[11px] font-black uppercase italic tracking-widest transition-all duration-500 ease-out",
                               bodyArea === area 
                                 ? "border-primary bg-primary/20 text-white shadow-glow" 
                                 : "border-white/5 bg-white/[0.02] text-white/30 hover:border-white/10 hover:text-white/50"
                             )}
                          >
                            {area}
                          </button>
                        ))}
                     </div>
                      {BODY_AREAS.length > 6 && !showAllAreas && (
                        <button onClick={() => setShowAllAreas(true)} className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors ml-2 italic">
                          Expand Map Archive →
                        </button>
                      )}
                  </section>

                  <section className="space-y-6 text-left">
                     <h3 className="text-label ml-2">II. Pathological Indicators</h3>
                     <div className="flex flex-wrap gap-3">
                        {visibleConcerns.map(concern => (
                          <button
                            key={concern}
                            onClick={() => toggleConcern(concern)}
                             className={cn(
                               "px-6 py-3 rounded-full border-2 text-[10px] font-black uppercase italic tracking-widest transition-all duration-500 ease-out",
                               selectedConcerns.includes(concern) 
                                 ? "border-primary bg-primary/20 text-white shadow-glow" 
                                 : "border-white/5 bg-white/[0.02] text-white/30 hover:border-white/10 hover:text-white/50"
                             )}
                          >
                            {concern}
                          </button>
                        ))}
                     </div>
                      {SKIN_CONCERNS.length > 12 && !showAllConcerns && (
                        <button onClick={() => setShowAllConcerns(true)} className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors ml-2 italic">
                          View All Biomarkers →
                        </button>
                      )}
                   </section>

                   {/* Execution Section */}
                    <div className="pt-12 space-y-6">
                       <Button 
                         size="lg" 
                         variant="flagship" 
                         className={cn(
                           "w-full h-24 text-lg transition-all duration-700",
                           !bodyArea ? "opacity-30 grayscale cursor-not-allowed" : "shadow-glow"
                         )}
                         disabled={!bodyArea || isUploading}
                         onClick={handleStartAnalysis}
                       >
                         {isUploading ? (
                           <><Loader2 className="mr-4 animate-spin w-8 h-8" /> Sequencing Neural Core...</>
                         ) : (
                           <>Initialize Analysis Sequence <ChevronRight className="ml-3 w-8 h-8" /></>
                         )}
                       </Button>
                       
                       <p className="text-center text-[10px] text-white/20 font-bold uppercase tracking-[0.3em] italic">
                         Sync Time: &lt;15.0s • Latency: Optimal • Bio-Fidelity: Verified
                       </p>
                    </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanning Animation Overlay: THE MASTER CLASS */}
      <AnimatePresence>
        {isUploading && preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center p-12"
          >
             <div className="absolute inset-0 dermal-mesh opacity-40" />
             
            <div className="relative w-72 md:w-80 h-[420px] rounded-[4rem] overflow-hidden shadow-elite border-8 border-white/5 mb-16 bg-black">
              <img src={preview} alt="Scanning area" className="w-full h-full object-cover opacity-50 grayscale brightness-150" />
              
              {/* LIQUID GOLD SCANNING BAR */}
              <motion.div 
                className="absolute left-0 right-0 h-2 bg-primary shadow-[0_0_40px_15px_rgba(201,169,110,0.8)] z-30"
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                 <div className="absolute -top-12 left-0 right-0 h-12 bg-gradient-to-t from-primary/30 to-transparent" />
                 <div className="absolute -bottom-24 left-0 right-0 h-24 bg-gradient-to-b from-primary/10 to-transparent" />
              </motion.div>

              {/* Matrix Net Overlay */}
              <div className="absolute inset-0 dermal-grid opacity-30 z-20" />
              
              {/* Corner Brackets */}
              <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-primary/40 rounded-tl-2xl" />
              <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-primary/40 rounded-tr-2xl" />
              <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-primary/40 rounded-bl-2xl" />
              <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-primary/40 rounded-br-2xl" />
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-10 text-center max-w-xl z-10"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-4">
                   <div className="w-16 h-16 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-glow">
                      <Dna size={32} className="animate-[spin_4s_linear_infinite]" />
                   </div>
                   <h2 className="text-4xl lg:text-5xl text-diagnostic leading-none">Mapping Subject Delta</h2>
                </div>
                <div className="h-10 overflow-hidden">
                   <AnimatePresence mode="wait">
                      <motion.p 
                        key={analysisStep}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="text-primary font-black uppercase tracking-[0.4em] text-xs italic"
                      >
                        {analysisSteps[analysisStep]}
                      </motion.p>
                   </AnimatePresence>
                </div>
              </div>
              <p className="text-white/40 font-medium text-xl leading-relaxed max-w-md">
                Our neural core is decrypting dermal patterns to synthesize your biological protocol.
              </p>
              <button 
                onClick={handleCancel}
                className="mt-4 text-[11px] font-black text-white/20 hover:text-primary transition-all uppercase tracking-[0.3em] italic border-b border-white/5 pb-1"
              >
                Abort Protocol Sequence
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Disclaimer */}
      <footer className="pt-20 pb-12 relative z-10">
         <PremiumCard variant="elevated" className="max-w-xl mx-auto p-10 opacity-60 border-white/5">
            <p className="text-label text-primary/50 mb-3">Diagnostic Integrity</p>
            <p className="text-sm text-white/30 font-medium leading-relaxed italic">
              Encrypted optical analysis provides cosmetic wellness insights via neural pattern recognition. Protocols are for wellness enhancement and do not substitute clinical medical prescriptions.
            </p>
         </PremiumCard>
      </footer>
    </div>
  );
}
