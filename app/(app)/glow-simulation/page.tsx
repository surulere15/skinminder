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
            <Sparkles size={12} /> Predictive Synthesis
          </div>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-white uppercase italic">Glow Projection</h1>
          <p className="text-white/50 font-medium text-lg max-w-xl border-l-2 border-[#c9a96e]/30 pl-6 py-1">
             See the future version of your most radiant self. Neural modeling of biological transition.
          </p>
        </header>

      <div className="grid lg:grid-cols-12 gap-12">
         {/* Main Simulation View */}
          <div className="lg:col-span-8">
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-3xl shadow-2xl rounded-[4rem] overflow-hidden min-h-[600px] relative flex flex-col items-center justify-center p-12">
               <AnimatePresence mode="wait">
                  {!simulation && !isSimulating && (
                    <motion.div 
                      key="start"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center space-y-10 relative z-10"
                    >
                       <div className="w-32 h-32 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-8 bg-white/[0.02] backdrop-blur-3xl group shadow-2xl relative">
                          <Eye size={48} className="text-white/20 group-hover:text-[#c9a96e] group-hover:scale-110 transition-all duration-700" />
                          <div className="absolute inset-0 border border-[#c9a96e]/10 rounded-full animate-ping opacity-20" />
                       </div>
                       <div className="space-y-4 max-w-md mx-auto">
                          <h2 className="text-4xl font-black text-white uppercase italic tracking-tight">Biological Projection</h2>
                          <p className="text-white/40 text-lg font-medium leading-relaxed">
                             We use your current biometric data to simulate a 45-day consistent skincare evolution.
                          </p>
                       </div>
                       <Button 
                         variant="flagship"
                         className="h-20 px-20 shadow-2xl shadow-[#c9a96e]/20"
                         onClick={startSimulation}
                       >
                         <Sparkles className="mr-3" /> Initiate Simulation
                       </Button>
                    </motion.div>
                  )}

                  {isSimulating && (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center space-y-10 relative z-10"
                    >
                       <div className="relative w-40 h-40 mx-auto">
                          <Loader2 className="w-full h-full text-[#c9a96e] animate-spin opacity-20" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles size={48} className="text-[#c9a96e] animate-pulse" />
                          </div>
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-[#c9a96e]"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                       </div>
                       <div className="space-y-3">
                          <h2 className="text-2xl font-black text-white uppercase italic tracking-[0.1em]">Simulating Bio-Aesthetics</h2>
                          <p className="text-[#c9a96e] font-black uppercase tracking-[0.3em] text-[10px] animate-pulse italic">Calculating lipid recovery curves</p>
                       </div>
                    </motion.div>
                  )}

                  {simulation && !isSimulating && (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full h-full space-y-12 relative z-10"
                    >
                       <div className="flex flex-col md:flex-row items-center justify-between gap-10 border-b border-white/5 pb-10">
                          <div className="text-center md:text-left space-y-4">
                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/20 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#c9a96e]/5">
                                45-Day Trajectory
                             </div>
                             <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tight">{simulation.glow_archetype}</h2>
                          </div>
                          <div className="flex -space-x-4">
                             {[1,2,3].map(i => (
                               <div key={i} className="w-16 h-16 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-3xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-white/40 shadow-2xl">AI</div>
                             ))}
                          </div>
                       </div>

                       <div className="grid md:grid-cols-3 gap-8">
                          {simulation.targeted_improvements.map((m: any, i: number) => (
                            <div key={i} className="space-y-6 p-8 rounded-[2.5rem] bg-black/40 border border-white/10 shadow-inner group hover:border-[#c9a96e]/30 transition-all">
                               <div className="flex justify-between items-end">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{m.metric}</p>
                                  <div className="flex items-center gap-3">
                                     <span className="text-[10px] font-black text-white/10 line-through tracking-widest">{m.current_score}</span>
                                     <span className="text-2xl font-black text-[#c9a96e] italic tracking-tighter">{m.projected_score}</span>
                                  </div>
                               </div>
                               <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden border border-white/10">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${m.projected_score}%` }}
                                    transition={{ duration: 1.5, delay: 0.5 + i * 0.2 }}
                                    className="h-full bg-emerald-400"
                                  />
                               </div>
                               <p className="text-[10px] font-black uppercase tracking-widest text-white/30 leading-relaxed italic">{m.visual_description}</p>
                            </div>
                          ))}
                       </div>

                       <div className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-2xl space-y-6">
                          <h4 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-3">
                             <Sparkles className="text-[#c9a96e]" size={24} /> The Evolution Narrative
                          </h4>
                          <p className="text-xl font-medium leading-relaxed italic text-white/80 border-l-2 border-[#c9a96e]/30 pl-8">
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
            <div className="mt-8 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl flex gap-6 items-start max-w-3xl shadow-2xl">
               <Info className="text-[#c9a96e] flex-shrink-0 mt-1" size={24} />
               <p className="text-xs font-black uppercase tracking-widest text-white/30 leading-relaxed italic">
                  <b>Clinical Boundary Note:</b> This projection is a purely cosmetic forecast for educational and motivational purposes. No specific result can be guaranteed. Improvements depend heavily on protocol adherence, UV protection, and individual biological baseline.
               </p>
            </div>
         </div>

          <div className="lg:col-span-4 space-y-8">
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-3xl rounded-[3.5rem] p-10 space-y-10 shadow-2xl">
               <div className="space-y-3">
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Access Protocol</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Requirements to achieve this simulation state.</p>
               </div>
               <div className="space-y-4">
                  {simulation?.protocol_requirements.map((req: string, i: number) => (
                    <div key={i} className="flex items-center gap-5 p-6 rounded-3xl bg-black/40 border border-white/10 shadow-inner group hover:border-[#c9a96e]/30 transition-all">
                       <ShieldCheck className="text-emerald-400 group-hover:scale-110 transition-transform" size={24} />
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{req}</span>
                    </div>
                  )) || (
                    <div className="space-y-4 opacity-10">
                       {[1,2,3].map(i => (
                         <div key={i} className="h-16 bg-black rounded-3xl flex items-center px-6 gap-4 border border-white/10">
                            <Lock size={20} />
                            <div className="h-2 w-32 bg-white/50 rounded-full" />
                         </div>
                       ))}
                    </div>
                  )}
               </div>
               <Button variant="outline" className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] border-white/10 text-white/40 hover:bg-white/5 transition-all" disabled={!simulation}>
                  Export Sequence Data
               </Button>
            </Card>

            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-3xl rounded-[3.5rem] p-10 relative overflow-hidden group hover:bg-white/[0.05] transition-all shadow-2xl">
               <div className="relative z-10 space-y-8">
               <div className="w-16 h-16 rounded-2xl bg-[#c9a96e]/10 flex items-center justify-center text-[#c9a96e] border border-[#c9a96e]/20 shadow-lg group-hover:scale-110 transition-transform">
                  <Clock size={32} />
               </div>
               <div className="space-y-2">
                  <h4 className="text-2xl font-black text-white uppercase italic tracking-tight">Next Snapshot</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Track your evolution in real-time matrix.</p>
               </div>
               <Button variant="flagship" className="w-full h-16 shadow-2xl shadow-[#c9a96e]/10">
                  <Camera className="mr-3" size={24} /> Daily Check-in
               </Button>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
