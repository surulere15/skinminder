"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  ExternalLink,
  Star,
  Package,
  Shield,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SellerStorefrontPage() {
  return (
    <div className="p-8 lg:p-12 space-y-12 max-w-7xl mx-auto bg-skin-pearl min-h-screen text-left">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-4">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-skin-muted/5 text-skin-dark text-[10px] font-black uppercase tracking-widest border border-skin-border/10 shadow-sm">
            <Store size={14} className="text-skin-violet" /> Strategic Distribution
          </div>
          <h1 className="text-4xl lg:text-6xl font-outfit font-black tracking-tight text-skin-dark">Storefront Preview</h1>
          <p className="text-skin-muted font-bold text-lg max-w-2xl opacity-90 leading-relaxed">
            This is your brand's high-fidelity neural projection as viewed by SkinMinder users.
          </p>
        </div>
        <Button variant="outline" className="rounded-2xl h-16 px-8 font-black gap-3 border-2 border-skin-border/20 bg-white shadow-xl hover:bg-skin-muted/5 transition-all">
          <ExternalLink size={20} /> View Public Node
        </Button>
      </header>

      {/* Brand Card Preview */}
      <Card className="border-none bg-white shadow-[0_45px_100px_rgba(0,0,0,0.08)] rounded-[4rem] overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-skin-pearl to-white pointer-events-none" />
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
           <Store size={200} className="text-skin-violet" />
        </div>
        
        <CardContent className="p-12 md:p-20 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="w-40 h-40 rounded-[2.5rem] bg-white shadow-2xl flex items-center justify-center border border-skin-border/5 shrink-0 group-hover:scale-105 transition-transform">
            <Store size={64} className="text-skin-violet opacity-80" />
          </div>
          <div className="space-y-6 text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h2 className="text-5xl font-outfit font-black tracking-tight text-skin-dark leading-none">Your Brand Name</h2>
              <Badge variant="premium" className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 w-fit mx-auto md:mx-0">Verified AI Entity</Badge>
            </div>
            <p className="text-skin-muted font-bold text-xl max-w-2xl opacity-80 leading-relaxed">
              Premium molecular skincare crafted with clinically-proven biological markers for high-fidelity radiant health.
            </p>
            <div className="flex flex-wrap gap-8 justify-center md:justify-start pt-2">
              <div className="flex items-center gap-2 group/stat">
                <Star className="text-skin-gold fill-skin-gold" size={20} /> 
                <span className="text-lg font-black text-skin-dark group-hover:text-skin-violet transition-colors">4.8 Rating</span>
              </div>
              <div className="flex items-center gap-2 group/stat">
                <Package size={20} className="text-skin-muted opacity-60" /> 
                <span className="text-lg font-bold text-skin-muted group-hover:text-skin-violet transition-colors">12 Active SKUs</span>
              </div>
              <div className="flex items-center gap-2 group/stat">
                <Shield size={20} className="text-skin-glow" /> 
                <span className="text-lg font-black text-skin-glow group-hover:underline transition-all">AI Validated</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Products Preview */}
      <div className="space-y-10">
        <div className="flex items-center justify-between px-6">
          <h3 className="text-3xl font-outfit font-black tracking-tight flex items-center gap-4 text-skin-dark">
            <Sparkles className="text-skin-gold" size={32} />
            High-Synergy Matrix
          </h3>
          <p className="text-skin-muted text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Your top-performing molecular protocols.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {["Hyaluronic Acid Serum", "SPF 50 Mineral Shield", "Retinol Night Matrix"].map((product, i) => (
            <Card key={i} className="border-none bg-white shadow-[0_30px_70px_rgba(0,0,0,0.05)] rounded-[3rem] overflow-hidden group hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border border-skin-border/5">
              <div className="h-56 bg-gradient-to-br from-skin-pearl to-skin-muted/5 flex items-center justify-center relative overflow-hidden">
                <Package size={64} className="text-skin-muted opacity-10 group-hover:scale-125 group-hover:opacity-20 transition-all duration-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-20 h-20 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/40">
                      <Sparkles className="text-skin-gold/40" size={32} />
                   </div>
                </div>
              </div>
              <CardContent className="p-8 space-y-5">
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-skin-muted opacity-40">Molecular SKU 0{i+1}</p>
                   <h4 className="font-outfit font-black text-2xl text-skin-dark leading-tight">{product}</h4>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-skin-border/5">
                  <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest bg-skin-pearl border-skin-border/10 text-skin-dark px-3 py-1">Best Seller</Badge>
                  <div className="flex items-center gap-2">
                    <Star className="text-skin-gold fill-skin-gold" size={16} />
                    <span className="text-sm font-black text-skin-dark">4.{9 - i}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
