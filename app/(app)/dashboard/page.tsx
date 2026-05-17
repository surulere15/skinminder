"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  ArrowUpRight,
  Calendar,
  Activity,
  Scan,
  Brain,
  Zap,
  CloudRain, 
  Sun as SunIcon, 
  Wind,
  AlertTriangle
} from "lucide-react";
import { PremiumCard } from "@/components/ui/premium-card";
import { SkinRadar } from "@/components/dashboard/skin-radar";
import Link from "next/link";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
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

      const { data: scansData } = await supabase
        .from("skin_scans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(6);

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
    <div className="p-8 lg:p-16 space-y-16 max-w-7xl mx-auto bg-transparent min-h-full text-white relative">
      
      {/* Header Section: Clinical Command Center */}
      <header className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-10 pb-16 border-b border-white/5 relative z-10">
        <div className="space-y-6 text-left flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 shadow-glow italic">
              <ShieldCheck size={14} /> Verified Clinical Identity
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-glow italic">
              <Brain size={14} /> Neural Analysis Engine Active
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-5xl lg:text-7xl text-diagnostic leading-none">
              Intelligence<br />
              <span className="text-primary">Command Deck.</span>
            </h1>
            <p className="text-lg font-medium text-white/50 border-l-2 border-primary/30 pl-6 h-fit py-1">
              Subject ID: <span className="text-white font-black italic uppercase tracking-tighter">{user?.email?.split('@')[0] || "SAM-428"}</span> • Status: <span className="text-emerald-400 font-black italic uppercase tracking-tighter">Molecular Stability Confirmed</span>
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-5 w-full xl:w-auto shrink-0">
          <Link href="/scan/new" className="flex-1 sm:flex-initial">
            <Button variant="flagship" className="h-20 px-14 shadow-glow group w-full text-sm">
              <Scan className="mr-3 w-6 h-6 group-hover:rotate-90 transition-transform duration-700" /> Start Analysis Sequence
            </Button>
          </Link>
          <Link href="/routine" className="flex-1 sm:flex-initial">
            <Button variant="clinical-ghost" className="h-20 px-12 w-full text-sm">
              Protocol Manual
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Intelligence Grid */}
      <div className="grid lg:grid-cols-4 gap-12 relative z-10 items-start">
        {/* Radar Map - Large Diagnostic Widget */}
        <div className="lg:col-span-3">
           <PremiumCard variant="master" className="p-10 border-white/5 overflow-hidden">
              <div className="flex items-center justify-between mb-10 overflow-hidden">
                <div className="space-y-1">
                   <h3 className="text-2xl text-diagnostic">Dermal Spectral Map</h3>
                   <p className="text-label text-primary/60">5-Dimensional biomarker distribution</p>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-5 py-2 rounded-full border border-primary/20 shadow-glow italic">
                   <Activity size={14} className="animate-pulse" /> Live Diagnostic Sync
                </div>
              </div>
              <div className="relative py-4">
                <SkinRadar />
              </div>
              {/* Technical Readout Footer */}
              <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap gap-8">
                 {[
                   { label: "Confidence", val: "98.4%", color: "text-emerald-400" },
                   { label: "Stability", val: "Optimal", color: "text-primary" },
                   { label: "Last Analysis", val: stats.lastScanDate ? format(new Date(stats.lastScanDate), "HH:mm 'UTC'") : "No Data", color: "text-white/40" }
                 ].map(stat => (
                   <div key={stat.label} className="space-y-1">
                     <p className="text-[9px] font-black uppercase tracking-[0.1em] text-white/20">{stat.label}</p>
                     <p className={`text-sm font-black italic uppercase tracking-widest ${stat.color}`}>{stat.val}</p>
                   </div>
                 ))}
              </div>
           </PremiumCard>
        </div>

        {/* Environmental Intelligence - Side Pillar */}
        <div className="space-y-8">
           <div className="space-y-6">
              <h3 className="text-label ml-2">External Environment Intelligence</h3>
              
              <div className="space-y-5">
                 {[
                   { label: "Humidity", value: "62%", icon: CloudRain, color: "text-primary", desc: "Optimal: 40-70%" },
                   { label: "UV Index", value: "4.2", icon: SunIcon, color: "text-orange-400", desc: "Wear SPF 30+" },
                   { label: "Pollution", value: "Excellent", icon: Wind, color: "text-emerald-400", desc: "AQI: 32" }
                 ].map((env) => (
                   <PremiumCard key={env.label} variant="elevated" className="p-6 border-white/5 group hover:border-primary/20 transition-all duration-500">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center ${env.color} group-hover:scale-110 transition-transform`}>
                           <env.icon size={22} />
                        </div>
                        <span className="text-2xl font-black italic text-white tracking-widest">{env.value}</span>
                      </div>
                      <p className="text-label text-white/30">{env.label}</p>
                      <p className="text-[10px] font-bold italic text-white/60 mt-1 uppercase tracking-tighter">{env.desc}</p>
                   </PremiumCard>
                 ))}
              </div>

              <PremiumCard variant="elevated" className="p-6 border-primary/20 bg-primary/5">
                 <div className="flex gap-4">
                    <AlertTriangle size={20} className="text-primary shrink-0" />
                    <p className="text-xs font-bold italic text-primary/70 leading-relaxed uppercase tracking-tighter">
                       Atmospheric shift detected. Adjust hydration layer to lighter humectants within 2 hours.
                    </p>
                 </div>
              </PremiumCard>
           </div>
        </div>
      </div>

      {/* Analysis History - Clinical Dataset Grid */}
      <section className="space-y-10 relative z-10 pb-20">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl text-diagnostic">Analysis History</h2>
            <div className="h-[1px] w-48 bg-white/5 hidden md:block" />
          </div>
          <Link href="/progress">
            <Button variant="clinical-ghost" className="h-12 px-8">Full Clinical Analytics</Button>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {scans.length > 0 ? (
            scans.map((scan) => (
              <PremiumCard key={scan.id} variant="elevated" className="p-0 border-white/5 group hover:border-primary/30 transition-all duration-700">
                <div className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic">
                      <Calendar size={14} className="text-primary/40" /> {format(new Date(scan.created_at), "MMM d, yyyy")}
                    </div>
                    <div className="text-3xl text-diagnostic text-primary group-hover:scale-110 transition-transform">{scan.skin_score || 0}</div>
                  </div>
                  
                  <div className="flex gap-6 items-center">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-black border border-white/10 flex-shrink-0 shadow-elite group-hover:border-primary/40 transition-colors">
                      <img src={scan.image_url} alt="Scan" className="w-full h-full object-cover grayscale brightness-125 opacity-80" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-lg text-diagnostic text-white truncate">{scan.body_area} Mapping</h4>
                      <p className="text-[10px] font-black text-primary/50 uppercase tracking-[0.1em] italic truncate">
                        {scan.primary_concerns?.join(" • ") || "Normal Profile"}
                      </p>
                    </div>
                  </div>
                  
                  <Link href={`/scan/${scan.id}`} className="block pt-2">
                     <Button variant="clinical-ghost" className="w-full h-12 flex gap-3 group-hover:bg-primary group-hover:text-black transition-all">
                        Extract Dataset <ArrowUpRight size={16} />
                     </Button>
                  </Link>
                </div>
              </PremiumCard>
            ))
          ) : (
            <PremiumCard variant="master" className="col-span-full py-24 text-center">
               <div className="max-w-md mx-auto space-y-8">
                  <div className="w-24 h-24 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto shadow-glow">
                     <Scan size={44} className="text-primary" />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-4xl text-diagnostic">Profile Dataset Empty</h4>
                    <p className="text-lg text-white/40 font-medium leading-relaxed">
                       Your clinical record is pending initialization. Execute your first scan sequence to begin biological intelligence mapping.
                    </p>
                  </div>
                  <Link href="/scan/new">
                    <Button variant="flagship" className="h-16 px-12 text-sm">Initialize First Sequence</Button>
                  </Link>
               </div>
            </PremiumCard>
          )}
        </div>
      </section>
    </div>
  );
}
