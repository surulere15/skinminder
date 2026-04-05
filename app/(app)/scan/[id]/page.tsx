"use client";

import { ShareButton } from '@/components/ui/share-button';
import { AIBrain } from "@/components/ui/ai-brain";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PremiumCard } from "@/components/ui/premium-card";
import { 
  Sparkles, 
  ArrowLeft, 
  Share2, 
  Download, 
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  Eye,
  Zap,
  Droplets,
  Sun,
  Activity,
  Fingerprint,
  Loader2,
  Camera
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SkinRadar } from "@/components/dashboard/skin-radar";
import { ClinicalPrescription } from "@/components/ui/clinical-prescription";
import { AIDiagnosticOverlay } from "@/components/ui/ai-diagnostic-overlay";
import { PredictiveModeling } from "@/components/ui/predictive-modeling";

// Glass card with depth
function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "relative rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.28)] overflow-hidden md:rounded-[28px]",
      className
    )}>
      <div className="pointer-events-none absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
      <div className="pointer-events-none absolute inset-0 rounded-[24px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] md:rounded-[28px]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default function ScanResultsPage() {
  const { id } = useParams();
  const [scan, setScan] = useState<any>(null);
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadScan() {
      if (id === "demo" || typeof id !== 'string') {
        setScan({
          id: "demo",
          image_url: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600&auto=format&fit=crop",
          body_area: "face",
          hydration_score: 0.68,
          pigmentation_score: 0.72,
          texture_score: 0.55,
          oil_balance: 0.8,
          irritation_probability: 0.15,
          skin_score: 78,
          skin_age_estimate: 25,
          primary_concerns: ["texture", "dryness"],
          scan_quality: 92,
          lighting_quality: "Good",
          confidence: "High",
          analysis_raw: {
            intelligence: {
              skinScore: 78,
              estimatedSkinAge: 27,
              primaryConcerns: ["boosting hydration", "evening out skin tone", "enhancing elasticity"],
              summary: "Your skin is looking wonderful! You have a strong foundation with great texture and clarity.",
              primaryProfile: "PIH-Prone / Barrier Sensitive",
              overallCondition: "Stable with mild concerns",
              mainFocusAreas: ["Pigmentation", "Texture consistency", "Hydration support"]
            }
          }
        });
        setIsLoading(false);
        return;
      }

      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("skin_scans")
          .select("*")
          .eq("id", id)
          .single();
        if (data) {
          setScan(data);
          
          if (data.image_url && !data.image_url.startsWith('http')) {
             const signRes = await fetch('/api/storage/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: data.image_url })
             });
             const { signedUrl } = await signRes.json();
             setDisplayUrl(signedUrl);
          } else {
             setDisplayUrl(data.image_url);
          }
        }
      } catch (e) {
        console.warn("Supabase fetch failed.");
      }
      setIsLoading(false);
    }
    loadScan();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-skin-dark text-content-primary">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-skin-violet animate-spin" />
          <motion.div
            className="absolute inset-0 rounded-full bg-skin-violet/20"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <p className="mt-6 text-sm text-content-muted font-medium">Loading your analysis...</p>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-skin-dark text-content-primary p-6">
        <AlertCircle size={48} className="text-white/20 mb-4" />
        <p className="text-lg font-semibold text-content-primary mb-2">Analysis not found</p>
        <p className="text-sm text-content-muted mb-6">This scan could not be loaded.</p>
        <Button onClick={() => router.push("/dashboard")} className="rounded-2xl h-12 px-8">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const intel = scan.analysis_raw?.intelligence || {};
  const profile = intel.primaryProfile || "Balanced / Normal";
  const condition = intel.overallCondition || "Stable";
  const focusAreas = intel.mainFocusAreas || scan.primary_concerns || ["General maintenance"];

  return (
    <div className="min-h-screen relative overflow-hidden bg-skin-dark text-content-primary">
      {/* Global noise texture */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.012]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

      <div className="px-4 py-8 md:px-8 lg:px-12 space-y-8 md:space-y-12 max-w-7xl mx-auto relative z-10">
        {/* A. TOP RESULT SUMMARY */}
        <header className="space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full w-12 h-12 hover:bg-white/5 transition-all duration-300 ease-out">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Badge className="rounded-full px-4 py-1.5 bg-skin-violet/15 text-skin-violet border border-skin-violet/20 text-[10px] font-black uppercase tracking-widest">
                <CheckCircle2 size={10} className="mr-1.5" />
                Analysis Complete
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-black tracking-[-0.03em] leading-[1.02] text-content-primary">
              Your Skin Analysis
            </h1>
            <p className="text-sm md:text-base text-content-secondary leading-relaxed max-w-2xl">
              {intel.summary || "Your skin currently appears balanced in some areas, with mild pigmentation sensitivity and early texture concerns."}
            </p>
          </div>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-[11px] text-content-muted font-medium">
            <span className="flex items-center gap-1.5">
              <Eye size={12} className="text-skin-violet" />
              Scan quality: {scan.scan_quality || 92}%
            </span>
            <span className="hidden md:block h-1 w-1 rounded-full bg-white/15" />
            <span className="flex items-center gap-1.5">
              <Sun size={12} className="text-skin-gold" />
              Lighting: {scan.lighting_quality || "Good"}
            </span>
            <span className="hidden md:block h-1 w-1 rounded-full bg-white/15" />
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-emerald-400" />
              Confidence: {scan.confidence || "High"}
            </span>
            <span className="hidden md:block h-1 w-1 rounded-full bg-white/15" />
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              Analyzed just now
            </span>
          </div>
        </header>

        {/* B. FACE SCAN PREVIEW + TRUST BOX */}
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 md:gap-12">
          {/* Left: Image preview */}
          <div className="space-y-6">
            <GlassCard className="p-3 md:p-4">
              <div className="aspect-[4/5] relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-skin-surface">
                <img src={displayUrl || scan.image_url} alt="Scan" className="w-full h-full object-cover" />
                
                {/* Analysis overlay */}
                <AIDiagnosticOverlay 
                  markers={[
                    { x: 45, y: 35, label: "Texture sequencing" },
                    { x: 30, y: 65, label: "Hydration check" },
                  ]}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                
                {/* Primary concerns badges */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                  {scan.primary_concerns?.map((c: string) => (
                    <Badge key={c} className="bg-white/10 text-white border border-white/20 backdrop-blur-md px-3 py-1 font-bold uppercase text-[9px] tracking-widest rounded-full">
                      {c}
                    </Badge>
                  ))}
                </div>

                {/* Scan quality badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-white/80">Good lighting</span>
                  <span className="text-xs font-black text-emerald-400 ml-1">{scan.scan_quality || 92}%</span>
                </div>
              </div>
            </GlassCard>

            <Button variant="ghost" className="w-full h-12 rounded-2xl font-bold border border-white/5 text-content-secondary hover:bg-white/5 hover:text-content-primary transition-all duration-300 ease-out" onClick={() => router.push("/scan")}>
              <Camera size={16} className="mr-2" /> Retake Scan
            </Button>
          </div>

          {/* Right: What this means panel */}
          <div className="space-y-6">
            <GlassCard className="p-6 md:p-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-skin-muted mb-6">What this means</h3>
              
              <div className="space-y-6">
                {/* Primary profile */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-skin-violet/10 flex items-center justify-center flex-shrink-0 border border-skin-violet/20">
                    <Fingerprint size={18} className="text-skin-violet" />
                  </div>
                  <div>
                    <p className="text-xs text-content-muted font-medium">Primary skin profile</p>
                    <p className="text-base font-bold text-content-primary mt-0.5">{profile}</p>
                  </div>
                </div>

                {/* Overall condition */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-skin-gold/10 flex items-center justify-center flex-shrink-0 border border-skin-gold/20">
                    <Activity size={18} className="text-skin-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-content-muted font-medium">Overall condition</p>
                    <p className="text-base font-bold text-content-primary mt-0.5">{condition}</p>
                  </div>
                </div>

                {/* Main focus areas */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-skin-glow/10 flex items-center justify-center flex-shrink-0 border border-skin-glow/20">
                    <Zap size={18} className="text-skin-glow" />
                  </div>
                  <div>
                    <p className="text-xs text-content-muted font-medium">Main focus areas</p>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {focusAreas.map((area: string) => (
                        <span key={area} className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/8 text-xs font-bold text-content-secondary">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Skin score card */}
            <GlassCard className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-skin-muted">Skin Score</p>
                  <p className="text-[10px] font-black uppercase text-skin-violet tracking-[0.2em] opacity-60 mt-0.5">vs Biological Potential</p>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <p className="text-4xl font-black text-skin-violet">{scan.skin_score || intel.skinScore || 0}</p>
                    <p className="text-sm font-bold text-skin-violet/40">/100</p>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="h-3 w-full bg-white/[0.04] rounded-full overflow-hidden border border-white/5 p-[2px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${scan.skin_score || intel.skinScore || 0}%` }}
                    transition={{ duration: 2, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-skin-violet to-skin-violet/60 rounded-full"
                  />
                </div>
              </div>

              {/* Dermal markers */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                {[
                  { label: "Hydration", value: `${Math.round((scan.hydration_score || 0.68) * 100)}%`, icon: Droplets, color: "text-skin-violet" },
                  { label: "Pigmentation", value: `${Math.round((scan.pigmentation_score || 0.72) * 100)}%`, icon: Sun, color: "text-skin-gold" },
                  { label: "Texture", value: `${Math.round((scan.texture_score || 0.55) * 100)}%`, icon: Activity, color: "text-skin-glow" },
                  { label: "Oil Balance", value: `${Math.round((scan.oil_balance || 0.8) * 100)}%`, icon: Zap, color: "text-skin-violet" },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <item.icon size={12} className={item.color} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-content-muted opacity-60">{item.label}</span>
                    </div>
                    <span className="text-lg font-black text-content-primary">{item.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* C. INTELLIGENCE MAP */}
        <GlassCard className="p-6 md:p-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-content-primary">Skin Health Map</h3>
            <p className="text-sm text-content-secondary mt-0.5">Multi-dimensional biological profile</p>
          </div>
          <SkinRadar />
        </GlassCard>

        {/* D. PREDICTIVE MODELING */}
        <PredictiveModeling />

        {/* E. ACTION PLAN — MORNING / EVENING ROUTINE */}
        <section className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-content-primary">Your Personalized Routine</h3>
            <p className="text-sm text-content-secondary mt-0.5">Morning and evening protocols tailored to your skin</p>
          </div>
          <ClinicalPrescription 
            morning={[
              { name: "Gentle PH Barrier Cleanser", type: "Cleanser", why: "Low hydration baseline", match: "98%", benefit: "Maintains natural lipids" },
              { name: "C15 Super Booster", type: "Serum", why: "Texture refinement needed", match: "94%", benefit: "Evens tone & clarity" }
            ]}
            night={[
              { name: "Omga+ Lipid Cleanser", type: "Cleanser", why: "Double cleanse protocol", match: "96%", benefit: "Removes cellular debris" },
              { name: "Clinical 1% Retinol", type: "Treatment", why: "Cellular renewal target", match: "92%", benefit: "Refines overall texture" }
            ]}
          />
        </section>

        {/* F. NEXT ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link href="/scan" className="w-full sm:w-auto">
            <Button variant="ghost" className="w-full h-14 px-12 rounded-2xl font-bold border border-white/5 text-content-secondary hover:bg-white/5 hover:text-content-primary transition-all duration-300 ease-out">
              <Camera size={16} className="mr-2" /> New Scan
            </Button>
          </Link>
          <Link href="/routine" className="w-full sm:w-auto">
            <Button className="w-full h-14 px-12 rounded-2xl font-bold shadow-xl shadow-skin-violet/20 transition-all duration-300 ease-out hover:scale-[1.01] active:scale-[0.98]">
              View Full Routine <ChevronRight className="ml-2" size={16} />
            </Button>
          </Link>
          <div className="flex gap-3 w-full sm:w-auto">
            <ShareButton scanId={scan.id} />
            <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl border border-white/5 hover:bg-white/5 transition-all duration-300 ease-out">
              <Download size={18} />
            </Button>
          </div>
        </div>

        {/* G. MEDICAL DISCLAIMER */}
        <GlassCard className="p-5 md:p-6 !border-amber-500/15 !bg-amber-500/5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-amber-300">Not a medical diagnosis</p>
              <p className="text-xs text-amber-200/70 leading-relaxed">
                This analysis is for cosmetic and informational purposes only. It is based on visible skin patterns from this scan and does not replace professional medical care. If you have concerning symptoms (new moles, persistent rashes, unusual spots), please consult a dermatologist.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
