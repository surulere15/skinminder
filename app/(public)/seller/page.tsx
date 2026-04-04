"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  Store, 
  BarChart3, 
  Sparkles, 
  Zap, 
  Users, 
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SellerSolutionsPage() {
  return (
    <div className="min-h-screen bg-[#0B1020] pt-32 pb-20 text-content-primary">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Hero Section */}
      <section className="px-8 max-w-7xl mx-auto flex flex-col items-center text-center space-y-8 mb-32">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
           <Building2 size={12} /> Institutional Intelligence
        </div>
        <h1 className="text-6xl md:text-8xl font-semibold tracking-tighter leading-[0.9] text-content-primary">
           The Science <br /> of Dermal Data.
        </h1>
        <p className="text-xl md:text-2xl text-content-secondary font-medium max-w-3xl leading-relaxed">
           SkinMinder is the world's most advanced AI Skin Intelligence Platform, providing cosmetic brands and dermatology clinics with high-fidelity predictive data layers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
           <Link href="/auth/signup?role=seller">
             <Button variant="clinical" size="lg" className="h-16 px-10 shadow-2xl">
                Request Institutional Access
             </Button>
           </Link>
           <Button variant="clinical-ghost" size="lg" className="h-16 px-8 border border-white/10">
              Technical Documentation
           </Button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="px-8 max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 mb-40">
         {/* Cosmetic R&D Card */}
         <div className="p-12 rounded-[4rem] bg-skin-surface border border-white/5 flex flex-col justify-between space-y-12 shadow-2xl">
            <div className="space-y-6">
               <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <BarChart3 size={32} />
               </div>
               <h3 className="text-4xl font-semibold tracking-tight leading-tight text-content-primary">Computational R&D.</h3>
               <p className="text-xl font-medium text-content-secondary leading-relaxed">
                  Leverage our MDPI-grade predictive engines to simulate formulation efficacy and toxicology before clinical trials. 
               </p>
            </div>
            <div className="space-y-4">
               {[
                 "Pre-market Safety Benchmarking",
                 "Ingredient Biocompatibility Index",
                 "Formulation Stability Modeling"
               ].map((c, i) => (
                 <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary" size={20} />
                    <span className="font-bold text-content-primary opacity-90">{c}</span>
                 </div>
               ))}
            </div>
         </div>

         {/* Clinical Support Card */}
         <div className="p-12 rounded-[4rem] bg-skin-elevated border border-white/10 flex flex-col justify-between space-y-12 shadow-2xl">
            <div className="space-y-6">
               <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Sparkles size={32} />
               </div>
               <h3 className="text-4xl font-semibold tracking-tight leading-tight text-content-primary">Diagnostic Support.</h3>
               <p className="text-xl font-medium text-content-secondary leading-relaxed">
                  Empower clinicians with real-time dermal telemetry and high-fidelity biological signatures for precise patient monitoring.
               </p>
            </div>
            <div className="space-y-4">
               {[
                 "Real-time Dermal Telemetry",
                 "5-Year Aging Trajectory Modeling",
                 "Institutional Patient Dashboards"
               ].map((c, i) => (
                 <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-emerald-400" size={20} />
                    <span className="font-bold text-content-primary opacity-90">{c}</span>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* CTA Bottom */}
      <section className="px-8 max-w-7xl mx-auto">
         <div className="rounded-[4rem] bg-primary p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12 shadow-[0_40px_100px_rgba(111,139,255,0.2)] relative overflow-hidden">
            <div className="space-y-6 relative z-10">
               <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter leading-tight text-white">
                  Sequence the <br /> Future.
               </h2>
               <p className="text-white/80 text-xl max-w-xl font-medium leading-relaxed">
                  Partner with SkinMinder to integrate the world's most intelligent skin database into your institutional workflows.
               </p>
               <Button className="h-16 px-12 rounded-2xl bg-white text-primary hover:bg-white/90 font-black text-xl shadow-xl">
                  Contact Institutional Sales <ArrowRight className="ml-2" />
               </Button>
            </div>
            <div className="w-full md:w-1/3 aspect-square bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[4rem] flex flex-col items-center justify-center p-8 gap-4 group">
               <Building2 size={100} className="text-white opacity-40 group-hover:scale-110 transition-transform duration-1000" />
               <p className="text-white text-[10px] font-black uppercase tracking-widest">Scientific Grade</p>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -mr-48 -mt-48" />
         </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row items-center justify-between text-[11px] font-medium uppercase tracking-widest text-content-muted border-t border-white/5 mt-24">
         <p>© 2026 SkinMinder Lab • Institutional Division</p>
         <p className="opacity-50 tracking-normal">Optimized for Global Clinical Standards</p>
      </footer>
    </div>
  );
}
