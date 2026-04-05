"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Check, 
  Loader2, 
  ShieldCheck,
  Zap,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BODY_AREAS, SKIN_CONCERNS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ScanCapture } from "@/features/scan/components/scan-capture";
import { PremiumCard } from "@/components/ui/premium-card";
import { uploadScan } from "@/lib/storage";

export default function ScanPage() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [bodyArea, setBodyArea] = useState("");
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const analysisSteps = [
    "Face detected",
    "Analyzing hydration",
    "Analyzing texture",
    "Calculating pigmentation",
    "Generating profile"
  ];
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isUploading) {
      interval = setInterval(() => {
        setAnalysisStep(prev => (prev + 1) % analysisSteps.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isUploading]);

  const handleCapture = (capturedFile: File) => {
    setFile(capturedFile);
    setPreview(URL.createObjectURL(capturedFile));
    setStep(2);
  };

  const toggleConcern = (concern: string) => {
    setSelectedConcerns(prev => 
      prev.includes(concern) 
        ? prev.filter(c => c !== concern) 
        : [...prev, concern]
    );
  };

  const handleStartAnalysis = async () => {
    if (!file || !bodyArea) return;
    
    setIsUploading(true);
    try {
      // 1. Upload image to private Supabase storage
      const imageUrl = await uploadScan(file);
      
      // 2. Transmit to orchestrator via API
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          bodyArea,
          concerns: selectedConcerns
        })
      });

      if (!res.ok) {
        throw new Error('Failed to analyze scan');
      }

      const scan = await res.json();
      
      // 3. Navigate to results
      router.push(`/scan/${scan.id}`);
    } catch (error) {
      console.error("Scan error:", error);
      alert("There was an error analyzing your scan. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 lg:p-12 max-w-4xl mx-auto space-y-12 bg-skin-dark text-content-primary">
      {/* Header */}
      <header className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
           {step > 1 && (
             <Button variant="ghost" size="icon" onClick={() => setStep(step - 1)} className="rounded-full hover:bg-skin-muted/10 text-skin-dark">
                <ArrowLeft />
             </Button>
           )}
           <div>
              <h1 className="text-3xl font-outfit font-black tracking-tight text-content-primary">Skin Analysis</h1>
              <p className="text-xs text-content-muted font-medium mt-0.5">Understand your skin in 10 seconds</p>
           </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-skin-surface text-content-secondary text-xs font-black uppercase tracking-widest border border-white/5 shadow-xl">
          <ShieldCheck size={14} className="text-skin-violet" /> Private & Encrypted
        </div>
      </header>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-12 relative z-10"
          >
             <ScanCapture onCapture={handleCapture} />

             {/* Trust signals below capture */}
             <div className="flex items-center justify-center gap-4 text-xs text-content-muted font-medium">
                <span className="flex items-center gap-1.5">
                   <Zap size={14} className="text-skin-violet" />
                   10-second scan
                </span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span className="flex items-center gap-1.5">
                   <ShieldCheck size={14} className="text-skin-gold" />
                   Private & encrypted
                </span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span className="flex items-center gap-1.5">
                   <Sparkles size={14} className="text-skin-glow" />
                   7 AI metrics
                </span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PremiumCard glass={false} className="p-6 rounded-[2.5rem] flex items-start gap-4 border-none bg-skin-surface border border-white/5 shadow-xl hover:bg-white/5 transition-all">
                   <div className="w-10 h-10 rounded-xl bg-skin-violet/10 flex items-center justify-center text-skin-violet flex-shrink-0 border border-skin-violet/20">
                      <Zap size={20} />
                   </div>
                   <p className="text-sm font-black leading-tight text-content-secondary opacity-90">Instant results in seconds</p>
                </PremiumCard>
                <PremiumCard glass={false} className="p-6 rounded-[2.5rem] flex items-start gap-4 border-none bg-skin-surface border border-white/5 shadow-xl hover:bg-white/5 transition-all">
                   <div className="w-10 h-10 rounded-xl bg-skin-gold/10 flex items-center justify-center text-skin-gold flex-shrink-0 border border-skin-gold/20">
                      <Sparkles size={20} />
                   </div>
                   <p className="text-sm font-black leading-tight text-content-secondary opacity-90">7 specific AI metrics scored</p>
                </PremiumCard>
                <PremiumCard glass={false} className="p-6 rounded-[2.5rem] flex items-start gap-4 border-none bg-skin-surface border border-white/5 shadow-xl hover:bg-white/5 transition-all">
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
            className="space-y-8 relative z-10"
          >
            <div className="grid md:grid-cols-2 gap-12">
               <div className="space-y-6">
                  <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-2xl border-4 border-white/10 group relative bg-skin-surface">
                     <img src={preview!} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <Button variant="clinical-ghost" className="w-full h-14 rounded-2xl font-black border-white/5 text-content-secondary hover:bg-white/5 hover:text-content-primary transition-all" onClick={() => setStep(1)}>
                    Retake Photo
                  </Button>
               </div>

               <div className="space-y-10">
                  <section className="space-y-5 text-left">
                     <h3 className="text-xs font-black uppercase tracking-widest text-skin-muted ml-1">1. Body Area</h3>
                     <div className="grid grid-cols-2 gap-3">
                        {BODY_AREAS.slice(0, 6).map(area => (
                          <button
                            key={area}
                            onClick={() => setBodyArea(area)}
                            className={cn(
                              "p-4 rounded-2xl border-2 text-sm font-black capitalize transition-all",
                              bodyArea === area 
                                ? "border-skin-violet bg-skin-violet/10 text-content-primary shadow-lg shadow-skin-violet/10" 
                                : "border-white/5 bg-skin-surface text-content-muted hover:border-white/10 hover:text-content-secondary"
                            )}
                          >
                            {area}
                          </button>
                        ))}
                     </div>
                  </section>

                  <section className="space-y-5 text-left">
                     <h3 className="text-xs font-black uppercase tracking-widest text-skin-muted ml-1">2. Current Concerns</h3>
                     <div className="flex flex-wrap gap-2">
                        {SKIN_CONCERNS.slice(0, 12).map(concern => (
                          <button
                            key={concern}
                            onClick={() => toggleConcern(concern)}
                            className={cn(
                              "px-5 py-2.5 rounded-full border-2 text-xs font-black capitalize transition-all",
                              selectedConcerns.includes(concern) 
                                ? "border-skin-violet bg-skin-violet/10 text-content-primary shadow-lg shadow-skin-violet/10" 
                                : "border-white/5 bg-skin-surface text-content-muted hover:border-white/10 hover:text-content-secondary"
                            )}
                          >
                            {concern}
                          </button>
                        ))}
                     </div>
                  </section>

                   <div className="pt-8 space-y-4">
                      <Button 
                        size="lg" 
                        variant="premium" 
                        className="w-full h-18 text-lg font-black rounded-3xl shadow-2xl shadow-skin-violet/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
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
                        Takes 10 seconds • Private • No extra signup required
                      </p>
                   </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant Scanning Animation Overlay */}
      <AnimatePresence>
        {isUploading && preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#060A18]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6"
          >
            <div className="relative w-64 h-80 rounded-[3.5rem] overflow-hidden shadow-2xl border-4 border-white/20 mb-10 group bg-skin-surface">
              <img src={preview} alt="Scanning area" className="w-full h-full object-cover opacity-60" />
              {/* Scanning Laser Line */}
              <motion.div 
                className="absolute left-0 right-0 h-1 bg-skin-violet shadow-[0_0_25px_8px_rgba(108,123,255,0.7)] z-20"
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="absolute inset-0 border-2 border-white/20 rounded-[3.5rem] m-2 pointer-events-none z-10" />
              <div className="absolute inset-0 bg-gradient-to-b from-skin-violet/20 to-transparent" />
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-6 text-center max-w-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-3">
                   <Sparkles className="animate-pulse w-5 h-5 text-skin-violet" />
                   <h2 className="text-2xl font-semibold tracking-tight text-content-primary">Analyzing your skin</h2>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust Message */}
      <footer className="text-center pt-16 relative z-10">
         <div className="max-w-md mx-auto p-6 rounded-3xl bg-skin-surface border border-white/5 opacity-80 backdrop-blur-sm shadow-2xl">
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
