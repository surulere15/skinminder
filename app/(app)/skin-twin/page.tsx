"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { formatScore, scoreColor, scoreBg } from "@/lib/utils";

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
    if (direction === "improving") return <TrendingUp className="text-skin-glow" size={18} />;
    if (direction === "declining") return <TrendingDown className="text-skin-rose" size={18} />;
    return <Minus className="text-skin-muted opacity-40" size={18} />;
  };

  const metricIcons: Record<string, React.ReactNode> = {
    "Hydration Score": <Droplets size={24} className="text-skin-violet" />,
    "Pigmentation Score": <Palette size={24} className="text-skin-gold" />,
    "Texture Score": <Eye size={24} className="text-skin-violet" />,
    "Oil Balance": <Activity size={24} className="text-skin-rose" />,
    "Skin Score": <Sparkles size={24} className="text-skin-gold" />,
  };

  if (isLoading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[70vh] bg-skin-pearl">
        <div className="w-20 h-20 rounded-[2rem] bg-skin-violet/5 flex items-center justify-center border border-skin-violet/10 relative">
           <Loader2 className="w-10 h-10 text-skin-violet animate-spin" />
           <div className="absolute inset-0 border-2 border-skin-violet/20 rounded-[2rem] animate-ping opacity-20" />
        </div>
        <p className="mt-8 font-outfit font-black tracking-widest text-[10px] uppercase animate-pulse text-skin-muted">Sequencing Biological Memory...</p>
      </div>
    );
  }

  if (!data || data.scanCount === 0) {
    return (
      <div className="p-8 lg:p-12 max-w-5xl mx-auto space-y-12 bg-skin-pearl min-h-screen text-left">
        <header className="space-y-4 pb-4 border-b border-skin-border/10">
          <h1 className="text-4xl lg:text-6xl font-outfit font-black tracking-tight text-skin-dark">Skin Progress</h1>
          <p className="text-skin-muted font-bold text-lg max-w-2xl opacity-80 leading-relaxed">
            Track how your skin changes over time. Scan weekly to see what's working.
          </p>
        </header>
        <Card className="border-dashed border-2 border-skin-border/20 bg-white/40 rounded-3xl group hover:bg-white transition-all">
          <CardContent className="p-12 text-center flex flex-col items-center space-y-6">
            <BarChart3 size={48} className="text-skin-muted/30" />
            <div className="space-y-2">
               <h2 className="text-2xl font-semibold text-skin-dark">No scans yet</h2>
               <p className="text-skin-muted max-w-md">
                 Take your first scan to start tracking your skin's progress over time.
               </p>
            </div>
            <Button asChild>
              <a href="/scan">Take First Scan</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 space-y-12 max-w-7xl mx-auto bg-skin-pearl min-h-screen text-left">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-4 border-b border-skin-border/10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-skin-muted/5 text-skin-dark text-[10px] font-black uppercase tracking-widest border border-skin-border/10 shadow-sm">
            <Activity size={14} className="text-skin-violet" /> Longitudinal Intelligence
          </div>
          <h1 className="text-4xl lg:text-6xl font-outfit font-black tracking-tight text-skin-dark leading-none">Skin Twin</h1>
          <p className="text-skin-muted font-bold text-lg max-w-2xl opacity-80 leading-relaxed">
            {data.scanCount} integrated cycle{data.scanCount !== 1 ? 's' : ''} sequenced. Your biological transition, visualized.
          </p>
        </div>
        <Badge variant="premium" className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
           Neural Identity: {data.scanCount} Cycles
        </Badge>
      </header>

      {/* Trend Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {(data.trends || []).map((trend: any, i: number) => (
          <motion.div
            key={trend.metric}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none bg-white shadow-xl shadow-black-[2%] rounded-[2.5rem] overflow-hidden group hover:shadow-2xl hover:scale-[1.05] transition-all duration-500 border border-skin-border/5">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-skin-muted/5 flex items-center justify-center border border-skin-border/10 transition-transform group-hover:rotate-12">
                     {metricIcons[trend.metric] || <Activity size={24} />}
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-skin-muted/5 border border-skin-border/5">
                    {trendIcon(trend.direction)}
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      trend.direction === "improving" ? "text-skin-glow" :
                      trend.direction === "declining" ? "text-skin-rose" : "text-skin-muted opacity-60"
                    )}>
                      {trend.changePercent > 0 ? '+' : ''}{trend.changePercent}%
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-skin-muted opacity-40 ml-1">{trend.metric}</p>
                  <p className="text-4xl font-outfit font-black text-skin-dark">{trend.recentAvg}</p>
                </div>
                <Progress value={trend.recentAvg} className="h-2 rounded-full bg-skin-muted/10" indicatorClassName={cn(trend.direction === "improving" ? "bg-skin-glow" : trend.direction === "declining" ? "bg-skin-rose" : "bg-skin-violet")} />
                <Badge variant="secondary" className={cn(
                  "text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1 scale-90 md:scale-100",
                  trend.direction === "improving" ? "bg-skin-glow/10 text-skin-glow" :
                  trend.direction === "declining" ? "bg-skin-rose/10 text-skin-rose" : "bg-skin-pearl text-skin-muted opacity-60"
                )}>
                  Status: {trend.direction}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* History Tabs */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="rounded-[2.5rem] h-20 px-4 bg-white border border-skin-border/10 shadow-sm flex w-full md:w-fit">
          <TabsTrigger value="timeline" className="rounded-[1.5rem] px-10 h-12 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-skin-violet data-[state=active]:text-white transition-all">
             Chronological Sequencing
          </TabsTrigger>
          <TabsTrigger value="insights" className="rounded-[1.5rem] px-10 h-12 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-skin-violet data-[state=active]:text-white transition-all">
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
                <Card className="border-none bg-white shadow-xl shadow-black-[2%] rounded-[3rem] hover:shadow-[0_45px_100px_rgba(0,0,0,0.08)] hover:scale-[1.01] transition-all duration-300 group cursor-pointer border border-skin-border/5">
                  <CardContent className="p-8 flex flex-col md:flex-row items-center gap-10">
                    <div className={cn("w-20 h-20 rounded-[2.5rem] flex items-center justify-center font-black text-white text-2xl shadow-2xl relative shrink-0", scoreBg(scan.skin_score || 0))}>
                      {scan.skin_score || '—'}
                      <div className="absolute inset-0 border-4 border-white/20 rounded-[2.5rem]" />
                    </div>
                    <div className="flex-1 space-y-3 w-full text-center md:text-left">
                      <h3 className="font-outfit font-black text-2xl tracking-tight text-skin-dark leading-none">{scan.body_area || 'Integrated Face Scan'}</h3>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-skin-muted/5 border border-skin-border/10 text-[10px] font-black uppercase tracking-widest text-skin-dark shadow-sm">
                           <Calendar size={14} className="text-skin-violet" />
                           {new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-skin-muted/5 border border-skin-border/10 text-[10px] font-black uppercase tracking-widest text-skin-dark shadow-sm">
                           <Clock size={14} className="text-skin-violet" />
                           {new Date(scan.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-10 text-center shrink-0 border-t md:border-t-0 md:border-l border-skin-border/10 pt-8 md:pt-0 md:pl-10 w-full md:w-auto">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-skin-muted opacity-40">Hydration</p>
                        <p className="text-2xl font-black text-skin-dark leading-none">{Math.round((scan.hydration_score || 0) * 100)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-skin-muted opacity-40">Texture</p>
                        <p className="text-2xl font-black text-skin-dark leading-none">{Math.round((scan.texture_score || 0) * 100)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-skin-muted opacity-40">Oil Balance</p>
                        <p className="text-2xl font-black text-skin-dark leading-none">{Math.round((scan.oil_balance || 0) * 100)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-12">
          <Card className="border-none bg-skin-graphite text-skin-pearl rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.4)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-skin-graphite to-[#222] pointer-events-none" />
             <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-skin-violet/10 rounded-full blur-[150px] -ml-60 -mt-60 pointer-events-none" />
            
            <CardContent className="p-12 md:p-20 relative z-10 space-y-16 w-full text-left">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                  <div className="space-y-4">
                    <h3 className="text-4xl md:text-5xl font-outfit font-black tracking-tight leading-none drop-shadow-2xl">Predictive Synthesis</h3>
                    <p className="text-white/60 text-xl font-medium leading-relaxed max-w-xl">Deep biological trends generated from your longitudinal dermal matrix.</p>
                  </div>
                  <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-2xl">
                     <Sparkles size={48} className="text-skin-gold" />
                  </div>
               </div>

               <div className="grid lg:grid-cols-2 gap-8">
                  {(data.trends || []).filter((t: any) => t.direction !== "stable").map((t: any, i: number) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-8 p-8 rounded-[2.5rem] bg-white/5 border border-white/10 group/item hover:bg-white/10 transition-all shadow-xl"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner group-hover/item:rotate-12 transition-transform">
                         {trendIcon(t.direction)}
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{t.metric} VECTOR</p>
                        <p className="text-xl font-bold text-white/90 leading-tight">
                          Integrated score is{' '}
                          <span className={cn(t.direction === "improving" ? "text-skin-glow" : "text-skin-rose", "font-black")}>
                             {t.direction === "improving" ? "trending upward" : "showing critical decline"}
                          </span>{' '}
                          by <span className="text-white font-black">{Math.abs(t.changePercent)}%</span> across cycles.
                        </p>
                      </div>
                    </motion.div>
                  ))}
               </div>

               <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 shadow-inner group-hover:bg-white-[2%] transition-colors">
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="w-16 h-16 rounded-2xl bg-skin-violet/20 flex items-center justify-center text-skin-violet shrink-0 border border-skin-violet/20">
                       <ShieldCheck size={32} />
                    </div>
                    <div className="space-y-3">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white opacity-60">Biological Synthesis Guard</h4>
                       <p className="text-lg font-bold text-white/70 leading-relaxed italic">
                         "These predictive vectors are synthesized based on high-fidelity cosmetic analysis patterns and should not be interpreted as medical diagnoses. Strategic consultation with a qualified dermatologist is recommended for clinical anomalies."
                       </p>
                    </div>
                  </div>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
