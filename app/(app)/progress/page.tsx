"use client";

import React, { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Droplets, 
  Sparkles,
  Calendar,
  Layers,
  Camera,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ScanRecord = {
  id: string;
  created_at: string;
  overall_score: number | null;
  analysis_raw: any;
  image_url: string;
};

type FormattedChartData = {
  date: string;
  fullDate: string;
  score: number;
  hydration: number;
  texture: number;
  id: string;
};

export default function ProgressPage() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<FormattedChartData[]>([]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('/api/scans/history');
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setScans(data);

        // Format data for Recharts
        const formatted = data.map((scan: ScanRecord) => {
          const raw = scan.analysis_raw;
          let hydration = 50;
          let texture = 50;
          
          if (raw && raw.vision && typeof raw.vision.hydration_score === 'number') {
            hydration = raw.vision.hydration_score;
          }
          if (raw && raw.vision && typeof raw.vision.texture_score === 'number') {
            texture = raw.vision.texture_score;
          }

          return {
            date: format(parseISO(scan.created_at), 'MMM d'),
            fullDate: format(parseISO(scan.created_at), 'MMM d, yyyy'),
            score: scan.overall_score || 0,
            hydration,
            texture,
            id: scan.id
          };
        });
        
        setChartData(formatted.filter((d: FormattedChartData) => d.score > 0));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-background text-content-primary">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="mt-6 text-content-muted text-[10px] font-bold uppercase tracking-widest animate-pulse">Sequencing Dermal trajectory...</p>
      </div>
    );
  }

  if (scans.length === 0) {
    return (
      <div className="flex-1 p-8 pt-20 flex flex-col items-center justify-center text-center bg-background">
        <div className="w-20 h-20 bg-skin-surface rounded-2xl flex items-center justify-center mb-8 border border-white/5 shadow-inner">
          <Activity className="w-10 h-10 text-primary/40" />
        </div>
        <h2 className="text-3xl font-semibold tracking-tight mb-4 text-content-primary">No Biological Record</h2>
        <p className="text-content-secondary mb-10 max-w-sm font-normal opacity-80 leading-relaxed">
          Your chronological dermal trajectory will initialize once you complete your first clinical scan.
        </p>
        <Link href="/scan/new">
          <Button variant="clinical" size="lg" className="h-14 px-8 shadow-lg">
              Start Clinical Scan <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    );
  }

  const firstScan = chartData[0];
  const lastScan = chartData[chartData.length - 1];
  
  const scoreChange = lastScan && firstScan ? lastScan.score - firstScan.score : 0;
  const hydrationChange = lastScan && firstScan ? lastScan.hydration - firstScan.hydration : 0;

  // Determine if change is meaningful (not just image variance)
  const MIN_CHANGE_THRESHOLD = 5;
  const isScoreMeaningful = Math.abs(scoreChange) >= MIN_CHANGE_THRESHOLD;
  const hasReliableTrend = chartData.length >= 3;

  // Get trend message and styling
  const getTrendInfo = () => {
    if (!hasReliableTrend) {
      return { 
        message: "Scan at least 3 times for reliable trend detection", 
        className: "bg-skin-surface border-white/10 text-content-muted" 
      };
    }
    if (!isScoreMeaningful) {
      return { 
        message: "No meaningful change detected yet - keep scanning consistently", 
        className: "bg-skin-surface border-white/10 text-content-muted" 
      };
    }
    if (scoreChange > 0) {
      return { 
        message: "Your routine is working. Keep it up!", 
        className: "bg-green-500/10 border-green-500/20 text-green-600" 
      };
    }
    return { 
      message: "Consider adjusting your routine based on your latest scan", 
      className: "bg-amber-500/10 border-amber-500/20 text-amber-600" 
    };
  };

  const trendInfo = getTrendInfo();

  return (
    <div className="flex-1 space-y-12 p-4 md:p-8 pt-6 pb-20 bg-background min-h-screen text-content-primary">
      <div className="flex items-center justify-between border-b border-white/5 pb-10">
        <div className="text-left space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skin-surface text-content-secondary text-[10px] font-bold uppercase tracking-widest border border-white/5 shadow-md">
            <TrendingUp size={12} className="text-primary" /> Longitudinal Analysis
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-content-primary">Progress Timeline</h2>
          <p className="text-content-muted font-bold uppercase tracking-widest text-[10px]">Mapping your biological dermal trajectory.</p>
        </div>
      </div>

      {/* Trend Message Banner */}
      {scans.length > 0 && (
        <div className={cn("p-4 rounded-xl border text-sm font-medium", trendInfo.className)}>
          {trendInfo.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Trend Summary Cards */}
        <Card className="bg-skin-surface border border-white/5 shadow-xl rounded-2xl overflow-hidden transition-all hover:bg-white/[0.02]">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Activity size={20} />
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest flex items-center px-3 py-1 rounded-full border shadow-sm",
                scoreChange >= 0 ? "bg-success/10 border-success/20 text-success" : "bg-destructive/10 border-destructive/20 text-destructive"
              )}>
                {scoreChange >= 0 ? <TrendingUp size={12} className="mr-1.5" /> : <TrendingDown size={12} className="mr-1.5" />}
                {Math.abs(scoreChange)} pts
              </span>
            </div>
            <p className="text-[10px] font-bold text-content-muted uppercase tracking-widest mb-2">Overall Vitality</p>
            <div className="text-4xl font-semibold text-content-primary">{lastScan?.score || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-skin-surface border border-white/5 shadow-xl rounded-2xl overflow-hidden transition-all hover:bg-white/[0.02]">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Droplets size={20} />
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest flex items-center px-3 py-1 rounded-full border shadow-sm",
                hydrationChange >= 0 ? "bg-success/10 border-success/20 text-success" : "bg-destructive/10 border-destructive/20 text-destructive"
              )}>
                {hydrationChange >= 0 ? <TrendingUp size={12} className="mr-1.5" /> : <TrendingDown size={12} className="mr-1.5" />}
                {Math.abs(hydrationChange)}%
              </span>
            </div>
            <p className="text-[10px] font-bold text-content-muted uppercase tracking-widest mb-2">Hydration Index</p>
            <div className="text-4xl font-semibold text-content-primary">{lastScan?.hydration || 0}%</div>
          </CardContent>
        </Card>

        <Card className="bg-skin-surface border border-white/5 shadow-xl rounded-2xl overflow-hidden transition-all hover:bg-white/[0.02]">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Layers size={20} />
              </div>
              <span className="text-[10px] font-bold text-content-muted uppercase tracking-widest opacity-40">Clinical Baseline</span>
            </div>
            <p className="text-[10px] font-bold text-content-muted uppercase tracking-widest mb-2">Texture Score</p>
            <div className="text-4xl font-semibold text-content-primary">{lastScan?.texture || 0}</div>
          </CardContent>
        </Card>
      </div>

      {chartData.length > 1 ? (
        <Card className="bg-skin-surface border border-white/5 shadow-2xl overflow-hidden rounded-2xl">
          <CardHeader className="p-10 pb-0">
            <CardTitle className="text-xl font-semibold flex items-center gap-3 text-content-primary">
              <Activity className="w-5 h-5 text-primary" /> Multi-Engine Trajectory
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10 pt-10">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--skin-accent)" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="var(--skin-accent)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorHydration" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="var(--skin-success)" stopOpacity={0.1}/>
                       <stop offset="95%" stopColor="var(--skin-success)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: 'var(--skin-content-muted)', fontWeight: 700 }}
                    dy={20}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: 'var(--skin-content-muted)', fontWeight: 700 }}
                    domain={['dataMin - 10', 'dataMax + 10']}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', fontWeight: 'bold', padding: '16px', backgroundColor: 'var(--skin-surface-elevated)', color: 'var(--skin-content-primary)' }}
                    labelStyle={{ color: 'var(--skin-content-muted)', marginBottom: '8px', textTransform: 'uppercase', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em' }}
                    cursor={{ stroke: 'var(--skin-accent)', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    name="Overall Vitality"
                    stroke="var(--skin-accent)" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="hydration" 
                    name="Hydration"
                    stroke="var(--skin-success)" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fillOpacity={1} 
                    fill="url(#colorHydration)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-panel border-skin-border/10 shadow-xl shadow-black/5 flex items-center justify-center h-56 rounded-[3rem] bg-white text-left px-10">
          <div className="flex gap-4 items-center">
            <Info className="text-skin-violet" size={32} />
            <p className="text-skin-muted font-bold text-lg leading-tight">Sequence at least 2 integrated scans to unlock your biological trajectory graph.</p>
          </div>
        </Card>
      )}

      {/* History Timeline */}
      <div className="mt-20 space-y-10 text-left">
         <div className="px-6">
           <h3 className="text-2xl font-semibold tracking-tight text-content-primary">Biological Analysis Log</h3>
           <p className="text-content-muted text-[10px] font-bold uppercase tracking-[0.2em] mt-2 opacity-60">Chronological storage of integrated dermal sequencing.</p>
         </div>
         
         <div className="relative border-l-2 border-skin-border/10 ml-6 md:ml-10 space-y-10 pl-10 md:pl-16 pb-12">
            {scans.slice().reverse().map((scan, index) => {
               const prevScan = index < scans.length - 1 ? scans[index + 1] : null;
               const scoreDiff = prevScan && scan.overall_score && prevScan.overall_score 
                 ? scan.overall_score - prevScan.overall_score 
                 : 0;

               const raw = scan.analysis_raw;
               const summary = raw?.intelligence?.summary || "Comprehensive 7-engine biological scan completed.";

               return (
                  <motion.div 
                     key={scan.id}
                     initial={{ opacity: 0, x: -30 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: index * 0.1 }}
                     className="relative"
                  >
                     {/* Timeline Node */}
                     <div className="absolute -left-[53px] md:-left-[67px] top-2 w-10 h-10 rounded-xl bg-skin-surface border border-white/5 flex items-center justify-center shadow-xl">
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--skin-accent-rgb),0.4)]" />
                     </div>
                     
                     <div className="flex flex-col md:flex-row gap-8 bg-skin-surface border border-white/5 rounded-2xl p-8 shadow-xl transition-all hover:bg-white/[0.02]">
                        <div className="flex-1 space-y-5">
                           <div className="flex flex-wrap items-center gap-4">
                              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background text-content-secondary font-bold text-[10px] uppercase tracking-widest border border-white/5">
                                 <Calendar size={14} className="text-primary" /> {format(parseISO(scan.created_at), "MMM d, yyyy")}
                              </span>
                              {scoreDiff !== 0 && (
                                <span className={cn(
                                  "text-[10px] font-bold uppercase tracking-widest flex items-center px-3 py-1.5 rounded-full border",
                                  scoreDiff > 0 ? "bg-success/10 border-success/20 text-success" : "bg-destructive/10 border-destructive/20 text-destructive"
                                )}>
                                  {scoreDiff > 0 ? <TrendingUp size={14} className="mr-2" /> : <TrendingDown size={14} className="mr-2" />}
                                  {Math.abs(scoreDiff)} pts variance
                                </span>
                              )}
                           </div>
                           <p className="text-lg font-medium leading-relaxed text-content-primary opacity-90">
                              "{summary}"
                           </p>
                           <Link href={`/scan/${scan.id}`} className="group inline-flex items-center text-primary text-[10px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity">
                              View Intelligence Report <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                           </Link>
                        </div>
                        
                        <div className="w-full md:w-40 aspect-square rounded-xl bg-background overflow-hidden relative border border-white/5 flex-shrink-0 shadow-inner group">
                           {scan.image_url ? (
                              <img src={scan.image_url} alt="Scan context" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 opacity-80" />
                           ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-content-muted">
                                 <Camera size={28} className="opacity-20" />
                              </div>
                           )}
                           <div className="absolute top-3 right-3 w-10 h-10 rounded-lg bg-skin-surface-elevated/90 backdrop-blur-md flex items-center justify-center text-content-primary font-bold text-xs border border-white/10 shadow-xl">
                              {scan.overall_score || '?'}
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )
            })}
         </div>
      </div>
    </div>
  );
}

const Info = ({ className, size }: { className?: string, size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ width: size, height: size }}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
)
