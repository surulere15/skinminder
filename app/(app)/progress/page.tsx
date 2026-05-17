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
import { PremiumCard } from "@/components/ui/premium-card";
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
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-black text-white relative overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl opacity-50" />
        </div>
        <div className="relative">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <p className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-primary animate-pulse italic">Sequencing Dermal trajectory...</p>
      </div>
    );
  }

  if (scans.length === 0) {
    return (
      <div className="flex-1 p-8 pt-20 flex flex-col items-center justify-center text-center bg-black min-h-[80vh] relative overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl opacity-50" />
        </div>
        <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-10 border border-primary/20 shadow-glow transition-transform hover:scale-110 duration-700">
          <Activity className="w-12 h-12 text-primary/60" />
        </div>
        <h2 className="text-4xl lg:text-6xl text-diagnostic leading-none mb-6">No Biological Record</h2>
        <p className="text-white/40 text-xl font-medium max-w-lg italic mb-12">
          Your chronological dermal trajectory will initialize once you complete your first clinical scan.
        </p>
        <Link href="/scan/new">
          <Button variant="flagship" className="h-20 px-12 text-lg shadow-glow">
              Start Record Initialization <ChevronRight className="ml-3 w-6 h-6" />
          </Button>
        </Link>
      </div>
    );
  }

  const firstScan = chartData[0];
  const lastScan = chartData[chartData.length - 1];
  
  const scoreChange = lastScan && firstScan ? lastScan.score - firstScan.score : 0;
  const hydrationChange = lastScan && firstScan ? Math.round((lastScan.hydration - firstScan.hydration) * 100) : 0;

  return (
    <div className="flex-1 space-y-24 p-8 lg:p-16 bg-black min-h-screen text-white relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl opacity-50" />
        <div className="absolute right-[-8%] top-[10%] h-[360px] w-[360px] rounded-full bg-white/[0.03] blur-3xl opacity-50" />
      </div>

      <div className="flex items-center justify-between border-b border-white/5 pb-16 relative z-10">
        <div className="text-left space-y-6 flex-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20 shadow-glow italic">
            <TrendingUp size={14} className="text-primary" /> Longitudinal Analysis Active
          </div>
          <h2 className="text-4xl lg:text-7xl text-diagnostic leading-none">Progress Timeline</h2>
          <p className="text-white/40 text-xl font-medium max-w-2xl border-l-2 border-primary/30 pl-8 py-1 italic">
             Biological trajectory initialized. Mapping dermal biomarkers across temporal sequences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        <PremiumCard className="p-10 border-white/5 group hover:border-primary/20 transition-all duration-500">
          <div className="flex items-center justify-between mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-glow transition-transform group-hover:scale-110">
              <Activity size={24} />
            </div>
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest flex items-center px-4 py-1.5 rounded-full border shadow-glow italic",
              scoreChange >= 0 ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400" : "bg-red-400/10 border-red-400/20 text-red-400"
            )}>
              {scoreChange >= 0 ? <TrendingUp size={14} className="mr-2" /> : <TrendingDown size={14} className="mr-2" />}
              {Math.abs(scoreChange)} PTS DELTA
            </span>
          </div>
          <p className="text-label text-primary/60 mb-2">OVERALL VITALITY</p>
          <div className="text-5xl font-black text-white italic tracking-tighter">{lastScan?.score || 0}</div>
        </PremiumCard>

        <PremiumCard className="p-10 border-white/5 group hover:border-primary/20 transition-all duration-500">
          <div className="flex items-center justify-between mb-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-400/10 flex items-center justify-center text-emerald-400 border border-emerald-400/20 shadow-glow transition-transform group-hover:scale-110">
              <Droplets size={24} />
            </div>
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest flex items-center px-4 py-1.5 rounded-full border shadow-glow italic",
              hydrationChange >= 0 ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400" : "bg-red-400/10 border-red-400/20 text-red-400"
            )}>
              {hydrationChange >= 0 ? <TrendingUp size={14} className="mr-2" /> : <TrendingDown size={14} className="mr-2" />}
              {Math.abs(hydrationChange)}% DELTA
            </span>
          </div>
          <p className="text-label text-emerald-400/40 mb-2">HYDRATION INDEX</p>
          <div className="text-5xl font-black text-white italic tracking-tighter">{Math.round((lastScan?.hydration || 0) * 100)}%</div>
        </PremiumCard>

        <PremiumCard variant="elevated" className="p-10 border-white/5 group hover:border-primary/20 transition-all duration-500">
          <div className="flex items-center justify-between mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-glow transition-transform group-hover:scale-110">
              <Layers size={24} />
            </div>
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.25em] italic">CLINICAL BASELINE</span>
          </div>
          <p className="text-label text-primary/40 mb-2">TEXTURE STABILITY</p>
          <div className="text-5xl font-black text-white italic tracking-tighter">{Math.round((lastScan?.texture || 0) * 100)}</div>
        </PremiumCard>
      </div>

      <div className="relative z-10">
        {chartData.length > 1 ? (
          <PremiumCard variant="master" className="p-1 border-white/5">
            <div className="p-10 pb-0">
              <h3 className="text-3xl text-diagnostic leading-none">Multi-Engine Trajectory</h3>
              <p className="text-label text-white/20 mt-4 italic tracking-[0.1em]">Longitudinal performance mapping across neural engines.</p>
            </div>
            <div className="p-10 pt-16">
              <div className="h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorHydration" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#34d399" stopOpacity={0.1}/>
                         <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)', fontWeight: 900 }}
                      dy={20}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)', fontWeight: 900 }}
                      domain={['dataMin - 10', 'dataMax + 10']}
                    />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', fontWeight: 'bold', padding: '16px', backgroundColor: 'rgba(0,0,0,0.8)', color: 'white' }}
                      labelStyle={{ color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase', fontSize: '10px', fontWeight: 900, letterSpacing: '0.1em' }}
                      cursor={{ stroke: '#c9a96e', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      name="Overall Vitality"
                      stroke="#c9a96e" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorScore)" 
                      animationDuration={2000}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="hydration" 
                      name="Hydration"
                      stroke="#34d399" 
                      strokeWidth={2}
                      strokeDasharray="8 8"
                      fillOpacity={1} 
                      fill="url(#colorHydration)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </PremiumCard>
        ) : (
          <PremiumCard variant="elevated" className="h-72 border-white/5 flex items-center justify-center p-12">
            <div className="flex gap-10 items-center max-w-3xl">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-glow transition-all group-hover:scale-110">
                 <Activity size={32} />
              </div>
              <p className="text-white/40 text-xl font-medium italic leading-relaxed">
                Chronological pattern mapping requires a minimum of <span className="text-primary italic">2 clinical capture sequences</span>. Proceed to initialization to begin biological trajectory analysis.
              </p>
            </div>
          </PremiumCard>
        )}
      </div>

      {/* History Timeline */}
      <div className="mt-32 space-y-16 text-left relative z-10">
         <div className="border-b border-white/5 pb-10">
            <h3 className="text-3xl lg:text-5xl text-diagnostic leading-none">Biological Analysis Log</h3>
            <p className="text-label text-white/30 mt-4 italic">Sequential record of clinical dermal intelligence captures.</p>
         </div>
         
         <div className="relative border-l-2 border-white/5 space-y-12 pl-12 md:pl-20 pb-24 ml-6 lg:ml-10">
            {scans.slice().reverse().map((scan, index) => {
               const prevScan = index < scans.length - 1 ? scans[index + 1] : null;
               const scoreDiff = prevScan && scan.overall_score && prevScan.overall_score 
                 ? scan.overall_score - prevScan.overall_score 
                 : 0;

               const raw = scan.analysis_raw;
               const summary = raw?.intelligence?.summary || "Comprehensive biological sequence completed. Biomarkers localized and analyzed.";

               return (
                  <motion.div 
                     key={scan.id}
                     initial={{ opacity: 0, x: -40 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.8, delay: index * 0.1, ease: "circOut" }}
                     className="relative"
                  >
                     {/* Timeline Node */}
                     <div className="absolute -left-[61px] md:-left-[93px] top-6 w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-elite z-20">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-glow animate-pulse" />
                     </div>
                     
                     <PremiumCard className="p-8 md:p-12 group relative border-white/5 hover:border-primary/20 transition-all duration-700">
                        <div className="flex flex-col md:flex-row gap-12">
                          <div className="flex-1 space-y-10">
                             <div className="flex flex-wrap items-center gap-6">
                                <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-black text-white/40 font-black text-[10px] uppercase tracking-[0.25em] border border-white/10 italic">
                                   <Calendar size={14} className="text-primary" /> {format(parseISO(scan.created_at), "MMM d, yyyy")}
                                </span>
                                {scoreDiff !== 0 && (
                                  <span className={cn(
                                    "text-[10px] font-black uppercase tracking-widest flex items-center px-5 py-2.5 rounded-xl border shadow-glow italic",
                                    scoreDiff > 0 ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400" : "bg-red-400/10 border-red-400/20 text-red-400"
                                  )}>
                                    {scoreDiff > 0 ? <TrendingUp size={16} className="mr-2" /> : <TrendingDown size={16} className="mr-2" />}
                                    {Math.abs(scoreDiff)} PTS DELTA
                                  </span>
                                )}
                             </div>
                             <p className="text-xl md:text-2xl font-medium leading-relaxed text-white/60 italic border-l-4 border-primary/20 pl-8">
                                "{summary}"
                             </p>
                             <Link href={`/scan/${scan.id}`} className="group inline-flex items-center text-primary text-[10px] font-black uppercase tracking-[0.3em] hover:opacity-80 transition-all italic underline underline-offset-[12px]">
                                DECRYPT FULL REPORT <ChevronRight size={14} className="ml-2 group-hover:translate-x-4 transition-transform duration-500" />
                             </Link>
                          </div>
                          
                          <div className="w-full md:w-64 aspect-[4/5] rounded-[2.5rem] bg-black overflow-hidden relative border border-white/5 flex-shrink-0 shadow-elite transition-all duration-1000 group-hover:border-primary/30">
                             {scan.image_url ? (
                                <img src={scan.image_url} alt="Scan context" className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale brightness-125 opacity-40 group-hover:opacity-100 group-hover:grayscale-0" />
                             ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-white/10">
                                   <Camera size={32} />
                                </div>
                             )}
                             <div className="absolute top-5 right-5 w-14 h-14 rounded-2xl bg-black/80 backdrop-blur-xl flex items-center justify-center text-primary font-black text-xl border border-primary/30 shadow-glow italic">
                                {scan.overall_score || '?'}
                             </div>
                          </div>
                        </div>
                     </PremiumCard>
                  </motion.div>
               );
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
