"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Play, RotateCcw, TrendingUp, FlaskConical, Target, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const simulationData = [
  { week: "Wk 0", hydration: 68, texture: 55 },
  { week: "Wk 2", hydration: 72, texture: 58 },
  { week: "Wk 4", hydration: 78, texture: 65 },
  { week: "Wk 6", hydration: 84, texture: 72 },
  { week: "Wk 8", hydration: 89, texture: 80 },
];

export function RoutineSimulator() {
  const [isSimulating, setIsSimulating] = useState(false);

  return (
    <Card className="bg-skin-surface border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-8 space-y-8 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <FlaskConical size={24} />
             </div>
             <div>
                <h3 className="text-xl font-semibold text-content-primary tracking-tight">Predictive Outcome Simulator</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Biometric Response Forecast</p>
             </div>
          </div>
          <Button 
            variant={isSimulating ? "clinical-ghost" : "clinical"}
            onClick={() => setIsSimulating(!isSimulating)}
            className="h-12 px-8 rounded-2xl transition-all duration-500"
          >
            {isSimulating ? (
              <> <RotateCcw size={18} className="mr-2" /> Reset Model </>
            ) : (
              <> <Play size={18} className="mr-2" /> Run Protocol Simulation </>
            )}
          </Button>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
           <div className="lg:col-span-12 xl:col-span-7">
              <div className="h-[300px] w-full relative">
                 <AnimatePresence mode="wait">
                    {!isSimulating ? (
                       <motion.div 
                         key="idle"
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }}
                         className="absolute inset-0 flex flex-col items-center justify-center bg-background/40 backdrop-blur-sm rounded-2xl border border-white/5 z-10"
                       >
                          <Target size={48} className="text-primary/20 mb-4" />
                          <p className="text-xs font-bold text-content-secondary uppercase tracking-[0.2em]">Ready for simulation</p>
                          <p className="text-[10px] text-content-muted mt-2">Initialize to view predicted biometric shifts</p>
                       </motion.div>
                    ) : null}
                 </AnimatePresence>

                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={simulationData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                       <XAxis 
                         dataKey="week" 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{ fill: '#8C93B5', fontSize: 10, fontWeight: 700 }}
                       />
                       <YAxis hide domain={[0, 100]} />
                       <Tooltip 
                         contentStyle={{ 
                           backgroundColor: '#1A2142', 
                           border: '1px solid rgba(255,255,255,0.05)',
                           borderRadius: '16px'
                         }}
                       />
                       <Line 
                         type="monotone" 
                         dataKey="hydration" 
                         stroke="#6F8BFF" 
                         strokeWidth={4} 
                         dot={{ fill: '#6F8BFF', strokeWidth: 2, r: 4 }}
                         activeDot={{ r: 6, strokeWidth: 0 }}
                         animationDuration={isSimulating ? 2000 : 0}
                       />
                       <Line 
                         type="monotone" 
                         dataKey="texture" 
                         stroke="#3FB68B" 
                         strokeWidth={4} 
                         dot={{ fill: '#3FB68B', strokeWidth: 2, r: 4 }}
                         activeDot={{ r: 6, strokeWidth: 0 }}
                         animationDuration={isSimulating ? 2000 : 0}
                       />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="lg:col-span-12 xl:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-white/2 border border-white/5 space-y-6">
                 <div className="flex items-center justify-between">
                    <p className="text-[11px] font-black uppercase tracking-widest text-content-muted">Predicted 8-Week Delta</p>
                    <div className="flex items-center gap-1.5 text-[#3FB68B]">
                       <TrendingUp size={16} />
                       <span className="text-sm font-black tracking-tight">+31.2% Efficiency</span>
                    </div>
                 </div>

                 <div className="space-y-4">
                    {[
                      { label: "Optimal Hydration", wk4: "+15%", wk8: "+31%" },
                      { label: "Textural Refinement", wk4: "+18%", wk8: "+45%" },
                      { label: "Barrier Resilience", wk4: "+12%", wk8: "+28%" }
                    ].map((m, i) => (
                      <div key={i} className="space-y-2 p-4 rounded-xl bg-background/50 border border-white/5">
                        <p className="text-[10px] font-bold text-content-secondary uppercase tracking-widest">{m.label}</p>
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-1">
                              <Clock size={10} className="text-content-muted" />
                              <span className="text-[9px] text-content-muted font-bold">Wk 4:</span>
                              <span className="text-xs font-bold text-primary">{m.wk4}</span>
                           </div>
                           <div className="flex items-center gap-1">
                              <Target size={10} className="text-content-muted" />
                              <span className="text-[9px] text-content-muted font-bold">Wk 8:</span>
                              <span className="text-xs font-bold text-[#3FB68B]">{m.wk8}</span>
                           </div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="px-2">
                 <p className="text-[10px] text-content-muted leading-relaxed font-medium">
                    * Projections based on computational toxicology and biological reaction models. Individual results vary by environmental load and adherence to the prescribed AI protocol.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </Card>
  );
}
