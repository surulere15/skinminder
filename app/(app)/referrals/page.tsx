"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Gift, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  Zap, 
  Award,
  ChevronRight,
  TrendingUp,
  Heart,
  BadgeCheck,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = "GLOW-882-XQ";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://skinminder.ai/signup?ref=${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 lg:p-12 space-y-12 max-w-6xl mx-auto bg-skin-pearl min-h-screen">
      {/* Header */}
      <header className="pb-8">
        <h1 className="text-3xl font-bold">Invite Friends</h1>
        <p className="text-muted mt-2">
          Share SkinMinder with friends. They get started, you both get extra scans.
        </p>
      </header>

      {/* Main Referral Card */}
      <Card className="border-none bg-skin-graphite text-skin-pearl shadow-[0_50px_100px_rgba(0,0,0,0.4)] rounded-[4rem] overflow-hidden relative group">
         <div className="absolute inset-0 bg-gradient-to-br from-skin-graphite to-[#333] pointer-events-none" />
         <div className="absolute top-0 right-0 w-96 h-96 bg-skin-violet/10 rounded-full blur-[120px] -z-10 group-hover:scale-110 transition-transform duration-1000" />
         
         <CardContent className="p-12 md:p-20 flex flex-col items-center text-center space-y-12 relative z-10">
            <div className="w-28 h-28 rounded-[2.5rem] bg-skin-violet flex items-center justify-center shadow-2xl relative">
               <Sparkles className="text-skin-gold" size={56} />
               <div className="absolute inset-0 border-4 border-white/20 rounded-[2.5rem] animate-pulse" />
            </div>
            <div className="space-y-6 max-w-2xl">
               <h2 className="text-6xl md:text-7xl font-outfit font-black tracking-tighter leading-tight drop-shadow-2xl">1 Friend = 1 Month Elite</h2>
               <p className="text-white/70 text-xl font-medium leading-relaxed drop-shadow-md">
                  When your network completes their first analysis, you both initialize "Elite Monitor" protocol access for 30 cycles.
               </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
               <div className="flex-1 relative group/input">
                  <Input 
                    value={`skinminder.ai/ref/${referralCode}`} 
                    readOnly 
                    className="h-20 pl-8 pr-8 rounded-3xl bg-white/5 border-white/10 text-white font-black text-xl select-all focus-visible:ring-skin-violet/40 transition-all border-2"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 text-white/50 group-hover/input:opacity-100 transition-opacity">
                    <Share2 size={24} />
                  </div>
               </div>
               <Button size="lg" className="h-20 px-12 rounded-3xl bg-skin-violet text-white hover:bg-white hover:text-skin-violet font-black text-xl shadow-2xl shadow-skin-violet/20 transition-all active:scale-95 shrink-0" onClick={copyToClipboard}>
                  {copied ? <><Check className="mr-3 w-6 h-6 text-skin-glow" /> Protocol Copied</> : <><Copy className="mr-3 w-6 h-6" /> Copy Invite Link</>}
               </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-12 pt-10">
               <div className="text-center group/stat">
                  <p className="text-5xl font-outfit font-black text-white group-hover:scale-110 transition-transform">12</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-3 group-hover:text-skin-gold transition-colors">Neural Invites</p>
               </div>
               <div className="w-px h-16 bg-white/10 hidden sm:block" />
               <div className="text-center group/stat">
                  <p className="text-5xl font-outfit font-black text-white group-hover:scale-110 transition-transform">4</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-3 group-hover:text-skin-glow transition-colors">Active Protocols</p>
               </div>
               <div className="w-px h-16 bg-white/10 hidden sm:block" />
               <div className="text-center group/stat">
                  <p className="text-5xl font-outfit font-black text-skin-gold group-hover:scale-110 transition-transform">Elite</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-3 group-hover:text-white transition-colors">Current Status</p>
               </div>
            </div>
         </CardContent>
         {/* Decorative Accents */}
         <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-skin-violet/5 rounded-full -ml-60 -mt-60 blur-[150px] pointer-events-none" />
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-skin-glow/5 rounded-full -mr-60 -mb-60 blur-[150px] pointer-events-none" />
      </Card>

      {/* Rewards Grid */}
      <section className="space-y-12 text-left">
         <div className="px-6">
           <h3 className="text-3xl font-outfit font-black tracking-tight text-skin-dark">Earning Milestones</h3>
           <p className="text-skin-muted text-[10px] font-black uppercase tracking-widest mt-2 opacity-60">Sequence referrals to unlock high-fidelity laboratory tools.</p>
         </div>
         
         <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "The Enthusiast", count: 3, reward: "Custom Dermal Interface Skins", icon: Heart, unlocked: true, color: "text-skin-rose" },
              { title: "Beauty Insider", count: 10, reward: "Beta Access to Glow Simulation v2", icon: Zap, unlocked: true, color: "text-skin-gold" },
              { title: "Skin Vanguard", count: 25, reward: "Lifetime Early Adopter Neural ID", icon: Award, unlocked: false, color: "text-skin-violet" },
            ].map((m, i) => (
              <Card key={i} className={cn(
                "border-none shadow-2xl rounded-[3.5rem] transition-all duration-700 relative overflow-hidden group",
                m.unlocked ? "bg-white border border-skin-border/5 scale-100" : "bg-skin-muted/5 grayscale opacity-60 shadow-none border-dashed border-2 border-skin-border/20"
              )}>
                 <CardContent className="p-10 space-y-8 flex flex-col h-full">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500",
                      m.unlocked ? "bg-white shadow-xl border-skin-border/5 group-hover:scale-110" : "bg-skin-muted/10 border-transparent",
                      m.color
                    )}>
                       <m.icon size={32} />
                    </div>
                    <div className="space-y-2">
                       <div className="flex items-center justify-between">
                          <h4 className="text-2xl font-outfit font-black text-skin-dark">{m.title}</h4>
                          {m.unlocked && <BadgeCheck className="text-skin-glow" size={28} />}
                       </div>
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-skin-muted opacity-60">{m.count} Integrated Referrals</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-skin-muted/5 border border-skin-border/5 shadow-inner flex-1">
                       <p className="text-[10px] font-black leading-tight uppercase tracking-widest text-skin-muted/60 mb-2">Protocol Reward:</p>
                       <p className="text-lg font-bold text-skin-dark leading-tight">{m.reward}</p>
                    </div>
                    {m.unlocked ? (
                      <Button className="w-full rounded-2xl bg-skin-glow/10 text-skin-glow hover:bg-skin-glow hover:text-skin-graphite font-black border-none h-14 shadow-xl shadow-skin-glow/5 transition-all">Claim Protocol Access</Button>
                    ) : (
                      <div className="space-y-4 pt-4">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-skin-muted">
                             <span>Biological Progress</span>
                             <span>12 / {m.count}</span>
                          </div>
                          <div className="h-4 bg-skin-muted/10 rounded-full overflow-hidden border border-skin-border/5 shadow-inner">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${(12/m.count)*100}%` }}
                               transition={{ duration: 1.5, delay: 0.5 }}
                               className="h-full bg-skin-violet rounded-full shadow-[0_0_15px_rgba(124,108,255,0.4)]" 
                             />
                          </div>
                      </div>
                    )}
                 </CardContent>
              </Card>
            ))}
         </div>
      </section>

      {/* Share Actions Section */}
      <section className="pt-10">
         <Card className="border-none bg-white/40 backdrop-blur-xl shadow-2xl rounded-[4rem] overflow-hidden border border-skin-border/10">
            <CardContent className="p-16 flex flex-col md:flex-row items-center justify-between gap-16 text-left">
               <div className="space-y-4 max-w-md">
                  <h3 className="text-3xl font-outfit font-black tracking-tight text-skin-dark leading-none">Global Sync</h3>
                  <p className="text-skin-muted font-bold text-lg opacity-80 leading-relaxed">Broadcast your unique protocol invitation to your neural network in one click.</p>
               </div>
               <div className="flex flex-wrap gap-6 shrink-0">
                  <Button variant="outline" className="h-18 px-12 rounded-3xl font-black border-2 border-skin-border/20 bg-white text-skin-dark hover:bg-skin-muted/5 transition-all">
                     <Users className="mr-3 w-6 h-6 text-skin-violet" /> Sync Contacts
                  </Button>
                  <Button variant="premium" className="h-18 px-12 rounded-3xl font-black shadow-2xl shadow-skin-violet/30 flex items-center gap-3 text-lg hover:scale-105 transition-all">
                     <Share2 className="w-6 h-6" /> Native Neural Share
                  </Button>
               </div>
            </CardContent>
         </Card>
      </section>
    </div>
  );
}
