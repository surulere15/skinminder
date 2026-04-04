"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Sun,
  Moon,
  Clock,
  Heart,
  ShoppingBag,
  Loader2,
  Star,
  ChevronRight,
  Zap,
  Shield,
  Droplets,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const categoryIcons: Record<string, React.ReactNode> = {
  Cleanser: <Droplets size={20} className="text-skin-violet" />,
  Serum: <Zap size={20} className="text-skin-glow" />,
  Moisturizer: <Heart size={20} className="text-skin-rose" />,
  SPF: <Shield size={20} className="text-skin-gold" />,
  Treatment: <Star size={20} className="text-skin-violet" />,
  Mask: <Sparkles size={20} className="text-skin-gold" />,
};

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [routineNote, setRoutineNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRecommendations() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skinType: "combination",
            concerns: ["texture", "hydration", "brightness"],
            skinScore: 74,
            budget: "moderate",
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setRecommendations(data.recommendations || []);
          setRoutineNote(data.routine_note || "");
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Recommendations API unavailable:", err);
      }
      setIsLoading(false);
    }
    loadRecommendations();
  }, []);

  return (
    <div className="p-8 lg:p-12 space-y-12 max-w-7xl mx-auto bg-skin-pearl min-h-screen">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-4 text-left">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-skin-muted/5 text-skin-dark text-[10px] font-black uppercase tracking-widest border border-skin-border/10 shadow-sm">
            <ShoppingBag size={14} className="text-skin-violet" /> Curated Intelligence
          </div>
          <h1 className="text-4xl lg:text-6xl font-outfit font-black tracking-tight text-skin-dark leading-none">Biological Protocol</h1>
          <p className="text-skin-muted font-bold text-lg max-w-2xl opacity-90 leading-relaxed">
            AI-sequenced molecular matches for your unique dermal profile. Every recommendation is verified against your local Skin DNA.
          </p>
        </div>
        <Link href="/scan">
          <Button variant="premium" className="h-16 rounded-[2rem] px-10 gap-3 shadow-2xl shadow-skin-violet/20 font-black text-lg hover:scale-105 transition-all">
            <Sparkles size={20} className="text-skin-gold" /> Rescan for Fresh Matrix
          </Button>
        </Link>
      </header>

      {isLoading ? (
        <div className="py-40 flex flex-col items-center justify-center space-y-8">
          <Loader2 className="w-16 h-16 text-skin-violet animate-spin" />
          <div className="space-y-2">
            <p className="font-outfit font-black tracking-tight text-3xl text-skin-dark">Matching Molecular Profiles...</p>
            <p className="text-skin-muted font-black text-[10px] uppercase tracking-widest opacity-80">Sequencing compatibility matrix</p>
          </div>
        </div>
      ) : (
        <>
          {/* Routine Note */}
          {routineNote && (
            <Card className="border-none bg-white shadow-2xl rounded-[3rem] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-skin-violet/5 via-skin-rose/5 to-skin-gold/5 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
              <CardContent className="p-10 flex items-center gap-6 relative z-10 text-left">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-skin-border/5">
                  <Sparkles className="text-skin-violet" size={32} />
                </div>
                <p className="text-xl font-bold text-skin-dark leading-relaxed">"{routineNote}"</p>
              </CardContent>
            </Card>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendations.map((product, i) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-none bg-white shadow-[0_25px_60px_rgba(0,0,0,0.06)] rounded-[3rem] overflow-hidden hover:shadow-[0_45px_100px_rgba(0,0,0,0.12)] hover:scale-[1.02] transition-all duration-500 group h-full flex flex-col border border-skin-border/5">
                  {/* Match Score Banner */}
                  <div className={cn(
                    "px-8 py-4 flex items-center justify-between transition-colors duration-500",
                    product.match_score >= 90 ? "bg-skin-glow" :
                    product.match_score >= 80 ? "bg-skin-violet" : "bg-skin-gold"
                  )}>
                    <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] drop-shadow-sm">
                      {product.match_score}% Biological Match
                    </span>
                    <Badge className="bg-white/20 text-white border-white/30 text-[8px] font-black uppercase tracking-widest px-3 py-1">
                      {product.category}
                    </Badge>
                  </div>

                  <CardContent className="p-8 space-y-8 flex-1 flex flex-col text-left">
                    {/* Product Info */}
                    <div className="flex items-start gap-6">
                      <div className="w-20 h-20 rounded-[2rem] bg-skin-muted/5 flex items-center justify-center flex-shrink-0 border border-skin-border/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                        {categoryIcons[product.category] || <ShoppingBag size={28} className="text-skin-muted" />}
                      </div>
                      <div className="min-w-0 space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-skin-muted opacity-60">{product.brand}</p>
                        <h3 className="text-2xl font-outfit font-black tracking-tight leading-none text-skin-dark">{product.name}</h3>
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <span className="text-xs font-black text-skin-dark opacity-60 uppercase tracking-widest">{product.price_range}</span>
                          <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2 bg-skin-pearl border-skin-border/10 text-skin-dark px-3 py-1">
                            {product.when_to_use === 'PM' ? <Moon size={12} className="text-skin-violet" /> : product.when_to_use === 'AM' ? <Sun size={12} className="text-skin-gold" /> : <Clock size={12} />}
                            {product.when_to_use}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Why It Works */}
                    <p className="text-lg font-bold leading-relaxed text-skin-muted opacity-80 flex-1 italic drop-shadow-sm">
                      "{product.why_it_works}"
                    </p>

                    {/* Key Ingredients */}
                    <div className="space-y-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-skin-muted opacity-40 px-2 lg:px-4">Molecular Blueprint</span>
                      <div className="flex flex-wrap gap-2 px-2 lg:px-4">
                        {product.key_ingredients?.map((ing: string) => (
                          <Link key={ing} href={`/ingredients`} className="hover:scale-105 transition-transform">
                            <span className="px-4 py-2 rounded-2xl bg-skin-muted/5 text-skin-dark text-[10px] font-black uppercase tracking-widest hover:bg-skin-violet hover:text-white transition-all border border-skin-border/5 shadow-sm">
                              {ing}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Concern Badge */}
                    <div className="flex items-center justify-between pt-8 border-t border-skin-border/10">
                      <div className="flex items-center gap-2">
                         <div className="h-2 w-2 rounded-full bg-skin-glow animate-pulse" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-skin-muted">
                            Targets: {product.concern_addressed}
                         </span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl border-2 border-skin-border/10 flex items-center justify-center group-hover:bg-skin-dark group-hover:border-skin-dark group-hover:text-white transition-all duration-300 shadow-sm">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Compare CTA */}
          <Card className="border-none bg-skin-graphite text-skin-pearl rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.4)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-skin-graphite to-[#222] pointer-events-none" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-skin-violet/10 rounded-full blur-[100px] -z-10 group-hover:scale-110 transition-transform duration-1000" />
            
            <CardContent className="p-16 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10 text-left">
              <div className="space-y-6 max-w-2xl">
                <h3 className="text-4xl md:text-5xl font-outfit font-black tracking-tight drop-shadow-2xl">Neural Comparison Lab</h3>
                <p className="text-white/60 text-xl font-medium leading-relaxed">Not sure which molecule to integrate? Compare any two products in our AI-powered molecular synergy simulator.</p>
              </div>
              <Link href="/products/compare">
                <Button className="bg-white text-skin-graphite hover:bg-skin-glow hover:text-skin-graphite font-black rounded-3xl h-20 px-12 shadow-2xl transition-all text-xl hover:scale-105 active:scale-95 flex items-center gap-4">
                  Open Synergy Lab <ChevronRight size={28} />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
