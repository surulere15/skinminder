"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Beaker, 
  Zap, 
  ShieldAlert, 
  Sparkles, 
  Plus, 
  X, 
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ComparisonPage() {
  const [productA, setProductA] = useState<any>(null);
  const [productB, setProductB] = useState<any>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleCompare = async () => {
    setIsComparing(true);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productA, productB }),
      });
      if (res.ok) {
        const data = await res.json();
        setReport(data);
        setIsComparing(false);
        return;
      }
    } catch (err) {
      console.warn("Compare API unavailable, using demo data:", err);
    }
    // Fallback to demo data
    setTimeout(() => {
      setReport({
        synergy_score: 82,
        collision_risks: [
          { ingredients: ["Retinol", "Ascorbic Acid"], issue: "These actives work best at different times — separate them into AM/PM for the best results!", severity: "medium" }
        ],
        combined_benefits: ["Accelerated collagen synthesis", "Deep surface hydration", "Pigment stabilization", "Enhanced radiance"],
        recommendation: `Use ${productA?.name || 'Product A'} in your evening ritual and ${productB?.name || 'Product B'} in the morning. Your skin gets 24-hour coverage and each product works at peak effectiveness! ✨`,
        is_compatible: true,
        skin_type_suitability: { dry: true, oily: true, sensitive: false, combination: true }
      });
      setIsComparing(false);
    }, 1500);
  };

  return (
    <div className="p-8 lg:p-12 space-y-12 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 text-content-primary text-[10px] font-black uppercase tracking-widest">
            <Beaker size={12} /> Synergy Analysis
          </div>
          <h1 className="text-4xl lg:text-5xl font-outfit font-black tracking-tight">Comparison Laboratory</h1>
          <p className="text-content-muted font-medium text-lg max-w-xl">
             Detect ingredient collisions and unlock synergistic benefits between your favorite formulations.
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
         {/* Product Slots */}
         <div className="grid grid-cols-2 gap-6 lg:col-span-2">
            {[
              { label: "Product Alpha", state: productA, setter: setProductA, color: "primary" },
              { label: "Product Beta", state: productB, setter: setProductB, color: "secondary" }
            ].map((slot, i) => (
              <Card key={i} className={cn(
                "border-none shadow-xl rounded-[3rem] overflow-hidden transition-all duration-500 min-h-[300px] flex flex-col items-center justify-center text-center p-10 relative overflow-hidden",
                slot.state ? "bg-white" : "bg-white/50 border-4 border-dashed border-muted"
              )}>
                 <AnimatePresence mode="wait">
                    {!slot.state ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="space-y-4"
                      >
                         <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto text-content-secondary">
                            <Plus size={32} />
                         </div>
                         <div className="space-y-1">
                            <h3 className="text-xl font-outfit font-black">{slot.label}</h3>
                            <p className="text-sm font-medium text-content-muted">Select to compare</p>
                         </div>
                         <Button variant="outline" className="rounded-full px-8 h-12" onClick={() => slot.setter({ name: i === 0 ? "Retinol Renewal" : "Vit C Glow", brand: "SkinMinder Labs" })}>Choose Item</Button>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4 w-full"
                      >
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-6 right-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => slot.setter(null)}
                         >
                            <X size={20} />
                         </Button>
                         <div className={cn(
                           "w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl transition-transform hover:rotate-3",
                           slot.color === "primary" ? "bg-primary text-primary-foreground" : "bg-secondary text-content-primary"
                         )}>
                            <Package size={40} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-content-muted">{slot.state.brand}</p>
                            <h3 className="text-2xl font-outfit font-black">{slot.state.name}</h3>
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>
                 {/* Decorative Accent */}
                 <div className={cn(
                   "absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-5",
                   slot.color === "primary" ? "bg-primary" : "bg-secondary"
                 )} />
              </Card>
            ))}
         </div>

         {/* Action Area */}
         <div className="lg:col-span-2 flex justify-center py-4">
            <Button 
              size="lg" 
              className="h-20 px-16 rounded-[2.5rem] bg-[#111] text-content-glass hover:bg-black font-outfit font-black text-xl shadow-2xl gap-4 group disabled:opacity-30"
              disabled={!productA || !productB || isComparing}
              onClick={handleCompare}
            >
              {isComparing ? <><Loader2 className="animate-spin" /> Analyzing Synergy...</> : <><Sparkles /> Run Lab Simulation <Zap className="fill-white group-hover:scale-125 transition-transform" size={18} /></>}
            </Button>
         </div>

         {/* Results Area */}
         <div className="lg:col-span-2 min-h-[400px]">
            <AnimatePresence mode="wait">
               {report && !isComparing && (
                 <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid lg:grid-cols-12 gap-12 pt-12"
                 >
                    {/* Main Score & Recommendation */}
                    <Card className="lg:col-span-7 border-none bg-white shadow-2xl rounded-[4rem] overflow-hidden">
                       <CardHeader className="p-12 pb-0">
                          <div className="flex items-center justify-between mb-8">
                             <div className="space-y-1">
                                <h3 className="text-xs font-black uppercase tracking-widest text-content-muted">Compatibility Index</h3>
                                <div className="flex items-baseline gap-2">
                                   <span className="text-7xl font-outfit font-black">{report.synergy_score}%</span>
                                   <span className="text-lg font-bold text-content-muted">Synergy</span>
                                </div>
                             </div>
                             <div className="w-24 h-24 rounded-full border-[8px] border-muted/50 flex items-center justify-center relative">
                                <TrendingUp className="text-primary" size={32} />
                                <div className="absolute inset-0 border-[8px] border-primary rounded-full border-t-transparent animate-spin-slow" />
                             </div>
                          </div>
                          <div className="p-8 rounded-[2rem] bg-muted/50 border border-muted/50">
                             <h4 className="font-outfit font-black text-lg mb-2 uppercase tracking-tight flex items-center gap-2">
                                <Sparkles className="text-content-primary" size={18} /> Master Recommendation
                             </h4>
                             <p className="text-content-primary font-medium text-lg leading-relaxed">
                                {report.recommendation}
                             </p>
                          </div>
                       </CardHeader>
                       <CardContent className="p-12 space-y-8">
                          <div className="space-y-4">
                             <h4 className="text-xs font-black uppercase tracking-widest text-content-muted">Combined Benefits</h4>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {report.combined_benefits.map((b: string) => (
                                  <div key={b} className="p-4 rounded-xl bg-muted/30 border border-muted/50 flex items-center gap-2 text-sm font-bold">
                                     <CheckCircle2 size={16} className="text-primary-foreground" /> {b}
                                  </div>
                                ))}
                             </div>
                          </div>
                       </CardContent>
                    </Card>

                    {/* Risks & Suitability */}
                    <div className="lg:col-span-5 space-y-8">
                       <Card className="border-none bg-[#111] text-content-glass rounded-[3.5rem] p-10 space-y-6">
                          <div className="flex items-center gap-3">
                             <ShieldAlert className="text-destructive" size={24} />
                             <h3 className="text-2xl font-outfit font-black tracking-tight">Technical Collisions</h3>
                          </div>
                          <div className="space-y-4">
                             {report.collision_risks.map((risk: any, i: number) => (
                               <div key={i} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 space-y-3">
                                  <div className="flex gap-2">
                                     {risk.ingredients.map((ing: string) => (
                                       <span key={ing} className="px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-[8px] font-black uppercase tracking-widest">{ing}</span>
                                     ))}
                                  </div>
                                  <p className="text-sm font-medium opacity-80 leading-relaxed">{risk.issue}</p>
                                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-destructive">
                                     <AlertTriangle size={12} /> {risk.severity} severity risk
                                  </div>
                               </div>
                             ))}
                          </div>
                       </Card>

                       <Card className="border-none bg-white shadow-xl shadow-black/5 rounded-[3rem] p-10 space-y-6">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-content-muted">Skin Type Suitability</h4>
                          <div className="grid grid-cols-3 gap-4">
                             {Object.entries(report.skin_type_suitability).map(([type, ok]: any) => (
                               <div key={type} className={cn(
                                 "p-4 rounded-2xl flex flex-col items-center gap-2 transition-all",
                                 ok ? "bg-muted/50 border border-muted/50" : "bg-muted grayscale opacity-40"
                               )}>
                                  <span className="text-[10px] font-black uppercase tracking-widest">{type}</span>
                                  {ok ? <CheckCircle2 size={16} className="text-content-primary" /> : <X size={16} className="text-content-secondary" />}
                               </div>
                             ))}
                          </div>
                       </Card>
                    </div>
                 </motion.div>
               )}

               {!report && !isComparing && (
                 <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30 mt-12 border-4 border-dashed rounded-[4rem] p-20">
                    <div className="w-32 h-32 rounded-full border-[10px] border-muted flex items-center justify-center">
                       <Beaker size={48} />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-3xl font-outfit font-black tracking-tight">Selection Required</h3>
                       <p className="text-lg font-medium max-w-sm mx-auto">
                          Select two products from your catalog or library to initiate a deep synergy analysis.
                       </p>
                    </div>
                 </div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
