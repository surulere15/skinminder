"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Beaker, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  Info,
  ChevronRight,
  ShieldAlert,
  Loader2,
  Sun,
  Moon,
  Heart,
  Zap,
  Clock,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function IngredientsPage() {
  const [query, setQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const commonIngredients = ["Retinol", "Niacinamide", "Hyaluronic Acid", "Vitamin C", "Squalane", "Salicylic Acid"];

  const analyzeIngredient = async (name: string) => {
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const res = await fetch("/api/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredientName: name, skinType: "combination", concerns: ["texture", "hydration"] }),
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysis(data);
      }
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      analyzeIngredient(query.trim());
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white p-6 lg:p-12">
      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-[#c9a96e]/10 blur-3xl opacity-50" />
        <div className="absolute right-[-8%] top-[10%] h-[360px] w-[360px] rounded-full bg-white/[0.03] blur-3xl opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto space-y-12 md:space-y-16 relative z-10">
        {/* Header */}
        <header className="space-y-4 pb-8 border-b border-white/5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/20 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#c9a96e]/5">
            <Beaker size={14} className="text-[#c9a96e]" /> Molecular Intelligence
          </div>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-white uppercase italic leading-none">Ingredient Decoder</h1>
          <p className="text-white/50 font-medium text-lg max-w-2xl border-l-2 border-[#c9a96e]/30 pl-6 py-1">
            Discover the high-fidelity science behind your skincare. AI analysis of molecular compatibility with your Skin DNA.
          </p>
        </header>

        <div className="lg:col-span-12">
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-3xl shadow-2xl rounded-[4rem] p-12 md:p-20 overflow-hidden relative group">
               <div className="grid lg:grid-cols-2 gap-20 relative z-10">
                  <div className="space-y-12">
                     <div className="space-y-4 text-left">
                        <h2 className="text-4xl font-black text-white uppercase italic tracking-tight">Molecular Query</h2>
                        <p className="text-white/40 text-lg font-medium italic border-l-2 border-[#c9a96e]/30 pl-6">Decipher the biochemical sequence of any active compound.</p>
                     </div>
                     
                     <form onSubmit={handleSearch} className="relative group">
                        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-white/20 w-7 h-7 group-focus-within:text-[#c9a96e] transition-colors" />
                        <Input 
                          placeholder="Search molecule..." 
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          className="h-24 pl-20 pr-8 rounded-[2.5rem] text-2xl font-black uppercase italic tracking-wider border-white/10 bg-black shadow-2xl focus-visible:ring-2 focus-visible:ring-[#c9a96e]/20 transition-all placeholder:text-white/10 text-white"
                        />
                        {isAnalyzing && (
                          <div className="absolute right-8 top-1/2 -translate-y-1/2">
                             <Loader2 className="animate-spin text-[#c9a96e] w-8 h-8" />
                          </div>
                        )}
                     </form>

                     <div className="space-y-6 text-left">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 flex items-center gap-2">
                          <Sparkles size={14} className="text-[#c9a96e]" /> Clinical Hot-Keys
                        </h3>
                        <div className="flex flex-wrap gap-4">
                          {commonIngredients.map(name => (
                            <Button 
                              key={name}
                              variant="outline"
                              className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest border-white/5 bg-white/[0.02] hover:bg-[#c9a96e] hover:text-black hover:border-[#c9a96e] transition-all shadow-lg"
                              onClick={() => { setQuery(name); analyzeIngredient(name); }}
                            >
                              <Beaker size={14} className="mr-3 opacity-40" />
                              {name}
                            </Button>
                          ))}
                        </div>
                     </div>
                  </div>

                  {/* Analysis Result Display */}
                  <div className="relative min-h-[400px]">
                     <AnimatePresence mode="wait">
                       {isAnalyzing ? (
                         <motion.div
                           key="loading"
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           className="h-full flex flex-col items-center justify-center space-y-10"
                         >
                           <div className="relative">
                             <Loader2 className="w-20 h-20 text-[#c9a96e] animate-spin opacity-20" />
                             <div className="absolute inset-0 flex items-center justify-center">
                                <Beaker size={40} className="text-[#c9a96e] animate-pulse" />
                             </div>
                             <motion.div
                               className="absolute inset-0 rounded-[2rem] border border-[#c9a96e]"
                               animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.1, 0.5] }}
                               transition={{ duration: 2, repeat: Infinity }}
                             />
                           </div>
                           <div className="text-center space-y-3">
                             <h3 className="text-2xl font-black text-white uppercase italic tracking-[0.1em]">Decoding Molecule</h3>
                             <p className="text-[#c9a96e] font-black uppercase tracking-[0.3em] text-[10px] animate-pulse italic">Sequencing biochemical profile ✨</p>
                           </div>
                         </motion.div>
                       ) : analysis ? (
                         <motion.div
                           key="result"
                           initial={{ opacity: 0, scale: 0.95 }}
                           animate={{ opacity: 1, scale: 1 }}
                           className="h-full text-left"
                         >
                           <div className="space-y-10">
                              <div className="flex items-center justify-between border-b border-white/5 pb-8">
                                 <div className="space-y-3">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/20 text-[9px] font-black uppercase tracking-widest leading-none">
                                       {analysis.category}
                                    </div>
                                    <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">{analysis.name}</h2>
                                 </div>
                                 <div className="w-20 h-20 rounded-3xl bg-black border border-white/10 flex items-center justify-center text-[#c9a96e] shadow-2xl shrink-0 group-hover:scale-110 transition-transform">
                                    <Sparkles size={32} />
                                 </div>
                              </div>

                              <p className="text-xl font-medium leading-relaxed italic text-white/50 border-l border-white/10 pl-6">
                                 "{analysis.description}"
                              </p>

                              <div className="grid grid-cols-2 gap-10">
                                 <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                       <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Efficacy Rating</span>
                                       <span className="text-2xl font-black text-emerald-400 italic">{analysis.efficacy_rating}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden border border-white/10">
                                       <motion.div initial={{ width: 0 }} animate={{ width: `${analysis.efficacy_rating}%` }} className="h-full bg-emerald-400" transition={{ duration: 1 }} />
                                    </div>
                                 </div>
                                 <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                       <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Safety Threshold</span>
                                       <span className="text-2xl font-black text-[#c9a96e] italic">{analysis.safety_rating}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden border border-white/10">
                                       <motion.div initial={{ width: 0 }} animate={{ width: `${analysis.safety_rating}%` }} className="h-full bg-[#c9a96e]" transition={{ duration: 1 }} />
                                    </div>
                                 </div>
                              </div>

                              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                                 <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center gap-3">
                                       <Heart size={18} className="text-emerald-400" /> Synergy
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                       {analysis.best_paired_with?.map((p: string) => (
                                          <Badge key={p} variant="outline" className="text-emerald-400 border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-[9px] font-black uppercase tracking-widest">
                                             + {p}
                                          </Badge>
                                       ))}
                                    </div>
                                 </div>
                                 <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center gap-3">
                                       <AlertTriangle size={18} className="text-red-400" /> Conflict
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                       {analysis.avoid_with?.map((a: string) => (
                                          <Badge key={a} variant="outline" className="text-red-400 border-red-400/20 bg-red-400/5 px-3 py-1 text-[9px] font-black uppercase tracking-widest">
                                             ✕ {a}
                                          </Badge>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                           </div>
                         </motion.div>
                       ) : (
                         <div className="h-full flex flex-col items-center justify-center text-center space-y-10 p-12 lg:p-20 border-2 border-dashed border-white/5 rounded-[3rem] bg-black/40 group hover:bg-black/60 transition-all shadow-inner">
                            <div className="w-32 h-32 rounded-[2.5rem] border border-white/5 flex items-center justify-center text-white/5 shadow-2xl relative">
                               <Beaker size={64} className="opacity-20" />
                               <div className="absolute inset-0 bg-white/[0.01] blur-xl rounded-full" />
                            </div>
                            <div className="space-y-4">
                               <h3 className="text-2xl font-black text-white/20 uppercase italic tracking-tight">Molecular Archetype Hub</h3>
                               <p className="text-sm font-black uppercase tracking-widest text-white/10 leading-relaxed max-w-xs mx-auto">
                                  Initiate an AI-powered biochemical analysis.
                               </p>
                            </div>
                         </div>
                       )}
                     </AnimatePresence>
                  </div>
               </div>
            </Card>
        </div>

        {analysis && !isAnalyzing && (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
           >
              {analysis.fun_fact && (
                <Card className="border-white/10 bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] shadow-2xl overflow-hidden relative group hover:bg-white/[0.05] transition-all">
                  <div className="absolute top-0 right-0 p-8 transform rotate-12 opacity-10 group-hover:rotate-0 transition-transform">
                    <Sparkles size={60} className="text-[#c9a96e]" />
                  </div>
                  <CardContent className="p-10 space-y-4 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c9a96e] opacity-40 block leading-none mb-2">Molecular Insight</span>
                    <p className="text-xl font-medium leading-relaxed text-white/80 italic border-l border-[#c9a96e]/20 pl-6">"{analysis.fun_fact}"</p>
                  </CardContent>
                </Card>
              )}
              {analysis.personalized_tip && (
                <Card className="border-white/10 bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] shadow-2xl overflow-hidden relative group hover:bg-white/[0.05] transition-all">
                   <div className="absolute top-0 right-0 p-8 transform -rotate-12 opacity-10 group-hover:rotate-0 transition-transform">
                    <Zap size={60} className="text-[#c9a96e]" />
                  </div>
                  <CardContent className="p-10 space-y-4 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c9a96e] opacity-40 block leading-none mb-2">AI Strategic Tip</span>
                    <p className="text-xl font-medium leading-relaxed text-white/80 italic border-l border-[#c9a96e]/20 pl-6">"{analysis.personalized_tip}"</p>
                  </CardContent>
                </Card>
              )}
              
              <div className="md:col-span-2">
                 <Button variant="flagship" className="w-full h-20 shadow-2xl shadow-[#c9a96e]/10" asChild>
                    <Link href="/consultant">
                      Consult AI Designer About {analysis.name} <ChevronRight className="ml-4" />
                    </Link>
                 </Button>
              </div>
           </motion.div>
        )}
      </div>
    </div>
  );
}
