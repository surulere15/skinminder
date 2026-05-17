"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SkinScoreRing } from "@/components/ui/skin-score-ring";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Calendar,
  Sparkles,
  Loader2,
  BarChart3,
  Droplets,
  Eye,
  Palette,
  ShieldCheck,
  ChevronRight,
  Zap,
  Info,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SkinTwinPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSkinTwin() {
      try {
        const res = await fetch("/api/skin-twin");
        if (!res.ok) throw new Error("Failed to load");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Skin Twin load error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSkinTwin();
  }, []);

  const trendIcon = (direction: string) => {
    if (direction === "improving") return <TrendingUp className="text-emerald-400" size={18} />;
    if (direction === "declining") return <TrendingDown className="text-red-400" size={18} />;
    return <Minus className="text-white/20" size={18} />;
  };

  const metricIcons: Record<string, React.ReactNode> = {
    "Hydration Score": <Droplets size={24} className="text-[#c9a96e]" />,
    "Pigmentation Score": <Palette size={24} className="text-[#c9a96e]" />,
    "Texture Score": <Eye size={24} className="text-[#c9a96e]" />,
    "Oil Balance": <Activity size={24} className="text-[#c9a96e]" />,
    "Skin Score": <Sparkles size={24} className="text-[#c9a96e]" />,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 relative overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-[#c9a96e]/10 blur-3xl opacity-50" />
        </div>
        <div className="relative">
          <Loader2 className="w-12 h-12 text-[#c9a96e] animate-spin" />
          <motion.div
            className="absolute inset-0 rounded-full bg-[#c9a96e]/20"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <p className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-[#c9a96e] animate-pulse italic">Sequencing Biological Memory...</p>
      </div>
    );
  }

  if (!data || data.scanCount === 0) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-black text-white p-6 lg:p-12">
        <div className="fixed inset-0 -z-10">
          <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-[#c9a96e]/10 blur-3xl opacity-50" />
        </div>
        <div className="max-w-5xl mx-auto space-y-12 relative z-10">
          <header className="space-y-4 pb-8 border-b border-white/5">
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-white uppercase italic">Biological Progress</h1>
            <p className="text-white/50 font-medium text-lg max-w-2xl border-l-2 border-[#c9a96e]/30 pl-6 py-1">
              No biological cycles detected. Sequence your first scan to initialize longitudinal intelligence.
            </p>
          </header>
          <Card className="border-white/10 bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] shadow-2xl">
            <CardContent className="p-20 text-center flex flex-col items-center space-y-8">
              <div className="w-24 h-24 rounded-3xl bg-white/[0.02] border border-white/10 flex items-center justify-center text-white/10 shadow-inner">
                <BarChart3 size={48} />
              </div>
              <div className="space-y-3">
                 <h2 className="text-2xl font-black uppercase italic text-white">Identity Matrix Empty</h2>
                 <p className="text-white/30 font-black uppercase tracking-widest text-xs">
                   Take your first scan to begin the sequencing process.
                 </p>
              </div>
              <Button variant="flagship" className="h-16 px-12" onClick={() => window.location.href = '/scan'}>
                Initiate First Scan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white p-6 lg:p-12">
      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-[#c9a96e]/10 blur-3xl opacity-50" />
        <div className="absolute right-[-8%] top-[10%] h-[360px] w-[360px] rounded-full bg-white/[0.03] blur-3xl opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto space-y-12 md:space-y-16 relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-8 border-b border-white/5">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/20 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#c9a96e]/5">
              <Activity size={14} className="text-[#c9a96e]" /> Longitudinal Intelligence
            </div>
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-white uppercase italic leading-none">Skin Twin Vector</h1>
            <p className="text-white/50 font-medium text-lg max-w-2xl border-l-2 border-[#c9a96e]/30 pl-6 py-1">
              {data.scanCount} integrated cycle{data.scanCount !== 1 ? 's' : ''} sequenced. Your biological transition, visualized through high-fidelity dermal patterns.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            {data.trends?.find((t: any) => t.metric === "Skin Score") && (
              <div className="bg-white/[0.03] p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
                <SkinScoreRing 
                  score={data.trends.find((t: any) => t.metric === "Skin Score").recentAvg}
                  size={120}
                  strokeWidth={10}
                  label="Overall"
                />
              </div>
            )}
            <div className="px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg text-white/40">
              Neural Identity: <span className="text-[#c9a96e]">{data.scanCount} Cycles</span>
            </div>
          </div>
        </header>

        {/* Trend Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {(data.trends || []).map((trend: any, i: number) => (
            <motion.div
              key={trend.metric}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-white/10 bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group hover:bg-white/[0.05] transition-all shadow-2xl">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg">
                       {metricIcons[trend.metric] || <Activity size={24} className="text-[#c9a96e]" />}
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/10">
                      {trendIcon(trend.direction)}
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest",
                        trend.direction === "improving" ? "text-emerald-400" :
                        trend.direction === "declining" ? "text-red-400" : "text-white/20"
                      )}>
                        {trend.changePercent > 0 ? '+' : ''}{trend.changePercent}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">{trend.metric}</p>
                    <p className="text-4xl font-black text-white italic tracking-tight">{trend.recentAvg}</p>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden border border-white/10">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${trend.recentAvg}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className={cn(
                        "h-full rounded-full transition-all",
                        trend.direction === "improving" ? "bg-emerald-400" : 
                        trend.direction === "declining" ? "bg-red-400" : "bg-[#c9a96e]"
                      )}
                    />
                  </div>
                  <div className={cn(
                    "w-fit px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] border",
                    trend.direction === "improving" ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" :
                    trend.direction === "declining" ? "bg-red-400/10 text-red-400 border-red-400/20" : "bg-white/[0.03] text-white/30 border-white/10"
                  )}>
                    {trend.direction}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* History Tabs */}
        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="rounded-[2.5rem] h-20 px-4 bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-2xl flex w-full md:w-fit">
            <TabsTrigger value="timeline" className="rounded-[1.5rem] px-10 h-12 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-[#c9a96e] data-[state=active]:text-black transition-all">
               Chronological Sequencing
            </TabsTrigger>
            <TabsTrigger value="insights" className="rounded-[1.5rem] px-10 h-12 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-[#c9a96e] data-[state=active]:text-black transition-all">
               Predictive Synthesis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline" className="mt-12 space-y-6">
            <div className="space-y-6">
              {(data.scans || []).slice().reverse().map((scan: any, i: number) => (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="border-white/10 bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] hover:bg-white/[0.05] hover:scale-[1.01] transition-all duration-300 group cursor-pointer shadow-2xl">
                    <CardContent className="p-8 flex flex-col md:flex-row items-center gap-10">
                      <div className={cn("w-20 h-20 rounded-[2.5rem] flex items-center justify-center font-black text-black text-2xl shadow-2xl relative shrink-0", scan.skin_score >= 80 ? "bg-emerald-400" : scan.skin_score >= 65 ? "bg-[#c9a96e]" : "bg-red-400")}>
                        {scan.skin_score || '—'}
                        <div className="absolute inset-0 border-4 border-white/20 rounded-[2.5rem]" />
                      </div>
                      <div className="flex-1 space-y-3 w-full text-center md:text-left">
                        <h3 className="font-black text-2xl tracking-tight text-white uppercase italic leading-none">{scan.body_area || 'Integrated Face Scan'}</h3>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                          <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#c9a96e] shadow-sm">
                             <Calendar size={14} />
                             {new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 shadow-sm">
                             <Clock size={14} />
                             {new Date(scan.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-10 text-center shrink-0 border-t md:border-t-0 md:border-l border-white/5 pt-8 md:pt-0 md:pl-10 w-full md:w-auto">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Hydration</p>
                          <p className="text-2xl font-black text-[#c9a96e] leading-none italic">{Math.round((scan.hydration_score || 0) * 100)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Texture</p>
                          <p className="text-2xl font-black text-[#c9a96e] leading-none italic">{Math.round((scan.texture_score || 0) * 100)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Stability</p>
                          <p className="text-2xl font-black text-[#c9a96e] leading-none italic">{Math.round((scan.oil_balance || 0) * 100)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="mt-12">
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-3xl text-white rounded-[4rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-black/60 pointer-events-none" />
               <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#c9a96e]/5 rounded-full blur-[150px] -ml-60 -mt-60 pointer-events-none" />
              
              <CardContent className="p-12 md:p-20 relative z-10 space-y-16 w-full">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="space-y-4">
                      <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-none uppercase italic">Predictive Synthesis</h3>
                      <p className="text-white/40 text-xl font-medium leading-relaxed max-w-xl border-l-2 border-[#c9a96e]/30 pl-6 py-1">Deep biological trends generated from your longitudinal dermal matrix.</p>
                    </div>
                    <div className="w-24 h-24 rounded-[2rem] bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0 shadow-2xl">
                       <Sparkles size={48} className="text-[#c9a96e]" />
                    </div>
                 </div>

                 <div className="grid lg:grid-cols-2 gap-8">
                    {(data.trends || []).filter((t: any) => t.direction !== "stable").map((t: any, i: number) => (
                      <motion.div 
                        key={i} 
                        whileHover={{ x: 10 }}
                        className="flex items-center gap-8 p-10 rounded-[3rem] bg-black/40 border border-white/10 group/item hover:border-[#c9a96e]/30 transition-all shadow-xl shadow-black/20"
                      >
                        <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0 shadow-inner group-hover/item:scale-110 transition-transform">
                           {metricIcons[t.metric] || <Activity size={32} className="text-[#c9a96e]" />}
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20">{t.metric} VECTOR</p>
                          <p className="text-xl font-medium text-white/90 leading-tight italic">
                            Integrated score is{' '}
                            <span className={cn(t.direction === "improving" ? "text-emerald-400" : "text-red-400", "font-black uppercase tracking-tight")}>
                               {t.direction === "improving" ? "trending upward" : "showing critical decline"}
                            </span>{' '}
                            by <span className="text-[#c9a96e] font-black">{Math.abs(t.changePercent)}%</span> across cycles.
                          </p>
                        </div>
                      </motion.div>
                    ))}
                 </div>

                 <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row items-start gap-8">
                      <div className="w-16 h-16 rounded-2xl bg-[#c9a96e]/10 flex items-center justify-center text-[#c9a96e] shrink-0 border border-[#c9a96e]/20">
                         <ShieldCheck size={32} />
                      </div>
                      <div className="space-y-3">
                         <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Biological Synthesis Guard</h4>
                         <p className="text-base font-bold text-white/40 leading-relaxed italic">
                           "These predictive vectors are synthesized based on high-fidelity cosmetic analysis patterns and should not be interpreted as medical diagnoses."
                         </p>
                      </div>
                    </div>
                 </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
