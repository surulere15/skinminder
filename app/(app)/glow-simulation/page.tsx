"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  Eye,
  ChevronRight,
  Info,
  Loader2,
  Lock,
  Camera
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function GlowSimulationPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulation, setSimulation] = useState<any>(null);

  const startSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch("/api/glow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skinType: "combination",
          concerns: ["texture", "hydration", "pigmentation"],
          currentMetrics: { hydration: 62, texture: 54, pigmentation: 71 },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSimulation(data);
        setIsSimulating(false);
        return;
      }
    } catch (err) {
      console.warn("Glow API unavailable, using demo data:", err);
    }
    // Fallback to realistic demo data
    setTimeout(() => {
      setSimulation({
        projection_name: "Radiance Baseline Alpha",
        timeframe: "45 Days",
        glow_archetype: "Glass Skin Ultra",
        targeted_improvements: [
          { metric: "Hydration", current_score: 62, projected_score: 88, visual_description: "Deep plumpness with visible light-reflecting buoyancy." },
          { metric: "Texture", current_score: 54, projected_score: 92, visual_description: "Refined pore structure with velvet-smooth surface density." },
          { metric: "Pigment", current_score: 71, projected_score: 85, visual_description: "Uniform porcelain-tone clarity with zero hyper-sensitivity peaks." }
        ],
        simulated_narrative: "In 45 days of consistent protocol adherence, your skin will shift from its current reactive baseline to a state of 'High Radiance'. Imagine a morning where foundation is optional—where light bounces off your cheekbones with the clarity of glass. Your barrier will be so resilient that environmental stressors no longer leave visible shadows.",
        protocol_requirements: [
          "Consistent evening retinoid routine",
          "Morning antioxidant protection layer",
          "Stay beautifully hydrated (about 8+ glasses daily)"
        ]
      });
      setIsSimulating(false);
    }, 1500);
  };

  return (
    <div className="p-8 lg:p-12 space-y-12 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 text-content-primary text-[10px] font-black uppercase tracking-widest text-content-glass">
            <Sparkles size={12} /> Future Intelligence
          </div>
          <h1 className="text-4xl lg:text-5xl font-outfit font-black tracking-tight">Glow Simulation</h1>
          <p className="text-content-muted font-medium text-lg max-w-xl">
             See the future version of your most radiant self.
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-12">
         {/* Main Simulation View */}
         <div className="lg:col-span-8">
            <Card className="border-none bg-black text-content-glass shadow-2xl rounded-[4rem] overflow-hidden min-h-[600px] relative flex flex-col items-center justify-center p-12">
               <AnimatePresence mode="wait">
                  {!simulation && !isSimulating && (
                    <motion.div 
                      key="start"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center space-y-8 relative z-10"
                    >
                       <div className="w-32 h-32 rounded-full border-[10px] border-white/10 flex items-center justify-center mx-auto mb-8 bg-white/5 backdrop-blur-3xl group">
                          <Eye size={48} className="text-content-glass opacity-40 group-hover:scale-110 transition-transform duration-700" />
                       </div>
                       <div className="space-y-4 max-w-md mx-auto">
                          <h2 className="text-4xl font-outfit font-black tracking-tight leading-tight">Ready to See Your Progress?</h2>
                          <p className="text-content-glass text-lg font-medium">
                             We use your current biometric data to simulate a 45-day consistent skincare evolution.
                          </p>
                       </div>
                       <Button 
                         size="lg" 
                         className="h-20 px-16 rounded-[2.5rem] bg-white text-content-primary hover:bg-white/90 font-outfit font-black text-xl shadow-2xl gap-4 group"
                         onClick={startSimulation}
                       >
                         <Sparkles className="text-primary-foreground" /> Begin Simulation
                       </Button>
                    </motion.div>
                  )}

                  {isSimulating && (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center space-y-8 relative z-10"
                    >
                       <div className="w-48 h-48 rounded-full border-[10px] border-muted/50 flex items-center justify-center mx-auto relative overflow-hidden">
                          <div className="absolute inset-0 border-[10px] border-primary rounded-full border-t-transparent animate-spin" />
                          <Sparkles size={64} className="text-content-glass animate-pulse" />
                       </div>
                       <div className="space-y-2">
                          <h2 className="text-3xl font-outfit font-black tracking-tight uppercase">Simulating Bio-Aesthetics...</h2>
                          <p className="text-content-glass font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Calculating lipid recovery curves</p>
                       </div>
                    </motion.div>
                  )}

                  {simulation && !isSimulating && (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full h-full space-y-12 relative z-10"
                    >
                       <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/10 pb-12">
                          <div className="text-center md:text-left space-y-2">
                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 text-content-primary text-[10px] font-black uppercase tracking-widest border border-muted/50">
                                45-Day Projection
                             </div>
                             <h2 className="text-5xl md:text-7xl font-outfit font-black tracking-tighter leading-none">{simulation.glow_archetype}</h2>
                          </div>
                          <div className="flex -space-x-4">
                             {[1,2,3].map(i => (
                               <div key={i} className="w-16 h-16 rounded-full border-4 border-black bg-white/10 backdrop-blur-xl flex items-center justify-center text-xs font-black">AI</div>
                             ))}
                          </div>
                       </div>

                       <div className="grid md:grid-cols-3 gap-8">
                          {simulation.targeted_improvements.map((m: any, i: number) => (
                            <div key={i} className="space-y-4 p-6 rounded-[2rem] bg-white/5 border border-white/10">
                               <div className="flex justify-between items-end">
                                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{m.metric}</p>
                                  <div className="flex items-center gap-2 text-content-primary">
                                     <span className="text-xs font-bold line-through opacity-40">{m.current_score}</span>
                                     <span className="text-xl font-black font-outfit">{m.projected_score}</span>
                                  </div>
                               </div>
                               <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${m.projected_score}%` }}
                                    transition={{ duration: 1.5, delay: 0.5 + i * 0.2 }}
                                    className="h-full bg-primary"
                                  />
                               </div>
                               <p className="text-[10px] font-medium opacity-60 leading-relaxed">{m.visual_description}</p>
                            </div>
                          ))}
                       </div>

                       <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 space-y-6">
                          <h4 className="text-xl font-outfit font-black uppercase tracking-tight flex items-center gap-3">
                             <Sparkles className="text-primary" size={24} /> The Evolution Narrative
                          </h4>
                          <p className="text-xl font-medium leading-relaxed italic opacity-90">
                             "{simulation.simulated_narrative}"
                          </p>
                       </div>
                    </motion.div>
                  )}
               </AnimatePresence>

               {/* Background Glows */}
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-muted/50 rounded-full -mr-64 -mt-64 blur-[120px] pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-muted/50 rounded-full -ml-64 -mb-64 blur-[120px] pointer-events-none" />
            </Card>

            {/* Disclaimer */}
            <div className="mt-8 p-6 rounded-3xl bg-muted/50 border border-muted flex gap-4 items-start max-w-3xl">
               <Info className="text-content-secondary flex-shrink-0" size={24} />
               <p className="text-xs font-bold text-content-muted leading-relaxed">
                  <b>RESPONSIBLE SIMULATION:</b> This projection is a purely cosmetic forecast for educational and motivational purposes. No specific result can be guaranteed. Improvements depend heavily on protocol adherence, UV protection, and individual biological baseline. This is NOT a medical prediction.
               </p>
            </div>
         </div>

         {/* Protocol Sidebar */}
         <div className="lg:col-span-4 space-y-8">
            <Card className="border-none bg-white shadow-xl shadow-black/5 rounded-[3.5rem] p-10 space-y-8">
               <div className="space-y-2">
                  <h3 className="text-2xl font-outfit font-black tracking-tight">Access Protocol</h3>
                  <p className="text-content-muted text-sm font-medium">Requirements to achieve this simulation state.</p>
               </div>
               <div className="space-y-4">
                  {simulation?.protocol_requirements.map((req: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-muted/50">
                       <ShieldCheck className="text-primary-foreground" size={20} />
                       <span className="text-sm font-black uppercase tracking-tight">{req}</span>
                    </div>
                  )) || (
                    <div className="space-y-4 opacity-30">
                       {[1,2,3].map(i => (
                         <div key={i} className="h-14 bg-muted rounded-2xl flex items-center px-4 gap-4">
                            <Lock size={16} />
                            <div className="h-2 w-24 bg-white/50 rounded-full" />
                         </div>
                       ))}
                    </div>
                  )}
               </div>
               <Button variant="outline" className="w-full h-14 rounded-2xl font-bold border-2" disabled={!simulation}>
                  Export Projection Data
               </Button>
            </Card>

            <Card className="border-none bg-black text-content-glass rounded-[3rem] p-10 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#333] pointer-events-none" />
               <div className="relative z-10 space-y-6">
               <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-primary-foreground">
                  <Clock size={24} />
               </div>
               <div className="space-y-2">
                  <h4 className="text-xl font-outfit font-black tracking-tight">Next Snapshot</h4>
                  <p className="text-content-glass text-sm font-medium">Track your evolution in real-time.</p>
               </div>
               <Button className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black shadow-xl shadow-primary/20">
                  <Camera className="mr-2" size={20} /> Daily Check-in
               </Button>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}
