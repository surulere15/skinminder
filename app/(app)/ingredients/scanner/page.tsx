"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Camera, Focus, AlertTriangle, CheckCircle2, Info, Loader2, ArrowLeft, Dna } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IngredientToxicology } from "@/components/ui/ingredient-toxicology";

export default function IngredientScannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setResults(null); 
    }
  };

  const clearSelection = () => {
     setFile(null);
     setPreview(null);
     setResults(null);
     if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleScan = async () => {
    if (!preview) return;
    
    setIsScanning(true);
    try {
      const res = await fetch('/api/ingredients/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: preview })
      });
      
      const data = await res.json();
      if (res.ok) {
         setResults(data);
      } else {
         console.error("Analysis failed:", data.error);
         alert(data.error || "Failed to analyze ingredients. Please try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Network error occurred during analysis.");
    } finally {
      setIsScanning(false);
    }
  };

  const VerdictIcon = ({ verdict }: { verdict: string }) => {
     switch (verdict) {
       case 'beneficial': return <CheckCircle2 className="w-5 h-5 text-skin-glow flex-shrink-0" />;
       case 'neutral': return <Info className="w-5 h-5 text-skin-violet flex-shrink-0" />;
       case 'caution': return <AlertTriangle className="w-5 h-5 text-skin-gold flex-shrink-0" />;
       case 'avoid': return <AlertTriangle className="w-5 h-5 text-skin-rose flex-shrink-0" />;
       default: return <Info className="w-5 h-5 text-content-secondary flex-shrink-0" />;
     }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#0B1020] p-4 md:p-8 pt-6 pb-24 relative overflow-hidden text-content-primary">
       {/* Accents */}
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
       
       <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="flex items-center gap-6">
             <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm hover:bg-skin-muted/10 shrink-0 border border-skin-border/10">
                   <ArrowLeft />
                </Button>
             </Link>
             <div className="text-left">
               <h1 className="text-3xl font-outfit font-black tracking-tight flex items-center gap-3 text-content-primary">
                 Ingredient Intelligence
               </h1>
               <p className="text-content-secondary text-sm font-bold opacity-80 uppercase tracking-widest text-[10px] mt-1">Direct verification against your verified Skin DNA.</p>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
             
             {/* Left Col: Upload & Preview */}
             <div className="space-y-8">
                  {!preview ? (
                    <Card className="glass-panel border-dashed border-2 border-skin-border/20 bg-white/40 hover:bg-white/60 transition-all shadow-xl shadow-black/5 cursor-pointer rounded-[3rem] group" onClick={() => fileInputRef.current?.click()}>
                      <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-8 h-[450px]">
                         <div className="w-24 h-24 rounded-[2.5rem] bg-skin-muted/5 flex items-center justify-center border border-skin-border/10 shadow-inner group-hover:scale-105 transition-transform">
                            <Focus className="w-12 h-12 text-skin-violet" />
                         </div>
                         <div>
                            <h3 className="text-2xl font-outfit font-black text-content-primary mb-3">Scan Ingredient Label</h3>
                            <p className="text-content-secondary text-sm max-w-[280px] mx-auto font-bold opacity-80 leading-relaxed">
                               Snap a clear vertical photo of the ingredients list on any product packaging.
                            </p>
                         </div>
                         <Button variant="premium" className="px-10 h-14 rounded-2xl shadow-xl shadow-skin-violet/20 font-black">
                            <Camera className="mr-3 w-5 h-5" /> Open Camera
                         </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="glass-panel border-0 shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden relative group rounded-[3rem]">
                       <img src={preview} alt="Ingredient Label" className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-105" />
                       
                       <AnimatePresence>
                        {isScanning && (
                           <motion.div 
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             className="absolute inset-0 bg-skin-graphite/80 backdrop-blur-xl flex flex-col items-center justify-center text-skin-pearl z-20 p-8"
                           >
                              <div className="relative w-20 h-20 mb-8">
                                <Focus className="w-20 h-20 text-skin-glow animate-pulse" />
                                <div className="absolute inset-0 border-2 border-skin-glow rounded-xl animate-ping opacity-30" />
                              </div>
                              <h3 className="text-3xl font-outfit font-black mb-3">Cross-referencing DNA...</h3>
                              <p className="text-white/60 font-bold max-w-[280px] text-center text-sm leading-relaxed">
                                 Checking compatibility with your verified biological dermal archetype.
                              </p>
                           </motion.div>
                        )}
                       </AnimatePresence>

                       {!isScanning && !results && (
                          <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col gap-4">
                             <Button size="lg" variant="premium" className="w-full h-16 rounded-3xl shadow-2xl shadow-skin-violet/30 border border-white/20 font-black text-lg" onClick={handleScan}>
                                <Dna className="mr-3 w-6 h-6" /> Analyze Match
                             </Button>
                             <Button variant="ghost" className="text-skin-pearl font-bold hover:bg-white/10" onClick={clearSelection}>
                                Retake Photo
                             </Button>
                          </div>
                       )}
                       
                       {results && (
                          <Button variant="ghost" size="icon" className="absolute top-6 right-6 bg-black/40 text-skin-pearl rounded-full hover:bg-black/60 backdrop-blur-md w-12 h-12" onClick={clearSelection}>
                             ✕
                          </Button>
                       )}
                    </Card>
                  )}
                  <input 
                     type="file" 
                     accept="image/*" 
                     className="hidden" 
                     ref={fileInputRef} 
                     onChange={handleFileChange} 
                  />
             </div>

             {/* Right Col: Results */}
             <div className="space-y-10">
                <AnimatePresence mode="wait">
                   {results ? (
                      <motion.div
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         key="results"
                         className="space-y-10"
                      >
                         {/* Match Score Card */}
                         <Card className="glass-panel-dark bg-skin-graphite border-0 shadow-[0_45px_100px_rgba(0,0,0,0.4)] relative overflow-hidden rounded-[3.5rem] text-skin-pearl group">
                            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[90px] -z-10 group-hover:scale-110 transition-transform duration-1000 ${results.compatibilityScore > 70 ? 'bg-skin-glow/20' : results.compatibilityScore > 40 ? 'bg-skin-gold/20' : 'bg-skin-rose/20'}`} />
                            <CardContent className="p-10 relative z-10 flex flex-col justify-center h-full text-left">
                               <div className="flex items-center justify-between mb-8">
                                  <div className="flex items-center gap-3 text-white/50 font-black text-xs tracking-widest uppercase">
                                     <Dna size={20} className="text-skin-gold" /> Identity Match
                                  </div>
                                  <div className={cn(
                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                    results.compatibilityScore > 70 
                                      ? "bg-skin-glow/20 border-skin-glow/30 text-skin-glow" 
                                      : "bg-skin-gold/20 border-skin-gold/30 text-skin-gold"
                                  )}>
                                     {results.compatibilityScore > 70 ? 'Optimal Baseline' : 'Use with Caution'}
                                  </div>
                               </div>
                               <div className="flex items-baseline gap-3 mb-6">
                                  <span className="text-8xl font-outfit font-black tracking-tighter drop-shadow-2xl">
                                     {results.compatibilityScore}
                                  </span>
                                  <span className="text-2xl font-black text-white/40 uppercase tracking-widest text-xs">% Compatibility</span>
                                </div>
                               <p className="text-lg font-medium text-white/90 leading-relaxed drop-shadow-md">
                                  {results.summary}
                               </p>
                            </CardContent>
                         </Card>

                          {/* Predictive Toxicology Panel */}
                          <IngredientToxicology />
 
                          {/* Ingredient Breakdown */}
                         <div className="space-y-6">
                            <h3 className="font-outfit font-black text-2xl text-content-primary px-4 text-left">Deep Breakdown</h3>
                            <div className="space-y-4">
                               {results.ingredients?.map((ing: any, i: number) => (
                                  <Card key={i} className={cn(
                                    "border-none shadow-xl shadow-black/5 rounded-[2.5rem] overflow-hidden group hover:bg-white transition-all duration-300 border-l-8 text-left",
                                    ing.verdict === 'beneficial' ? 'border-skin-glow bg-skin-glow/5' : 
                                    ing.verdict === 'caution' ? 'border-skin-gold bg-skin-gold/5' : 
                                    ing.verdict === 'avoid' ? 'border-skin-rose bg-skin-rose/5' : 
                                    'border-skin-violet bg-skin-violet/5'
                                  )}>
                                     <CardContent className="p-6 flex gap-6">
                                        <div className="pt-1">
                                           <VerdictIcon verdict={ing.verdict} />
                                        </div>
                                        <div className="space-y-1">
                                           <div className="flex items-center justify-between">
                                              <span className="font-black text-xl text-content-primary tracking-tight capitalize">{ing.name}</span>
                                           </div>
                                           <p className="text-sm text-content-secondary font-bold leading-relaxed opacity-90">
                                              {ing.reason}
                                           </p>
                                        </div>
                                     </CardContent>
                                  </Card>
                               ))}
                            </div>
                         </div>
                      </motion.div>
                   ) : (
                      <motion.div
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         key="empty"
                         className="h-[450px] flex flex-col items-center justify-center text-center space-y-6 px-10 border-2 border-dashed border-skin-border/20 rounded-[3.5rem] bg-skin-muted/5 group hover:border-skin-border/40 transition-all"
                      >
                         <div className="w-20 h-20 rounded-[2rem] bg-skin-muted/10 flex items-center justify-center text-content-secondary/30 group-hover:scale-110 transition-transform">
                            <Dna className="w-10 h-10" />
                         </div>
                         <div>
                            <h4 className="font-outfit font-black text-2xl text-content-primary opacity-60">Waiting for Dermal Input</h4>
                            <p className="text-content-secondary text-sm mt-3 max-w-[280px] font-bold opacity-80 leading-relaxed">
                               Upload an ingredient list to see how it sequences with your specific biological profile before integrated purchase.
                            </p>
                         </div>
                      </motion.div>
                   )}
                </AnimatePresence>
             </div>
          </div>
       </div>
    </div>
  );
}
