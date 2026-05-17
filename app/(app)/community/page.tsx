"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

const CLIMATE_TILES = [
  { icon: Sun, label: "UV Index", value: "Moderate (4)", recommendation: "Requires SPF 30+" },
  { icon: CloudRain, label: "Humidity", value: "High (82%)", recommendation: "Layer lightweight gels" },
  { icon: Wind, label: "Pollution", value: "Urban Low", recommendation: "Double cleanse nightly" },
];

const CONCERN_POPULARITY = [
  { name: "Hydration", value: 45 },
  { name: "Texture", value: 25 },
  { name: "Pigment", value: 20 },
  { name: "Sensitivity", value: 10 },
];

export default function CommunityPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCommunityStats() {
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
         <p className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-[#c9a96e] animate-pulse italic">Gathering Global Intelligence Matrix...</p>
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
        <header className="space-y-4 pb-8 border-b border-white/5 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/20 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#c9a96e]/5">
              <Globe size={14} className="text-[#c9a96e]" /> Global Intelligence Matrix
            </div>
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-white uppercase italic leading-none">Community Insights</h1>
            <p className="text-white/50 font-medium text-lg max-w-2xl border-l-2 border-[#c9a96e]/30 pl-6 py-1">
              Compare your skin intelligence to the world. Powered by anonymized aggregate data across the global dermal network.
            </p>
          </div>
          <Button variant="flagship" className="h-16 px-10 shadow-2xl shadow-[#c9a96e]/10">
             <Share2 className="mr-3 w-5 h-5" /> Share My Rank
          </Button>
        </header>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { label: "Active Monitors", value: stats.activeUsers, icon: Users },
             { label: "Analyses Syncing", value: stats.totalScans, icon: TrendingUp },
             { label: "Active Hub", value: stats.topCity, icon: MapPin },
             { label: "Avg. Global Score", value: stats.averageScore, icon: Sparkles },
           ].map((stat, i) => (
             <Card key={i} className="border-white/10 bg-white/[0.03] backdrop-blur-3xl shadow-2xl rounded-[2.5rem] overflow-hidden group hover:bg-white/[0.05] transition-all">
                <CardContent className="p-10 flex items-center gap-6">
                   <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-[#c9a96e] shadow-xl group-hover:scale-110 transition-transform">
                      <stat.icon size={28} />
                   </div>
                   <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">{stat.label}</p>
                      <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">{stat.value}</h3>
                   </div>
                </CardContent>
             </Card>
           ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
           {/* Environmental Factors */}
           <Card className="lg:col-span-8 border-white/10 bg-white/[0.03] backdrop-blur-3xl shadow-2xl rounded-[4rem] overflow-hidden group">
              <CardHeader className="p-12 md:p-16 pb-0 space-y-4 text-left">
                 <CardTitle className="text-3xl font-black text-white uppercase italic tracking-tight">Local Bio-Environment</CardTitle>
                 <CardDescription className="text-white/40 font-medium italic border-l border-[#c9a96e]/20 pl-6">Real-time climate factors influencing your skin in {stats.topCity}</CardDescription>
              </CardHeader>
              <CardContent className="p-12 md:p-16 space-y-12">
                 <div className="grid md:grid-cols-3 gap-8">
                    {CLIMATE_TILES.map((tile, i) => (
                      <div key={i} className="p-8 rounded-[2.5rem] bg-black/40 border border-white/5 space-y-6 hover:border-[#c9a96e]/30 transition-all shadow-inner group/tile">
                         <div className="w-12 h-12 rounded-2xl bg-[#c9a96e]/5 border border-[#c9a96e]/20 flex items-center justify-center text-[#c9a96e] group-hover/tile:scale-110 transition-transform">
                            <tile.icon size={24} />
                         </div>
                         <div className="space-y-1 text-left">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">{tile.label}</p>
                            <h4 className="text-xl font-black text-white italic">{tile.value}</h4>
                         </div>
                         <div className="text-left">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#c9a96e]/60 leading-tight px-3 py-1.5 bg-[#c9a96e]/5 rounded-full border border-[#c9a96e]/10 inline-block font-sans">
                               {tile.recommendation}
                            </p>
                         </div>
                      </div>
                    ))}
                 </div>
                 <div className="p-10 rounded-[3rem] bg-black border border-[#c9a96e]/20 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a96e]/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 w-full text-left font-sans">
                       <div className="space-y-4 max-w-md">
                          <h4 className="text-2xl font-black text-[#c9a96e] uppercase italic tracking-tight">Adaptive Protocol</h4>
                          <p className="text-white/50 text-base font-medium leading-relaxed italic border-l border-white/5 pl-8">
                             "Integrate <b>Niacinamide</b> to stabilize sebum and <b>Ceramides</b> to lock in moisture against {stats.topCity} humidity spikes."
                          </p>
                       </div>
                       <Button className="clinical-btn h-16 px-10 shadow-2xl">
                          Sync Local Protocol <ChevronRight className="ml-2" />
                       </Button>
                    </div>
                 </div>
              </CardContent>
           </Card>

           {/* Global Concerns Chart */}
           <Card className="lg:col-span-4 border-white/10 bg-white/[0.03] backdrop-blur-3xl shadow-2xl rounded-[4rem] overflow-hidden text-left">
              <CardHeader className="p-10 md:p-12 pb-0">
                 <CardTitle className="text-3xl font-black text-white uppercase italic tracking-tight">Trend Radar</CardTitle>
                 <CardDescription className="text-white/20 font-black uppercase tracking-widest text-[10px] mt-2">Top dermal concerns trending globally</CardDescription>
              </CardHeader>
              <CardContent className="p-10 h-[400px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={CONCERN_POPULARITY}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={100}
                          paddingAngle={8}
                          dataKey="value"
                          stroke="none"
                       >
                          {CONCERN_POPULARITY.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={index === 0 ? "#c9a96e" : index === 1 ? "#10b981" : index === 2 ? "#ffffff" : "#3f3f46"} />
                          ))}
                       </Pie>
                       <Tooltip 
                          contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff' }}
                          itemStyle={{ color: '#c9a96e' }}
                       />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-white/5 mx-4">
                    {CONCERN_POPULARITY.map((c, i) => (
                      <div key={c.name} className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: i === 0 ? "#c9a96e" : i === 1 ? "#10b981" : i === 2 ? "#ffffff" : "#3f3f46" }} />
                         <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{c.name}</span>
                      </div>
                    ))}
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Community Ranking Banner */}
        <section className="pt-12 pb-24">
           <Card className="border-[#c9a96e]/20 bg-black p-12 lg:p-24 rounded-[5rem] relative overflow-hidden shadow-2xl shadow-[#c9a96e]/10 group">
              <div className="absolute inset-0 bg-gradient-to-br from-black via-[#c9a96e]/5 to-black pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16 w-full text-left">
              <div className="space-y-10 max-w-2xl">
                 <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/30 text-[10px] font-black uppercase tracking-widest shadow-lg">
                    <Star size={14} className="fill-[#c9a96e]" /> Community Vanguard
                 </div>
                 <h2 className="text-6xl lg:text-9xl font-black tracking-tighter leading-[0.8] text-white uppercase italic">
                    Top 2% <br /> Globally.
                 </h2>
                 <p className="text-white/40 text-2xl font-medium leading-relaxed italic border-l-2 border-[#c9a96e]/30 pl-10 py-2">
                    Your skin score of 95% indicates elite biological maintenance. You have officially ascended to <b>Glow Resilient</b> status.
                 </p>
                 <Link href="/referrals">
                   <Button variant="flagship" className="h-20 px-16 shadow-2xl shadow-[#c9a96e]/20">
                      Invite to Elite Access <ArrowUpRight className="ml-3" />
                   </Button>
                 </Link>
              </div>
              <div className="w-96 h-96 rounded-[4rem] bg-white/[0.03] backdrop-blur-3xl border border-white/10 flex flex-col items-center justify-center text-white relative shadow-2xl group-hover:bg-white/[0.05] transition-all duration-700">
                 <Sparkles size={120} className="text-[#c9a96e] mb-6 opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700" />
                 <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-[#c9a96e] flex items-center justify-center text-black font-black text-3xl shadow-2xl rotate-12 group-hover:rotate-0 transition-transform">95</div>
                 <p className="font-black text-4xl uppercase italic tracking-tighter leading-none">Glow Rank</p>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c9a96e]/60 mt-3">Elite Tier 01</p>
              </div>
              </div>
           </Card>
        </section>
      </div>
    </div>
  );
}
