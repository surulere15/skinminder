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
  const [isLoading, setIsLoading] = useState(false);
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
    <div className="p-8 lg:p-12 space-y-12 max-w-7xl mx-auto bg-background min-h-screen text-content-primary">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-4 text-left">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-skin-muted/5 text-skin-dark text-[10px] font-black uppercase tracking-widest border border-skin-border/10">
            <Beaker size={14} className="text-skin-violet" /> Molecular Intelligence
          </div>
          <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight text-content-primary">Ingredient Decoder</h1>
          <p className="text-content-secondary font-medium text-lg max-w-2xl opacity-90 leading-relaxed">
            Discover the high-fidelity science behind your skincare. Our AI analyzes molecular structures for efficacy, safety, and biological compatibility with your Skin DNA.
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Search Column */}
        <div className="lg:col-span-5 space-y-10 text-left">
           <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-skin-muted w-7 h-7 group-focus-within:text-skin-violet transition-colors" />
              <Input 
                placeholder="Search e.g. 'Retinol'..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-24 pl-20 pr-8 rounded-[2.5rem] text-2xl font-semibold border-none shadow-2xl bg-skin-surface focus-visible:ring-2 focus-visible:ring-primary/20 transition-all placeholder:text-content-muted/40"
              />
              {isAnalyzing && (
                <div className="absolute right-8 top-1/2 -translate-y-1/2">
                   <Loader2 className="animate-spin text-skin-violet w-6 h-6" />
                </div>
              )}
           </form>

           <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-skin-muted ml-6 opacity-60 flex items-center gap-2">
                <Sparkles size={14} className="text-skin-gold" /> Popular Intelligence
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {commonIngredients.map(name => (
                  <Button 
                    key={name} 
                    variant="clinical-ghost" 
                    className="justify-start h-16 rounded-2xl font-semibold bg-skin-surface border border-white/5" 
                    onClick={() => { setQuery(name); analyzeIngredient(name); }}
                  >
                    <Beaker size={18} className="mr-3 text-primary opacity-60" />
                    {name}
                  </Button>
                ))}
              </div>
           </div>
        </div>

        {/* Analysis Column */}
        <div className="lg:col-span-7">
           <AnimatePresence mode="wait">
             {isAnalyzing ? (
               <motion.div
                 key="loading"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="flex flex-col items-center justify-center py-40 space-y-8"
               >
                 <div className="w-24 h-24 rounded-[2rem] bg-skin-violet/5 border border-skin-violet/10 flex items-center justify-center shadow-inner relative">
                    <Loader2 className="w-10 h-10 text-skin-violet animate-spin" />
                    <div className="absolute inset-0 border-2 border-skin-violet/20 rounded-[2rem] animate-ping opacity-20" />
                 </div>
                 <div className="text-center space-y-3">
                   <h3 className="text-3xl font-outfit font-black text-skin-dark">Decoding Molecule...</h3>
                   <p className="text-skin-muted font-bold uppercase tracking-widest text-[10px] opacity-80">Sequencing biochemical profile ✨</p>
                 </div>
               </motion.div>
             ) : analysis ? (
               <motion.div
                 key="result"
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -30 }}
                 className="space-y-8 text-left"
               >
                 {/* Main Analysis Card */}
                 <Card className="border-none shadow-[0_40px_100px_rgba(0,0,0,0.12)] rounded-[3.5rem] overflow-hidden bg-white/60 border border-skin-border/10 backdrop-blur-xl group">
                    <CardHeader className="p-12 pb-0">
                       <div className="flex flex-wrap items-center gap-4 mb-8">
                          <div className="w-16 h-16 rounded-2xl bg-skin-violet/5 flex items-center justify-center text-skin-violet border border-skin-violet/10 group-hover:scale-110 transition-transform">
                             <Beaker size={32} />
                          </div>
                          <Badge className="bg-skin-muted/5 text-skin-dark border-skin-border/10 font-black text-[10px] uppercase tracking-widest px-4 py-1.5 shadow-sm">
                            {analysis.category}
                          </Badge>
                          {analysis.time_of_day && (
                            <Badge variant="secondary" className="font-black text-[10px] uppercase tracking-widest flex items-center gap-2 bg-skin-pearl border-skin-border/10 text-skin-dark px-4 py-1.5">
                              {analysis.time_of_day === 'PM' ? <Moon size={14} className="text-skin-violet" /> : analysis.time_of_day === 'AM' ? <Sun size={14} className="text-skin-gold" /> : <Clock size={14} />}
                              {analysis.time_of_day} Application
                            </Badge>
                          )}
                       </div>
                       <CardTitle className="text-5xl font-black font-outfit text-skin-dark tracking-tight leading-none">{analysis.name}</CardTitle>
                       {analysis.optimal_concentration && (
                         <p className="text-sm font-black text-skin-violet mt-3 uppercase tracking-widest opacity-60">
                           Optimal Concentration: {analysis.optimal_concentration}
                         </p>
                       )}
                    </CardHeader>
                    <CardContent className="p-12 space-y-12">
                       {/* Description */}
                       <p className="text-2xl font-medium leading-relaxed text-skin-dark/90">
                          {analysis.description}
                       </p>

                       {/* Scores */}
                       <div className="grid grid-cols-2 gap-10">
                         <div className="space-y-4">
                           <div className="flex items-center justify-between">
                             <span className="text-[10px] font-black uppercase tracking-widest text-skin-muted opacity-80">Biological Efficacy</span>
                             <span className="text-3xl font-outfit font-black text-skin-glow drop-shadow-sm">{analysis.efficacy_rating}%</span>
                           </div>
                           <Progress value={analysis.efficacy_rating} className="h-4 rounded-full bg-skin-muted/10 shadow-inner overflow-hidden" />
                         </div>
                         <div className="space-y-4">
                           <div className="flex items-center justify-between">
                             <span className="text-[10px] font-black uppercase tracking-widest text-skin-muted opacity-80">Safety Tolerance</span>
                             <span className="text-3xl font-outfit font-black text-skin-violet drop-shadow-sm">{analysis.safety_rating}%</span>
                           </div>
                           <Progress value={analysis.safety_rating} className="h-4 rounded-full bg-skin-muted/10 shadow-inner overflow-hidden" />
                         </div>
                       </div>

                       {/* Mechanism */}
                       {analysis.mechanism && (
                         <div className="p-8 rounded-[2.5rem] bg-skin-muted/5 border border-skin-border/5 space-y-4 shadow-inner">
                           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-skin-muted flex items-center gap-3">
                             <Zap size={16} className="text-skin-gold" /> Mechanism of Action
                           </h4>
                           <p className="text-base font-bold text-skin-dark/80 leading-relaxed italic">
                             {analysis.mechanism}
                           </p>
                         </div>
                       )}

                       {/* Benefits */}
                       <div className="space-y-6">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-skin-muted opacity-60 px-2">Clinical Benefits For You</h4>
                          <div className="grid grid-cols-2 gap-4">
                             {analysis.benefits?.map((b: string) => (
                               <div key={b} className="flex items-center gap-4 font-black text-sm p-5 rounded-[2rem] bg-skin-glow/5 text-skin-glow border border-skin-glow/10 shadow-sm">
                                  <CheckCircle2 size={20} /> {b}
                               </div>
                             ))}
                          </div>
                       </div>

                       {/* Pairing Grid */}
                       <div className="grid grid-cols-2 gap-10 border-t border-skin-border/10 pt-10">
                         <div className="space-y-6">
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-skin-muted flex items-center gap-3 opacity-60">
                             <Heart size={18} className="text-skin-rose" /> High Synergy
                           </h4>
                           <div className="space-y-3">
                             {analysis.best_paired_with?.map((p: string) => (
                               <button 
                                 key={p} 
                                 onClick={() => { setQuery(p); analyzeIngredient(p); }} 
                                 className="flex items-center justify-between w-full px-5 py-3 rounded-2xl bg-skin-glow/5 text-skin-glow text-sm font-black hover:bg-skin-glow/10 transition-all border border-skin-glow/10 group/btn"
                               >
                                 + {p}
                                 <ArrowRight size={14} className="opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                               </button>
                             ))}
                           </div>
                         </div>
                         {analysis.avoid_with?.length > 0 && (
                           <div className="space-y-6">
                             <h4 className="text-[10px] font-black uppercase tracking-widest text-skin-muted flex items-center gap-3 opacity-60">
                               <AlertTriangle size={18} className="text-skin-gold" /> Critical Avoidance
                             </h4>
                             <div className="space-y-3">
                               {analysis.avoid_with?.map((a: string) => (
                                 <div key={a} className="px-5 py-3 rounded-2xl bg-skin-rose/5 text-skin-rose text-sm font-black border border-skin-rose/10 shadow-sm">
                                   ✕ {a}
                                 </div>
                               ))}
                             </div>
                           </div>
                         )}
                       </div>

                       {/* Skin Types Suited */}
                       <div className="space-y-4 pt-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-skin-muted opacity-60 px-2">Suited Biological Archetypes</h4>
                          <div className="flex flex-wrap gap-3">
                            {analysis.skin_types_suited?.map((t: string) => (
                              <span key={t} className="px-5 py-2 rounded-full bg-skin-pearl border border-skin-border/10 text-skin-dark text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">{t}</span>
                            ))}
                          </div>
                       </div>
                    </CardContent>
                 </Card>

                 {/* Tips Section */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analysis.fun_fact && (
                      <Card className="border-none bg-skin-violet/5 rounded-[3rem] shadow-xl shadow-black/5 border border-skin-violet/10 group hover:bg-skin-violet/10 transition-all duration-500 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 transform rotate-12 opacity-10 group-hover:rotate-0 transition-transform">
                          <Sparkles size={60} className="text-skin-violet" />
                        </div>
                        <CardContent className="p-8 space-y-4 relative z-10">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-skin-violet opacity-60 block">Molecular Insight</span>
                          <p className="text-lg font-bold leading-relaxed text-skin-dark">{analysis.fun_fact}</p>
                        </CardContent>
                      </Card>
                    )}
                    {analysis.personalized_tip && (
                      <Card className="border-none bg-skin-glow/5 rounded-[3rem] shadow-xl shadow-black/5 border border-skin-glow/10 group hover:bg-skin-glow/10 transition-all duration-500 overflow-hidden relative">
                         <div className="absolute top-0 right-0 p-8 transform -rotate-12 opacity-10 group-hover:rotate-0 transition-transform">
                          <Zap size={60} className="text-skin-glow" />
                        </div>
                        <CardContent className="p-8 space-y-4 relative z-10">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-skin-glow opacity-60 block">AI Strategic Tip</span>
                          <p className="text-lg font-bold leading-relaxed text-skin-dark">{analysis.personalized_tip}</p>
                        </CardContent>
                      </Card>
                    )}
                 </div>

                 <Button variant="premium" className="w-full h-20 rounded-[3rem] text-xl font-outfit font-black shadow-2xl shadow-skin-violet/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-4 group" asChild>
                    <Link href="/consultant">
                      Consult AI Designer About {analysis.name} <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </Link>
                 </Button>
               </motion.div>
             ) : (
               <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center space-y-10 p-20 border-4 border-dashed border-skin-border/10 rounded-[4rem] bg-white/40 group hover:bg-white/60 transition-all">
                  <div className="w-40 h-40 rounded-[3rem] border-[12px] border-skin-muted/10 flex items-center justify-center text-skin-muted shadow-inner group-hover:scale-110 transition-transform">
                     <Beaker size={64} className="opacity-20" />
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-4xl font-outfit font-black tracking-tight text-skin-dark opacity-50">Molecular Discovery</h3>
                     <p className="text-xl font-bold max-w-sm mx-auto text-skin-muted opacity-70 leading-relaxed">
                        Search or select a molecule to initiate an AI-powered biochemical analysis.
                     </p>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full bg-skin-violet/20 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
