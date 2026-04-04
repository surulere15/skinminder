"use client";

import React from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Sparkles, Activity } from "lucide-react";

const mockData = [
  { year: "Current", collagen: 85, age: 24, refinement: 78 },
  { year: "+1Y", collagen: 82, age: 24.5, refinement: 82 },
  { year: "+2Y", collagen: 80, age: 25.2, refinement: 85 },
  { year: "+3Y", collagen: 78, age: 26, refinement: 88 },
  { year: "+4Y", collagen: 75, age: 26.8, refinement: 90 },
  { year: "+5Y", collagen: 72, age: 27.5, refinement: 92 },
];

export function PredictiveModeling() {
  return (
    <div className="space-y-8 text-left">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold text-content-primary tracking-tight">Biological Forecast</h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#6F8BFF]">5-Year Aging Trajectory Model</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-2">
           <Activity size={16} className="text-primary" />
           <span className="text-xs font-bold text-content-primary">Predictive Engine v4.2</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Trajectory Chart */}
        <Card className="lg:col-span-8 bg-skin-surface border border-white/5 rounded-3xl overflow-hidden p-8 shadow-2xl relative">
           <div className="absolute top-8 right-8 flex items-center gap-4">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-primary" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-content-muted">Collagen Index</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#3FB68B]" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-content-muted">Pore Refinement</span>
              </div>
           </div>

           <div className="h-[280px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData}>
                  <defs>
                    <linearGradient id="colorCollagen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6F8BFF" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6F8BFF" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRefinement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3FB68B" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3FB68B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                  <XAxis 
                    dataKey="year" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#8C93B5', fontSize: 10, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1A2142', 
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '16px',
                      fontSize: '12px'
                    }}
                    itemStyle={{ color: '#F5F7FF' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="collagen" 
                    stroke="#6F8BFF" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCollagen)" 
                    animationDuration={2500}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="refinement" 
                    stroke="#3FB68B" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRefinement)" 
                    animationDuration={2500}
                  />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </Card>

        {/* Predictive Metrics */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="bg-skin-surface border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                <Sparkles size={80} />
              </div>
              <div className="space-y-1 relative z-10">
                 <p className="text-[10px] font-black uppercase tracking-widest text-content-muted">Apparent Age Delta</p>
                 <p className="text-3xl font-semibold text-primary">-2.4 Years</p>
                 <div className="flex items-center gap-1.5 pt-2">
                    <TrendingDown size={14} className="text-[#3FB68B]" />
                    <p className="text-xs font-medium text-content-secondary leading-tight">Predicted deceleration in photo-aging</p>
                 </div>
              </div>
           </Card>

           <Card className="bg-skin-surface border border-white/5 rounded-3xl p-6 shadow-xl">
              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-content-muted">Protocol Efficiency Model</p>
                 <div className="space-y-3">
                    {[
                      { label: "Barrier Resilience", val: "High", color: "text-[#3FB68B]" },
                      { label: "Melanocyte Stability", val: "Optimal", color: "text-primary" },
                      { label: "Oxidative Stress", val: "Low", color: "text-[#3FB68B]" }
                    ].map((m, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-xs font-medium text-content-secondary">{m.label}</span>
                        <span className={`text-xs font-bold uppercase tracking-widest ${m.color}`}>{m.val}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
