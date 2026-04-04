"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Share2,
  Copy,
  Download,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Droplets,
  Palette,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SharePage() {
  const [copied, setCopied] = useState(false);

  // In production, this would come from the API
  const reportData = {
    skinScore: 78,
    metrics: [
      { name: "Hydration", score: 82, icon: Droplets, color: "text-skin-violet", bg: "bg-skin-violet/10" },
      { name: "Texture", score: 74, icon: Eye, color: "text-skin-rose", bg: "bg-skin-rose/10" },
      { name: "Pigmentation", score: 71, icon: Palette, color: "text-skin-gold", bg: "bg-skin-gold/10" },
      { name: "Overall Trend", score: 85, icon: TrendingUp, color: "text-skin-glow", bg: "bg-skin-glow/10" },
    ],
    narrative: "Your skin is showing strong improvement in hydration and texture clarity. Continue your current protocol for optimal results.",
    archetype: "Luminous Baseline",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/share/demo-report`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 lg:p-12 space-y-12 max-w-5xl mx-auto bg-skin-pearl min-h-screen">
      {/* Header */}
      <header className="space-y-4 text-left">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-skin-muted/5 text-skin-dark text-[10px] font-black uppercase tracking-widest border border-skin-border/10 shadow-sm">
          <Share2 size={14} className="text-skin-violet" /> Share Skin Intelligence
        </div>
        <h1 className="text-4xl lg:text-5xl font-outfit font-black tracking-tight text-skin-dark">Report Card</h1>
        <p className="text-skin-muted font-bold text-lg max-w-xl opacity-90 leading-relaxed">
          Generate a beautiful premium snapshot of your skin intelligence to share with specialists or for your records.
        </p>
      </header>

      {/* Report Card Preview */}
      <Card className="border-none bg-skin-graphite text-skin-pearl shadow-[0_50px_100px_rgba(0,0,0,0.4)] rounded-[4rem] overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-skin-graphite to-[#222] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-skin-violet/20 rounded-full blur-[100px] -z-10 group-hover:scale-110 transition-transform duration-1000" />
        
        <CardContent className="p-12 md:p-20 space-y-16 relative z-10 text-left">
          {/* Report Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-4 text-center md:text-left">
              <Badge className="bg-white/10 text-skin-pearl border-white/20 text-[9px] font-black uppercase tracking-widest px-4 py-1.5 backdrop-blur-md">
                SkinMinder Intelligence Profile
              </Badge>
              <div className="flex items-baseline gap-2 justify-center md:justify-start">
                <h2 className="text-7xl md:text-9xl font-outfit font-black tracking-tighter drop-shadow-2xl">{reportData.skinScore}</h2>
                <span className="text-2xl font-black text-white/40">/ 100</span>
              </div>
              <p className="text-skin-gold text-sm font-black uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                <Sparkles size={16} /> {reportData.archetype}
              </p>
            </div>
            <div className="w-56 h-56 rounded-full border-[12px] border-white/5 flex items-center justify-center bg-white/5 backdrop-blur-3xl shadow-inner relative group-hover:border-white/10 transition-all duration-500">
              <Sparkles size={64} className="text-white/20 group-hover:text-skin-gold transition-colors duration-500" />
              <div className="absolute inset-0 rounded-full border border-white/20 animate-pulse" />
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {reportData.metrics.map((metric, i) => (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 text-center space-y-4 hover:bg-white/10 transition-all duration-300"
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mx-auto border border-white/10", metric.bg)}>
                   <metric.icon className={cn(metric.color)} size={24} />
                </div>
                <div>
                  <p className="text-4xl font-outfit font-black text-skin-pearl mb-1">{metric.score}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40">{metric.name}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Narrative */}
          <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-skin-violet" />
            <p className="text-xl md:text-2xl font-medium leading-relaxed italic text-white/90 drop-shadow-md">
              &ldquo;{reportData.narrative}&rdquo;
            </p>
          </div>

          {/* Branding */}
          <div className="flex items-center justify-center gap-4 opacity-40 group-hover:opacity-60 transition-opacity">
            <div className="h-px w-12 bg-skin-pearl/20" />
            <Sparkles size={16} className="text-skin-gold" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-skin-pearl">SKINMINDER INTELLIGENCE</span>
            <div className="h-px w-12 bg-skin-pearl/20" />
          </div>
        </CardContent>
      </Card>

      {/* Share Actions */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
        <Button
          onClick={handleCopy}
          variant="outline"
          className="h-16 px-12 rounded-3xl font-black border-skin-border/20 gap-3 text-skin-dark hover:bg-skin-muted/5 transition-all w-full sm:w-auto"
        >
          {copied ? <CheckCircle2 className="text-skin-glow" size={24} /> : <Copy size={24} className="text-skin-violet" />}
          {copied ? "Link Copied!" : "Copy Share Link"}
        </Button>
        <Button variant="premium" className="h-16 px-12 rounded-3xl font-black shadow-2xl shadow-skin-violet/20 gap-3 text-lg hover:scale-[1.05] transition-all w-full sm:w-auto">
          <Download size={24} />
          Download Premium Image
        </Button>
      </div>
    </div>
  );
}
