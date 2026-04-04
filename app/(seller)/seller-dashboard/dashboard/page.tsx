"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Sparkles,
  ArrowUpRight,
  Download,
  Calendar,
  Zap,
  ChevronRight
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

import { cn } from "@/lib/utils";

const performanceData = [
  { name: 'Mon', views: 400, matches: 240, sales: 120 },
  { name: 'Tue', views: 300, matches: 139, sales: 98 },
  { name: 'Wed', views: 200, matches: 980, sales: 390 },
  { name: 'Thu', views: 278, matches: 390, sales: 190 },
  { name: 'Fri', views: 189, matches: 480, sales: 210 },
  { name: 'Sat', views: 239, matches: 380, sales: 250 },
  { name: 'Sun', views: 349, matches: 430, sales: 310 },
];

export default function SellerDashboardPage() {
  return (
    <div className="space-y-12">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-outfit font-black tracking-tight">Brand Insights</h1>
          <p className="text-content-muted font-medium text-lg">
             Monitor your product performance and customer skin intelligence matches.
          </p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="h-12 px-6 rounded-xl font-bold border-2">
              <Calendar className="mr-2 w-4 h-4" /> Last 30 Days
           </Button>
           <Button variant="premium" className="h-12 px-6 rounded-xl font-bold shadow-xl shadow-primary/20">
              <Download className="mr-2 w-4 h-4" /> Export Report
           </Button>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: "Total Views", value: "48.2k", change: "+12.5%", icon: BarChart3, color: "primary" },
           { label: "Matches Found", value: "12,402", change: "+8.2%", icon: Sparkles, color: "secondary" },
           { label: "Direct Sales", value: "$4,290", change: "+24.1%", icon: ShoppingBag, color: "accent" },
           { label: "Repeat Customers", value: "18%", change: "+2.4%", icon: Users, color: "muted" },
         ].map((stat, i) => (
           <Card key={i} className="border-none shadow-xl shadow-black/5 rounded-[2.5rem] bg-white">
              <CardContent className="p-8 space-y-4">
                 <div className={cn(
                   "w-12 h-12 rounded-2xl flex items-center justify-center",
                   stat.color === "primary" ? "bg-muted/50 text-content-primary" :
                   stat.color === "secondary" ? "bg-muted/50 text-content-primary" :
                   stat.color === "accent" ? "bg-muted/50 text-content-primary" : "bg-muted text-content-muted"
                 )}>
                    <stat.icon size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-content-muted">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                       <h3 className="text-3xl font-outfit font-black tracking-tight">{stat.value}</h3>
                       <span className="text-xs font-bold text-green-500">{stat.change}</span>
                    </div>
                 </div>
              </CardContent>
           </Card>
         ))}
      </div>

      {/* Market Intelligence Preview */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-none bg-white shadow-xl rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8 group hover:shadow-2xl transition-all">
          <div className="w-24 h-24 rounded-[2rem] bg-skin-glow/10 border border-skin-glow/20 flex items-center justify-center text-skin-glow shrink-0 animate-pulse">
            <Sparkles size={48} />
          </div>
          <div className="space-y-4 text-center md:text-left">
            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-skin-glow/5 text-skin-glow border-skin-glow/10">Trending Ingredients</Badge>
            <h3 className="text-3xl font-outfit font-black tracking-tight text-skin-dark">Niacinamide Surge</h3>
            <p className="text-skin-muted font-medium text-lg leading-relaxed">
              Customer demand for Niacinamide has increased by <span className="text-skin-glow font-black">42%</span> this week. Consider prioritizing these assets.
            </p>
          </div>
        </Card>

        <Card className="border-none bg-skin-graphite text-skin-pearl shadow-xl rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8 group hover:scale-[1.02] transition-all">
          <div className="w-24 h-24 rounded-[2rem] bg-skin-rose/10 border border-skin-rose/20 flex items-center justify-center text-skin-rose shrink-0">
            <TrendingUp size={48} />
          </div>
          <div className="space-y-4 text-center md:text-left">
            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-white/5 text-skin-rose border-white/10">Active Outbreak Alert</Badge>
            <h3 className="text-3xl font-outfit font-black tracking-tight">Acne Peaks +34%</h3>
            <p className="text-white/60 font-medium text-lg leading-relaxed">
              Predictive AI detects a widespread rise in acne concerns. Match efficacy for clarifying protocols is at an all-time high.
            </p>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-12 gap-8">
         <Card className="lg:col-span-8 border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
            <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
               <div>
                  <CardTitle className="text-2xl font-black font-outfit">Match Efficacy</CardTitle>
                  <CardDescription>Views vs AI Recommendations over time</CardDescription>
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-primary" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-content-muted">Views</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-secondary-foreground" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-content-muted">Matches</span>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-10 pt-6 h-[400px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                     <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorMatches" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                     <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 900, fill: '#888'}} 
                        dy={10}
                     />
                     <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 900, fill: '#888'}}
                     />
                     <Tooltip 
                        contentStyle={{borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)'}}
                     />
                     <Area type="monotone" dataKey="views" stroke="#FF6B6B" strokeWidth={4} fillOpacity={1} fill="url(#colorViews)" />
                     <Area type="monotone" dataKey="matches" stroke="#2D6A4F" strokeWidth={4} fillOpacity={1} fill="url(#colorMatches)" />
                  </AreaChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         <Card className="lg:col-span-4 border-none shadow-2xl rounded-[3rem] bg-[#111] text-content-glass overflow-hidden">
            <CardHeader className="p-10 pb-0">
               <CardTitle className="text-2xl font-black font-outfit">Top Converting Products</CardTitle>
               <CardDescription className="text-content-glass">Highest match-to-sale ratio</CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-6">
               {[
                 { name: "Vit C Glow Serum", category: "Serum", match: 94, trend: "up" },
                 { name: "Barrier Balance", category: "Moisturizer", match: 89, trend: "up" },
                 { name: "Mineral Shield", category: "SPF", match: 82, trend: "down" },
                 { name: "Night Repair Oil", category: "Oil", match: 91, trend: "up" },
               ].map((p, i) => (
                 <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="space-y-1">
                       <h4 className="font-bold text-sm leading-tight">{p.name}</h4>
                       <p className="text-[10px] font-black uppercase tracking-widest text-content-primary">{p.category}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xl font-black font-outfit">{p.match}%</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-content-glass">Match Score</p>
                    </div>
                 </div>
               ))}
               <Link href="/seller/analytics">
                <Button variant="outline" className="w-full h-12 rounded-xl border-white/20 text-content-primary hover:bg-white/10 border-2 mt-4 font-bold">
                    View Full Analytics
                </Button>
               </Link>
            </CardContent>
         </Card>
      </div>

      {/* Action Banner */}
      <section className="pt-8">
         <Card className="border-none bg-primary text-content-glass p-12 rounded-[3.5rem] relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
               <div className="space-y-4 max-w-xl">
                  <h2 className="text-5xl font-outfit font-black tracking-tighter leading-tight">Scale Your Reach with AI.</h2>
                  <p className="text-content-glass text-xl font-medium">
                     Our algorithms are currently matching your products to 4,200+ active users with high efficacy potential.
                  </p>
                  <div className="flex gap-4 pt-4">
                     <Button size="lg" className="bg-white text-primary-foreground hover:bg-white/90 font-black rounded-2xl h-16 px-10">
                        Launch Campaign
                     </Button>
                     <Button size="lg" variant="outline" className="border-white/20 text-content-primary hover:bg-white/10 font-black rounded-2xl h-16 px-10 border-2">
                        View Match Telemetry
                     </Button>
                  </div>
               </div>
               <div className="w-full md:w-1/3 aspect-square bg-white/10 backdrop-blur-xl border border-white/10 rounded-[3rem] flex items-center justify-center">
                  <TrendingUp size={100} className="text-content-glass opacity-40" />
               </div>
            </div>
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-muted/50 rounded-full -ml-32 -mb-32 blur-3xl" />
         </Card>
      </section>
    </div>
  );
}

