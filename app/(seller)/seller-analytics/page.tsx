"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  BarChart3,
  Users,
  Eye,
  ShoppingBag,
  Target,
  ArrowUpRight,
  Leaf,
  Code2,
  Package,
  Settings,
  Copy,
  Zap,
  Sparkles,
  ChevronRight,
  Map,
  Beaker,
  ShieldCheck,
  Download,
  Info,
  Calendar,
  Layers,
  MousePointer2,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

const trendingConcerns = [
  { issue: "Acne Breakouts", growth: "+34%", status: "surge", color: "text-skin-rose" },
  { issue: "Hyperpigmentation", growth: "+21%", status: "rising", color: "text-skin-gold" },
  { issue: "Dry Skin", growth: "+17%", status: "stable", color: "text-skin-glow" },
  { issue: "Rosacea", growth: "+6%", status: "minimal", color: "text-skin-violet" },
];

const ingredientDemand = [
  { name: "Niacinamide", demand: "Critical", score: 94, trend: "up", customers: 4820, color: "text-skin-glow" },
  { name: "Vitamin C", demand: "High", score: 88, trend: "up", customers: 3120, color: "text-skin-gold" },
  { name: "Salicylic Acid", demand: "Medium", score: 62, trend: "stable", customers: 2420, color: "text-skin-rose" },
  { name: "Azelaic Acid", demand: "Growing", score: 54, trend: "up", customers: 1840, color: "text-skin-violet" },
];

const productPerformance = [
  { name: "Brightening Serum v2", efficacy: 34, metric: "PIH Improvement", n: 1240, confidence: "High", color: "text-skin-gold" },
  { name: "Hydrating Cream", efficacy: 27, metric: "Moisture Retention", n: 890, confidence: "Medium", color: "text-skin-glow" },
  { name: "Barrier Balm", efficacy: 41, metric: "TEWL Reduction", n: 540, confidence: "High", color: "text-skin-violet" },
];

const archetypes = [
  { name: "PIH-Prone", percentage: 38, count: 4742, color: "bg-skin-gold" },
  { name: "Barrier-Sensitive", percentage: 26, count: 3245, color: "bg-skin-violet" },
  { name: "Acne-Prone", percentage: 21, count: 2621, color: "bg-skin-rose" },
  { name: "Sebum-Dynamic", percentage: 15, count: 1872, color: "bg-skin-glow" },
];

const regionalData = [
  { region: "West Africa", concern: "Hyperpigmentation", topIngredient: "Niacinamide", volume: "High", color: "text-skin-gold" },
  { region: "North America", concern: "Barrier Damage", topIngredient: "Ceramides", volume: "High", color: "text-skin-violet" },
  { region: "East Asia", concern: "Sensitivity", topIngredient: "Cica", volume: "Moderate", color: "text-skin-glow" },
];

export default function SellerAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/seller/analytics');
        const stats = await res.json();
        setData(stats);
      } catch (e) {
        console.error("Failed to load seller stats", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const statsCards = [
    { label: "Total Skin Matches", value: data?.global?.totalMatches || "...", icon: Target, trend: "+12%", color: "text-skin-violet" },
    { label: "Top Skin Concern", value: data?.global?.topConcern || "...", icon: Sparkles, trend: "34% Surge", color: "text-skin-gold" },
    { label: "Best Ingredient", value: data?.global?.topIngredient || "...", icon: Beaker, trend: "High Demand", color: "text-skin-glow" },
    { label: "Active Protocols", value: data?.global?.activeProtocols || "...", icon: Package, trend: "Protocol v4.2", color: "text-skin-rose" },
  ];

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-skin-violet animate-pulse shadow-[0_0_10px_rgba(124,108,255,0.5)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-skin-muted opacity-60">Brand Intelligence Engine</span>
          </div>
          <h1 className="text-4xl font-outfit font-black tracking-tight text-white">Vendor Intelligence</h1>
          <p className="text-white/40 font-medium text-lg leading-relaxed max-w-xl">
            Real-time market mapping and biological performance telemetrics for elite cosmetic R&D.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-2xl h-12 px-6 font-bold flex items-center gap-2">
            <Calendar size={18} /> Last 30 Days
          </Button>
          <Button className="bg-skin-violet text-white hover:bg-skin-violet/90 rounded-2xl h-12 px-6 font-bold flex items-center gap-2 shadow-xl shadow-skin-violet/20">
            <Download size={18} /> Export Intel
          </Button>
        </div>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, i) => (
          <Card key={i} className="border-none bg-[#0B1020] rounded-[2rem] p-8 shadow-2xl border border-white/5 group hover:border-skin-violet/20 transition-all duration-500">
            <CardContent className="p-0 space-y-6">
              <div className="flex items-center justify-between">
                <div className={cn("w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center", stat.color)}>
                  <stat.icon size={24} />
                </div>
                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-[0.1em] border-white/10 text-white/40">
                  {stat.trend}
                </Badge>
              </div>
              <div>
                <p className="text-4xl font-outfit font-black text-white tracking-tighter">
                  {isLoading ? <span className="animate-pulse">...</span> : stat.value}
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mt-1">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 border-none bg-[#0B1020] rounded-[3rem] p-10 border border-white/5">
          <CardHeader className="p-0 pb-8 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-skin-rose/10 text-skin-rose">
                <TrendingUp size={20} />
              </div>
              <CardTitle className="text-xl font-outfit font-black text-white">Market Intelligence</CardTitle>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Trending Skin Concerns</p>
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            {trendingConcerns.map((trend, i) => (
              <div key={i} className="flex items-center justify-between p-5 rounded-[1.5rem] bg-white/[0.02] border border-white/5 group hover:bg-white/[0.05] transition-all">
                <div className="space-y-1">
                  <h4 className="font-bold text-white/90">{trend.issue}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">{trend.status}</p>
                </div>
                <div className={cn("text-xl font-black", trend.color)}>
                  {trend.growth}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none bg-[#0B1020] rounded-[3rem] p-10 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5"><Beaker size={120} /></div>
          <CardHeader className="p-0 pb-10 space-y-2 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-skin-glow/10 text-skin-glow"><Layers size={20} /></div>
              <CardTitle className="text-xl font-outfit font-black text-white">Ingredient Demand Intelligence</CardTitle>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Semantic Mapping of Active Interests</p>
          </CardHeader>
          <CardContent className="p-0 space-y-8 relative z-10">
            <div className="grid sm:grid-cols-2 gap-6">
              {ingredientDemand.map((ing, i) => (
                <div key={i} className="space-y-4 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-skin-glow/20 transition-all group">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={cn("px-3 py-1 text-[9px] font-black uppercase tracking-widest border-none bg-white/5", ing.color)}>
                      {ing.demand} Demand
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-outfit font-black text-white tracking-tight">{ing.name}</h4>
                    <p className="text-[9px] font-black uppercase tracking-[0.1em] text-white/20">{ing.customers} Scans</p>
                  </div>
                  <Progress value={ing.score} className="h-1.5 rounded-full bg-white/5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none bg-[#111] rounded-[3.5rem] p-12 border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:scale-110 transition-transform duration-1000 rotate-12"><ShieldCheck size={200} /></div>
        <CardHeader className="p-0 pb-12 space-y-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-skin-gold/10 text-skin-gold border border-skin-gold/20 shadow-inner"><Leaf size={28} /></div>
            <div className="space-y-1">
              <CardTitle className="text-4xl font-outfit font-black text-white tracking-tight">Product Performance Intelligence (PPI)</CardTitle>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Real-World Biological Efficacy Mapping</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 grid lg:grid-cols-3 gap-8 relative z-10">
          {productPerformance.map((prod, i) => (
            <div key={i} className="flex flex-col justify-between p-10 rounded-[3rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] transition-all">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-2xl font-outfit font-black text-white leading-tight">{prod.name}</h4>
                  <div className={cn("p-2 rounded-xl bg-white/5", prod.color)}><TrendingUp size={18} /></div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{prod.metric}</p>
                  <span className={cn("text-6xl font-outfit font-black tracking-tighter italic", prod.color)}>{prod.efficacy}%</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
