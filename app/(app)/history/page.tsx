"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  History, 
  Camera, 
  ChevronRight, 
  Calendar,
  Sparkles,
  ArrowUpRight,
  Loader2,
  Trash2,
  TrendingUp,
  Trophy,
  Target,
  Zap,
  CheckCircle2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Milestone {
  week: number;
  label: string;
  skinScore: number | null;
  hydration: number | null;
  texture: number | null;
  date: string | null;
  status: "recorded" | "interpolated" | "upcoming";
}

export default function HistoryPage() {
  const [scans, setScans] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadHistory() {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      // Try loading real data from skin-twin API
      try {
        const res = await fetch("/api/skin-twin");
        if (res.ok) {
          const json = await res.json();
          if (json.scans && json.scans.length > 0) {
            setScans(json.scans);
            setMilestones(json.milestones || []);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Skin Twin API unavailable, using demo data.");
      }

      // Demo milestone data for premium feel
      const now = Date.now();
      const week = 7 * 24 * 60 * 60 * 1000;
      
      setMilestones([
        { week: 1, label: "Week 1", skinScore: 64, hydration: 52, texture: 48, date: new Date(now - 8 * week).toISOString(), status: "recorded" },
        { week: 2, label: "Week 2", skinScore: 68, hydration: 58, texture: 54, date: new Date(now - 6 * week).toISOString(), status: "recorded" },
        { week: 4, label: "Week 4", skinScore: 74, hydration: 68, texture: 65, date: new Date(now - 4 * week).toISOString(), status: "recorded" },
        { week: 8, label: "Week 8", skinScore: 82, hydration: 78, texture: 76, date: new Date(now - 0 * week).toISOString(), status: "recorded" },
        { week: 12, label: "Week 12", skinScore: null, hydration: null, texture: null, date: null, status: "upcoming" },
      ]);

      setScans([
        { id: "demo-1", created_at: new Date(now - 8 * week).toISOString(), skin_score: 64, hydration_score: 0.52, texture_score: 0.48, body_area: "face" },
        { id: "demo-2", created_at: new Date(now - 7 * week).toISOString(), skin_score: 66, hydration_score: 0.55, texture_score: 0.50, body_area: "face" },
        { id: "demo-3", created_at: new Date(now - 6 * week).toISOString(), skin_score: 68, hydration_score: 0.58, texture_score: 0.54, body_area: "face" },
        { id: "demo-4", created_at: new Date(now - 4 * week).toISOString(), skin_score: 74, hydration_score: 0.68, texture_score: 0.65, body_area: "face" },
        { id: "demo-5", created_at: new Date(now - 2 * week).toISOString(), skin_score: 78, hydration_score: 0.72, texture_score: 0.70, body_area: "face" },
        { id: "demo-6", created_at: new Date(now).toISOString(), skin_score: 82, hydration_score: 0.78, texture_score: 0.76, body_area: "face" },
      ]);
      
      setIsLoading(false);
    }
    loadHistory();
  }, []);

  const firstScore = milestones.find(m => m.skinScore !== null)?.skinScore || 0;
  const latestScore = [...milestones].reverse().find(m => m.skinScore !== null)?.skinScore || 0;
  const improvement = latestScore - firstScore;

  return (
    <div className="p-8 lg:p-12 space-y-12 max-w-7xl mx-auto bg-skin-pearl min-h-screen">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skin-muted/5 text-skin-dark text-[10px] font-black uppercase tracking-widest border border-skin-border/10">
            <History size={12} /> Your Skin Memory
          </div>
          <h1 className="text-4xl lg:text-5xl font-outfit font-black tracking-tight text-skin-dark">Your Glow Journey</h1>
          <p className="text-skin-muted font-medium text-lg max-w-xl opacity-90 text-left">
            Watch your skin transform over time. Every scan tells a story of progress.
          </p>
        </div>
        <div className="flex gap-4">
           <Link href="/scan">
             <Button variant="premium" className="h-14 rounded-2xl px-6 gap-2 shadow-xl shadow-skin-violet/20 font-black">
                <Camera size={18} /> New Scan
             </Button>
           </Link>
        </div>
      </header>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
           <Loader2 className="w-12 h-12 text-skin-violet animate-spin" />
           <p className="font-outfit font-black tracking-tight text-xl text-skin-dark">Loading your journey...</p>
        </div>
      ) : (
        <>
          {/* ==================== PROGRESS TIMELINE ==================== */}
          <section className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-skin-graphite flex items-center justify-center shadow-lg">
                <TrendingUp className="text-skin-pearl w-5 h-5" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-outfit font-black tracking-tight text-skin-dark">Your Progress Timeline</h2>
                <p className="text-sm text-skin-muted font-medium opacity-90">Track your glow evolution week by week</p>
              </div>
              {improvement > 0 && (
                <Badge className="ml-auto bg-skin-glow/10 text-skin-glow border-skin-glow/20 font-black text-sm px-4 py-1.5 rounded-full">
                  +{improvement} points ✨
                </Badge>
              )}
            </div>

            {/* Milestone Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {milestones.map((m, i) => {
                const isUpcoming = m.status === "upcoming";
                const isLatest = !isUpcoming && i === milestones.filter(x => x.skinScore !== null).length - 1;
                const prevScore = i > 0 ? milestones[i - 1]?.skinScore : null;
                const delta = m.skinScore && prevScore ? m.skinScore - prevScore : null;

                return (
                  <motion.div
                    key={m.week}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className={cn(
                      "border-none rounded-[2.5rem] overflow-hidden transition-all h-full",
                      isUpcoming
                        ? "bg-skin-muted/5 border-dashed border-2 border-skin-border/20 shadow-inner"
                        : isLatest
                          ? "bg-gradient-to-br from-skin-graphite to-skin-violet text-skin-pearl shadow-[0_30px_70px_rgba(0,0,0,0.3)]"
                          : "bg-white/5 border border-skin-border/10 shadow-xl shadow-black/5"
                    )}>
                      <CardContent className="p-6 flex flex-col items-center text-center space-y-4 h-full justify-center">
                        {/* Week label */}
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest",
                          isUpcoming ? "text-skin-muted" : isLatest ? "text-skin-pearl/70" : "text-skin-muted"
                        )}>
                          {m.label}
                        </span>

                        {isUpcoming ? (
                          <>
                            <div className="w-16 h-16 rounded-full border-4 border-dashed border-skin-border/30 flex items-center justify-center opacity-50">
                              <Target size={24} className="text-skin-muted" />
                            </div>
                            <p className="text-xs font-bold text-skin-muted opacity-70">Upcoming Goal</p>
                          </>
                        ) : (
                          <>
                            {/* Score circle */}
                            <div className={cn(
                              "w-20 h-20 rounded-full flex items-center justify-center border-4",
                              isLatest
                                ? "border-white/20 bg-white/10"
                                : m.skinScore! >= 75
                                  ? "border-skin-glow/20 bg-skin-glow/10"
                                  : m.skinScore! >= 60
                                    ? "border-skin-gold/20 bg-skin-gold/10"
                                    : "border-skin-muted/20 bg-skin-muted/5"
                            )}>
                              <span className={cn(
                                "text-2xl font-outfit font-black",
                                isLatest ? "text-skin-pearl" : "text-skin-dark"
                              )}>
                                {m.skinScore}
                              </span>
                            </div>

                            {/* Delta */}
                            {delta !== null && delta !== 0 && (
                              <span className={cn(
                                "text-xs font-black flex items-center gap-1",
                                delta > 0
                                  ? isLatest ? "text-skin-glow" : "text-skin-glow"
                                  : isLatest ? "text-skin-rose" : "text-skin-rose"
                              )}>
                                <TrendingUp size={12} className={delta < 0 ? "rotate-180" : ""} />
                                {delta > 0 ? "+" : ""}{delta}
                              </span>
                            )}

                            {/* Date */}
                            {m.date && (
                              <span className={cn(
                                "text-[10px] font-bold",
                                isLatest ? "text-skin-pearl/60" : "text-skin-muted"
                              )}>
                                {new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </span>
                            )}

                            {isLatest && (
                              <Badge className="bg-white/10 text-skin-pearl border-white/10 text-[8px] font-black uppercase tracking-tighter rounded-full">
                                Latest
                              </Badge>
                            )}
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <Card className="border-none bg-white/5 shadow-inner border border-skin-border/5 rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-8 space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy size={16} className="text-skin-gold" />
                    <span className="text-sm font-black text-skin-dark">Journey Progress</span>
                  </div>
                  <span className="text-xs font-bold text-skin-muted">
                    {milestones.filter(m => m.skinScore !== null).length} of {milestones.length} milestones reached
                  </span>
                </div>
                <Progress value={(milestones.filter(m => m.skinScore !== null).length / milestones.length) * 100} className="h-3 bg-skin-muted/10" />
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-skin-muted">
                  {milestones.map((m) => (
                    <span key={m.week} className={cn(
                      m.skinScore !== null ? "text-skin-glow" : "text-skin-muted"
                    )}>
                      {m.skinScore !== null ? "✓" : "○"} Week {m.week}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* ==================== SCAN HISTORY LIST ==================== */}
          <section className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-skin-graphite flex items-center justify-center shadow-lg">
                <Calendar className="text-skin-pearl w-5 h-5" />
              </div>
              <h2 className="text-2xl font-outfit font-black tracking-tight text-skin-dark">All Scans</h2>
              <Badge variant="secondary" className="ml-auto font-bold bg-skin-muted/5 text-skin-dark border-skin-border/10 rounded-full">{scans.length} total</Badge>
            </div>

            {scans.length === 0 ? (
              <div className="py-20 text-center space-y-6">
                 <div className="w-32 h-32 rounded-full border-[10px] border-skin-muted/10 flex items-center justify-center mx-auto opacity-30">
                    <Camera size={48} className="text-skin-muted" />
                 </div>
                 <h3 className="text-2xl font-outfit font-black tracking-tight text-skin-dark">Your Story Begins Here</h3>
                 <p className="text-skin-muted font-medium opacity-90">Take your first scan to start tracking your skin's journey.</p>
                 <Link href="/scan">
                   <Button variant="premium" size="lg" className="rounded-3xl h-16 px-10 font-black shadow-lg shadow-skin-violet/20">
                     <Camera className="mr-2" /> Take First Scan
                   </Button>
                 </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                 {[...scans].reverse().map((scan, i) => (
                   <motion.div
                     key={scan.id}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.05 }}
                   >
                     <Link href={`/scan/${scan.id}`}>
                        <Card className="border-none bg-white/5 border border-skin-border/10 shadow-xl shadow-black/5 rounded-[2.5rem] group hover:bg-white/10 transition-all duration-300">
                           <CardContent className="p-6 flex items-center gap-6">
                              <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center font-black text-skin-pearl text-lg shrink-0 shadow-lg",
                                (scan.skin_score || 0) >= 75 ? "bg-skin-glow" :
                                (scan.skin_score || 0) >= 60 ? "bg-skin-gold" : "bg-skin-muted"
                              )}>
                                {scan.skin_score || '—'}
                              </div>
                              <div className="flex-1 space-y-1 min-w-0 text-left">
                                 <div className="flex items-center gap-3">
                                    <h4 className="font-outfit font-black text-lg capitalize text-skin-dark group-hover:text-skin-violet transition-colors">{scan.body_area || 'Face'} Scan</h4>
                                    <CheckCircle2 size={14} className="text-skin-glow shrink-0" />
                                 </div>
                                 <div className="flex items-center gap-4 text-xs text-skin-muted font-bold opacity-80">
                                    <span className="flex items-center gap-1">
                                      <Calendar size={12} />
                                      {new Date(scan.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </span>
                                 </div>
                              </div>
                              <div className="hidden md:flex gap-8 text-center px-4">
                                <div>
                                  <p className="text-[8px] font-black uppercase tracking-widest text-skin-muted opacity-80 mb-1">Hydration</p>
                                  <p className="text-lg font-black text-skin-dark">{Math.round((scan.hydration_score || 0) * 100)}</p>
                                </div>
                                <div>
                                  <p className="text-[8px] font-black uppercase tracking-widest text-skin-muted opacity-80 mb-1">Texture</p>
                                  <p className="text-lg font-black text-skin-dark">{Math.round((scan.texture_score || 0) * 100)}</p>
                                </div>
                              </div>
                              <div className="w-10 h-10 rounded-full border-2 border-skin-border/20 flex items-center justify-center group-hover:bg-skin-graphite group-hover:border-skin-graphite group-hover:text-skin-pearl transition-all shrink-0">
                                 <ChevronRight size={18} />
                              </div>
                           </CardContent>
                        </Card>
                     </Link>
                   </motion.div>
                 ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
