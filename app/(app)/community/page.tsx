"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  MapPin, 
  TrendingUp, 
  Sparkles, 
  CloudRain, 
  Sun, 
  Wind,
  Globe,
  Share2,
  ChevronRight,
  ArrowUpRight,
  Loader2,
  Star
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const CLIMATE_TILES = [
  { icon: Sun, label: "UV Index", value: "Moderate (4)", recommendation: "Requires SPF 30+" },
  { icon: CloudRain, label: "Humidity", value: "High (82%)", recommendation: "Layer lightweight gels" },
  { icon: Wind, label: "Pollution", value: "Urban Low", recommendation: "Double cleanse nightly" },
];

const CONCERN_POPULARITY = [
  { name: "Hydration", value: 45, color: "#FF6B6B" },
  { name: "Texture", value: 25, color: "#2D6A4F" },
  { name: "Pigment", value: 20, color: "#FFA500" },
  { name: "Sensitivity", value: 10, color: "#4A90E2" },
];

export default function CommunityPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadCommunityStats() {
      // In a real app, fetch from community_stats table
      setTimeout(() => {
        setStats({
          activeUsers: "15,204",
          totalScans: "142.5k",
          topCity: "London, UK",
          averageScore: "74%"
        });
        setIsLoading(false);
      }, 1500);
    }
    loadCommunityStats();
  }, []);

  if (isLoading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[60vh]">
         <Loader2 className="w-12 h-12 text-content-secondary animate-spin mb-4" />
         <p className="font-outfit font-black tracking-tight">Gathering Global Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 space-y-12 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 text-content-primary text-[10px] font-black uppercase tracking-widest">
            <Globe size={12} /> Global Intelligence
          </div>
          <h1 className="text-4xl lg:text-5xl font-outfit font-black tracking-tight">Community Insights</h1>
          <p className="text-content-muted font-medium text-lg max-w-2xl">
            See how your skin intelligence compares to the world. Powered by anonymized aggregate data across 50+ countries.
          </p>
        </div>
        <Button variant="premium" className="rounded-2xl h-14 px-8 font-black shadow-xl">
           <Share2 className="mr-2 w-5 h-5" /> Share My Rank
        </Button>
      </header>

      {/* Global Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: "Active Monitors", value: stats.activeUsers, icon: Users, color: "secondary" },
           { label: "Analyses Performed", value: stats.totalScans, icon: TrendingUp, color: "primary" },
           { label: "Active Hub", value: stats.topCity, icon: MapPin, color: "accent" },
           { label: "Avg. Global Score", value: stats.averageScore, icon: Sparkles, color: "muted" },
         ].map((stat, i) => (
           <Card key={i} className="border-none shadow-xl shadow-black/5 rounded-[2.5rem] bg-white">
              <CardContent className="p-8 flex items-center gap-6">
                 <div className={cn(
                   "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                   stat.color === "primary" ? "bg-muted/50 text-content-primary" :
                   stat.color === "secondary" ? "bg-muted/50 text-content-primary" :
                   stat.color === "accent" ? "bg-muted/50 text-content-primary" : "bg-muted text-content-muted"
                 )}>
                    <stat.icon size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-content-muted leading-none mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-outfit font-black tracking-tight">{stat.value}</h3>
                 </div>
              </CardContent>
           </Card>
         ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
         {/* Environmental Factors */}
         <Card className="lg:col-span-8 border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
            <CardHeader className="p-10 pb-0">
               <CardTitle className="text-2xl font-black font-outfit">Local Bio-Environment</CardTitle>
               <CardDescription>Real-time climate factors influencing your skin in {stats.topCity}</CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
               <div className="grid md:grid-cols-3 gap-6">
                  {CLIMATE_TILES.map((tile, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-muted/30 border border-muted/50 space-y-4 hover:scale-[1.02] transition-transform">
                       <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary-foreground">
                          <tile.icon size={20} />
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-content-muted">{tile.label}</p>
                          <h4 className="text-xl font-outfit font-black">{tile.value}</h4>
                       </div>
                       <p className="text-[10px] font-bold text-content-primary leading-tight px-3 py-1 bg-muted/50 rounded-full w-fit">
                          {tile.recommendation}
                       </p>
                    </div>
                  ))}
               </div>
               <div className="p-8 rounded-[2rem] bg-black text-content-glass relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#333] pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 w-full">
                     <div className="space-y-2 max-w-md">
                        <h4 className="text-xl font-outfit font-black tracking-tight uppercase">Adaptive Recommendation</h4>
                        <p className="text-content-glass text-sm font-medium">
                           Based on today's high UV and humidity, we suggest integrating <b>Niacinamide</b> to stabilize sebum and <b>Ceramides</b> to lock in moisture.
                        </p>
                     </div>
                     <Button className="bg-white text-content-primary hover:bg-white/90 font-black rounded-xl h-12">
                        Sync Local Protocol
                     </Button>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Global Concerns Chart */}
         <Card className="lg:col-span-4 border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
            <CardHeader className="p-10 pb-0">
               <CardTitle className="text-2xl font-black font-outfit">Trend Radar</CardTitle>
               <CardDescription>Top concerns trending this week</CardDescription>
            </CardHeader>
            <CardContent className="p-10 h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={CONCERN_POPULARITY}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                     >
                        {CONCERN_POPULARITY.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                     </Pie>
                     <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
               <div className="flex flex-wrap justify-center gap-4 pt-4">
                  {CONCERN_POPULARITY.map(c => (
                    <div key={c.name} className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                       <span className="text-[10px] font-black uppercase tracking-widest text-content-muted">{c.name}</span>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>
      </div>

      {/* Community Ranking Banner */}
      <section className="pt-8 pb-20">
         <Card className="border-none bg-zinc-950 text-content-glass p-12 rounded-[4rem] relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 w-full">
            <div className="space-y-6 max-w-xl">
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-content-primary">
                  <Star size={12} className="fill-white" /> Community Star
               </div>
               <h2 className="text-5xl lg:text-7xl font-outfit font-black tracking-tighter leading-[0.9] text-content-glass">
                  Top 2% <br /> Globally.
               </h2>
               <p className="text-content-glass text-xl font-medium">
                  Your skin score of 94% puts you in the elite tier of monitors globally. You've earned the <b>Glow Resilient</b> badge.
               </p>
               <Link href="/referrals">
                 <Button size="lg" className="bg-white text-primary-foreground hover:bg-white/90 font-black rounded-3xl h-16 px-10 shadow-xl">
                    Invite Others to the Elite <ArrowUpRight className="ml-2" />
                 </Button>
               </Link>
            </div>
            <div className="w-72 h-72 rounded-[3.5rem] bg-white/10 backdrop-blur-xl border border-white/20 flex flex-col items-center justify-center text-content-primary relative">
               <Sparkles size={80} className="mb-4 opacity-40 animate-pulse" />
               <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-content-primary font-black text-xs shadow-lg">94</div>
               <p className="font-outfit font-black text-2xl">Glow Rank</p>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Elite Monitor</p>
            </div>
            </div>
         </Card>
      </section>
    </div>
  );
}
