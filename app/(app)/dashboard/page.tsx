"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Camera,
  ArrowUpRight,
  Calendar,
  Droplets,
  Layers,
  Activity,
  Scan,
  TrendingUp,
  Dna,
  Sparkles,
  Brain,
  UserCheck,
  Heart,
  ChevronRight,
  Zap,
  Lock
} from "lucide-react";
import { PremiumCard } from "@/components/ui/premium-card";
import { AIBrain } from "@/components/ui/ai-brain";
import { OrbitContainer } from "@/components/ui/orbit-container";
import { ClimateWidget } from "@/components/ui/climate-widget";
import { FloatingCards } from "@/components/ui/floating-cards";
import { Particles } from "@/components/ui/particles";
import { SkinRadar } from "@/components/dashboard/skin-radar";
import { 
  CloudRain, 
  Sun as SunIcon, 
  Wind,
  AlertTriangle,
  Info
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [scans, setScans] = useState<any[]>([]);
  const [stats, setStats] = useState({
    avgScore: 0,
    scanCount: 0,
    lastScanDate: null as string | null,
  });
  const supabase = createClient();

  useEffect(() => {
    async function loadDashboardData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      // Fetch Profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profile);

      // Fetch Scans
      const { data: scansData } = await supabase
        .from("skin_scans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      setScans(scansData || []);

      if (scansData && scansData.length > 0) {
        const totalScore = scansData.reduce((acc, s) => acc + (s.skin_score || 0), 0);
        setStats({
          avgScore: Math.round(totalScore / scansData.length),
          scanCount: scansData.length,
          lastScanDate: scansData[0].created_at,
        });
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="p-8 lg:p-12 space-y-12 relative overflow-hidden min-h-screen bg-background text-content-primary">
      {/* Platform Environment - Stable and Clean */}

      {/* Header Section */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-white/5 relative z-10">
        <div className="space-y-4 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
              <ShieldCheck size={14} /> Verified Clinical Identity
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10">
              <Brain size={14} /> Predictive Modeling Active
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-content-primary">
              AI Skin Intelligence<br />
              <span className="text-primary">Platform.</span>
            </h1>
            <p className="text-xl font-medium text-content-secondary">
              Diagnostic Identity: <span className="text-content-primary font-bold">Sam</span> • Biological Status: <span className="text-content-primary font-bold">Stable</span>
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Link href="/scan/new">
            <Button variant="clinical" size="lg" className="h-14 px-10 shadow-xl shadow-primary/20 group w-full sm:w-auto">
              <Scan className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform" /> Start New Scan
            </Button>
          </Link>
          <Button variant="clinical-ghost" size="lg" className="h-14 px-8 w-full sm:w-auto">
            View Protocol
          </Button>
        </div>
      </header>

      {/* Main Intelligence Grid */}
      <div className="grid lg:grid-cols-4 gap-8 relative z-10 items-start">
        {/* Radar Map - Primary Clinical Interface */}
        <div className="lg:col-span-3 space-y-6">
           <PremiumCard className="bg-skin-surface border border-white/5 rounded-3xl overflow-hidden p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                   <h3 className="text-xl font-semibold text-content-primary">Dermal Analysis Map</h3>
                   <p className="text-sm text-content-secondary font-medium mt-1">5-dimensional biological marker distribution</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                   <Activity size={12} /> Live Sync
                </div>
              </div>
              <SkinRadar />
           </PremiumCard>
        </div>

        {/* Environmental Intelligence - Right Panel */}
        <div className="space-y-6">
           <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-content-muted ml-2">Environmental Intelligence</h3>
              
              <div className="space-y-4">
                 {[
                   { label: "Humidity", value: "62%", icon: CloudRain, color: "text-primary", desc: "Optimal Range: 40-70%" },
                   { label: "UV Index", value: "4.2", icon: SunIcon, color: "text-amber-400", desc: "Medium: Wear SPF 30+" },
                   { label: "Pollution", value: "32", icon: Wind, color: "text-emerald-400", desc: "AQI: Excellent" }
                 ].map((env) => (
                   <Card key={env.label} className="bg-skin-surface border border-white/5 rounded-2xl p-5 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-xl bg-background border border-white/5 ${env.color}`}>
                           <env.icon size={18} />
                        </div>
                        <span className="text-xl font-semibold text-content-primary">{env.value}</span>
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-content-secondary">{env.label}</p>
                      <p className="text-[10px] font-medium text-content-muted mt-1">{env.desc}</p>
                   </Card>
                 ))}
              </div>

              <Card className="bg-primary/5 border border-primary/10 rounded-2xl p-4">
                 <div className="flex gap-3">
                    <AlertTriangle size={16} className="text-primary flex-shrink-0" />
                    <p className="text-xs font-medium text-content-secondary leading-tight">
                       High humidity detected. Adjust routine to use lighter humectants today.
                    </p>
                 </div>
              </Card>
           </div>
        </div>
      </div>

      {/* Scan History - Bottom Panel */}
      <section className="space-y-6 relative z-10 pb-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-content-primary">Clinical History</h2>
          <Link href="/progress">
            <Button variant="ghost" className="text-primary font-bold hover:bg-white/5">View Full Analytics</Button>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scans.length > 0 ? (
            scans.map((scan) => (
              <Card key={scan.id} className="bg-skin-surface border border-white/5 rounded-2xl overflow-hidden hover:bg-white/[0.02] transition-colors group">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-content-muted">
                      <Calendar size={12} /> {format(new Date(scan.created_at), "MMM d, yyyy")}
                    </div>
                    <div className="text-2xl font-bold text-primary">{scan.skin_score || 0}</div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-background border border-white/5 flex-shrink-0">
                      <img src={scan.image_url} alt="Scan" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold capitalize text-content-primary truncate">Analysis for {scan.body_area}</h4>
                      <p className="text-xs text-content-secondary mt-1 line-clamp-2">
                        {scan.primary_concerns?.join(", ") || "No concerns noted"}
                      </p>
                    </div>
                  </div>
                  
                  <Link href={`/scan/${scan.id}`} className="block">
                     <Button variant="clinical-ghost" className="w-full h-10 text-xs gap-2 group-hover:bg-primary group-hover:text-white transition-all">
                        Open Dataset <ArrowUpRight size={14} />
                     </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full bg-skin-surface border-dashed border border-white/10 rounded-3xl p-16 text-center">
               <div className="max-w-xs mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto">
                     <Scan className="text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold text-content-primary">Protocol Pending</h4>
                  <p className="text-sm text-content-secondary font-medium leading-relaxed">
                     Your clinical history is empty. Start your first scan to begin dermal intelligence tracking.
                  </p>
                  <Link href="/scan/new">
                    <Button variant="clinical" className="mt-2">Start First Scan</Button>
                  </Link>
               </div>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
