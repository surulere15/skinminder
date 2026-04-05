"use client";

import { ShareButton } from '@/components/ui/share-button';
import { AIBrain } from "@/components/ui/ai-brain";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PremiumCard } from "@/components/ui/premium-card";
import { Droplets, Sun, Activity, Fingerprint, Loader2, Camera, ShieldCheck, Eye, Zap, Sparkles, AlertCircle, Clock, ChevronRight, ArrowLeft, Share2, Download, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SkinRadar } from "@/components/dashboard/skin-radar";
import { ClinicalPrescription } from "@/components/ui/clinical-prescription";
import { AIDiagnosticOverlay } from "@/components/ui/ai-diagnostic-overlay";
import { PredictiveModeling } from "@/components/ui/predictive-modeling";

// Generate human-readable AI interpretation from scan data
function generateInterpretation(scan: any): string {
  const hydration = Math.round((scan.hydration_score || 0.68) * 100);
  const oilBalance = Math.round((scan.oil_balance || 0.8) * 100);
  const texture = Math.round((scan.texture_score || 0.55) * 100);
  const pigmentation = Math.round((scan.pigmentation_score || 0.72) * 100);
  const redness = Math.round((1 - (scan.irritation_probability || 0.15)) * 100);

  // Find strongest and weakest areas
  const metrics = [
    { label: "oil balance", score: oilBalance },
    { label: "hydration", score: hydration },
    { label: "redness control", score: redness },
    { label: "texture consistency", score: texture },
    { label: "pigmentation evenness", score: pigmentation },
  ].sort((a, b) => b.score - a.score);

  const strongest = metrics[0];
  const weakest = metrics[metrics.length - 1];
  const secondWeakest = metrics[metrics.length - 2];

  // Build interpretation
  const overall = hydration + oilBalance + texture + pigmentation + redness;
  const avgScore = overall / 5;

  let intro: string;
  if (avgScore >= 75) {
    intro = "Your analysis suggests a skin pattern that is generally healthy and well-balanced";
  } else if (avgScore >= 60) {
    intro = "Your analysis suggests a skin pattern that is generally stable";
  } else {
    intro = "Your analysis suggests your skin is showing several areas that could benefit from more targeted support";
  }

  const strongestList = metrics.filter(m => m.score >= 65).map(m => m.label);
  const concernList = metrics.filter(m => m.score < 65).map(m => m.label);

  let body = `Your analysis suggests a skin pattern that is ${avgScore >= 70 ? "generally healthy" : "generally stable"}, with the strongest areas being ${strongestList.length > 0 ? strongestList.join(" and ") : strongest.label}.`;

  if (concernList.length > 0) {
    body += ` The most noticeable concerns are ${concernList.join(" and ")}.`;
  }

  body += " This usually means your skin may benefit more from tone-evening support, barrier-safe hydration, and a less aggressive routine.";

  return body;
}

// Primary diagnosis summary cards
function getProfileCards(scan: any) {
  const hydration = Math.round((scan.hydration_score || 0.68) * 100);
  const oilBalance = Math.round((scan.oil_balance || 0.8) * 100);
  const irritation = Math.round((scan.irritation_probability || 0.15) * 100);

  // Determine skin type
  let skinType = "Balanced";
  if (oilBalance < 40 && hydration < 50) skinType = "Dry";
  else if (oilBalance > 75 && hydration < 60) skinType = "Oily";
  else if (oilBalance > 70 && hydration > 65) skinType = "Combination";
  else if (irritation > 30) skinType = "Sensitive";

  // Determine skin archetype
  let archetype = "Normal / Resilient";
  if (irritation > 25 && hydration < 60) archetype = "PIH-Prone / Barrier Sensitive";
  else if (hydration < 50) archetype = "Dehydration-Prone";
  else if (oilBalance > 75) archetype = "Sebum-Active / Congestion-Prone";
  else if (hydration > 75 && oilBalance > 60) archetype = "Balanced / Resilient";

  // Determine barrier condition
  let barrier = "Healthy";
  if (irritation > 35) barrier = "Stressed";
  else if (irritation > 20) barrier = "Mildly stressed";
  else if (hydration < 50) barrier = "Compromised";

  // Determine routine priority
  let priority = "Maintain + protect";
  if (hydration < 55) priority = "Hydrate + repair barrier";
  else if (irritation > 25) priority = "Soothe + strengthen";
  else if (oilBalance > 75) priority = "Balance + clarify";
  else priority = "Brighten + protect + repair";

  return [
    {
      label: "Skin Type",
      value: skinType,
      icon: Fingerprint,
      bgColor: "bg-skin-violet/10",
      iconColor: "text-skin-violet",
    },
    {
      label: "Skin Archetype",
      value: archetype,
      icon: Sparkles,
      bgColor: "bg-skin-gold/10",
      iconColor: "text-skin-gold",
    },
    {
      label: "Barrier Condition",
      value: barrier,
      icon: ShieldCheck,
      bgColor: irritation > 25 ? "bg-amber-500/10" : "bg-emerald-400/10",
      iconColor: irritation > 25 ? "text-amber-400" : "text-emerald-400",
    },
    {
      label: "Routine Priority",
      value: priority,
      icon: Zap,
      bgColor: "bg-skin-glow/10",
      iconColor: "text-skin-glow",
    },
  ];
}

// Product recommendations grouped by routine role
function getProductGroups(scan: any) {
  const hydration = Math.round((scan.hydration_score || 0.68) * 100);
  const pigmentation = Math.round((scan.pigmentation_score || 0.72) * 100);
  const irritation = Math.round((scan.irritation_probability || 0.15) * 100);
  const oilBalance = Math.round((scan.oil_balance || 0.8) * 100);

  const groups: { role: string; products: any[] }[] = [];

  // Cleanse group
  const cleanseProducts = [
    {
      name: "Gentle pH-Balanced Cleanser",
      category: "Cleanser",
      why: "A mild, non-stripping cleanser that respects your skin's natural acid mantle while removing daily buildup.",
      image: "",
      url: "/products/cleanser",
    },
  ];
  if (oilBalance > 70) {
    cleanseProducts.push({
      name: "Salicylic Acid Cleanser",
      category: "Cleanser",
      why: "Your oil balance suggests a gentle BHA cleanser could help manage excess sebum without over-drying.",
      image: "",
      url: "/products/bha-cleanser",
    });
  }
  groups.push({ role: "Cleanse", products: cleanseProducts });

  // Treat group
  const treatProducts: any[] = [];
  if (pigmentation < 70) {
    treatProducts.push({
      name: "Vitamin C Brightening Serum",
      category: "Treatment",
      why: "Your pigmentation score suggests a vitamin C serum could help support tone evenness and reduce dark spot visibility over time.",
      image: "",
      url: "/products/vitamin-c",
    });
  }
  if (irritation > 25) {
    treatProducts.push({
      name: "Centella Barrier Repair Serum",
      category: "Treatment",
      why: "Your barrier condition indicates centella or panthenol-based support could help strengthen your skin's natural defense.",
      image: "",
      url: "/products/centella",
    });
  }
  if (treatProducts.length === 0) {
    treatProducts.push({
      name: "Niacinamide 10% Serum",
      category: "Treatment",
      why: "A versatile treatment serum that supports pore refinement, tone evenness, and oil balance for overall skin health.",
      image: "",
      url: "/products/niacinamide",
    });
  }
  groups.push({ role: "Treat", products: treatProducts });

  // Hydrate group
  const hydrateProducts = [
    {
      name: "Hyaluronic Acid Hydrating Serum",
      category: "Hydration",
      why: hydration < 60
        ? "Your hydration levels suggest your skin would benefit from a multi-weight hyaluronic acid serum for deeper moisture support."
        : "A lightweight hydrating serum helps maintain your skin's moisture balance throughout the day.",
      image: "",
      url: "/products/hyaluronic-acid",
    },
  ];
  if (hydration < 55) {
    hydrateProducts.push({
      name: "Ceramide-Rich Moisturizer",
      category: "Hydration",
      why: "Your barrier condition suggests ceramide-based hydration could help repair and strengthen your skin's moisture barrier.",
      image: "",
      url: "/products/ceramide",
    });
  }
  groups.push({ role: "Hydrate", products: hydrateProducts });

  // Protect group
  groups.push({
    role: "Protect",
    products: [
      {
        name: "SPF 50+ Daily Sunscreen",
        category: "Protection",
        why: "Daily sun protection is the single most important step for preventing further pigmentation and maintaining your skin's improvements.",
        image: "",
        url: "/products/sunscreen",
      },
    ],
  });

  return groups;
}

// Routine step generators — category-based, not brand-based
function getMorningSteps(scan: any) {
  const hydration = Math.round((scan.hydration_score || 0.68) * 100);
  const pigmentation = Math.round((scan.pigmentation_score || 0.72) * 100);

  const steps = [
    {
      step: 1,
      category: "Gentle Cleanser",
      rationale: "A mild, pH-balanced cleanser removes overnight buildup without stripping your skin's natural moisture barrier.",
    },
    {
      step: 2,
      category: "Hydrating Serum",
      rationale: hydration < 60
        ? "Your hydration levels suggest your skin would benefit from a hyaluronic acid or glycerin-based serum to support moisture retention throughout the day."
        : "A lightweight hydrating serum helps maintain your skin's moisture balance and prepares it for the steps that follow.",
    },
  ];

  if (pigmentation < 70) {
    steps.push({
      step: 3,
      category: "Brightening Support",
      rationale: "A vitamin C or niacinamide-based serum helps support tone evenness and reduce the visibility of post-inflammatory pigmentation over time.",
    });
  }

  steps.push(
    {
      step: steps.length + 1,
      category: "Moisturizer",
      rationale: "A lightweight, barrier-supporting moisturizer locks in hydration and protects your skin throughout the day.",
    },
    {
      step: steps.length + 2,
      category: "SPF 50+",
      rationale: "Daily sun protection is the single most important step for preventing further pigmentation and maintaining the improvements from your routine.",
    }
  );

  return steps;
}

function getEveningSteps(scan: any) {
  const hydration = Math.round((scan.hydration_score || 0.68) * 100);
  const irritation = Math.round((scan.irritation_probability || 0.15) * 100);
  const pigmentation = Math.round((scan.pigmentation_score || 0.72) * 100);

  const steps = [
    {
      step: 1,
      category: "Gentle Cleanser",
      rationale: "A thorough but gentle cleanse removes sunscreen, pollution, and daily buildup without compromising your skin barrier.",
    },
  ];

  if (irritation > 25 || hydration < 55) {
    steps.push({
      step: 2,
      category: "Barrier-Support Serum",
      rationale: "Your barrier condition suggests your skin would benefit from ceramides, panthenol, or centella-based support to strengthen overnight recovery.",
    });
  } else {
    steps.push({
      step: 2,
      category: "Treatment Serum",
      rationale: "A targeted serum addresses your specific concerns while your skin is in its natural repair cycle overnight.",
    });
  }

  if (pigmentation < 70) {
    steps.push({
      step: steps.length + 1,
      category: "Pigmentation Treatment",
      rationale: "A gentle brightening treatment with alpha arbutin, tranexamic acid, or licorice root helps support tone evenness while you sleep.",
    });
  }

  steps.push({
    step: steps.length + 1,
    category: "Moisturizer",
    rationale: "A slightly richer evening moisturizer supports your skin's natural overnight repair process and prevents transepidermal water loss.",
  });

  return steps;
}

// Metric card data generator
function getMetricCards(scan: any) {
  const hydration = Math.round((scan.hydration_score || 0.68) * 100);
  const oilBalance = Math.round((scan.oil_balance || 0.8) * 100);
  const texture = Math.round((scan.texture_score || 0.55) * 100);
  const poreVisibility = Math.round((scan.pore_score || 0.6) * 100);
  const pigmentation = Math.round((scan.pigmentation_score || 0.72) * 100);
  const redness = Math.round((1 - (scan.irritation_probability || 0.15)) * 100);
  const breakoutRisk = Math.round((1 - (scan.acne_risk || 0.2)) * 100);

  function getStatus(score: number) {
    if (score >= 80) return { label: "Excellent", color: "text-emerald-400" };
    if (score >= 65) return { label: "Good", color: "text-emerald-400/80" };
    if (score >= 50) return { label: "Moderate", color: "text-amber-400" };
    if (score >= 35) return { label: "Needs attention", color: "text-amber-400/80" };
    return { label: "Priority concern", color: "text-red-400" };
  }

  function getBarColor(score: number) {
    if (score >= 65) return "bg-emerald-400/80";
    if (score >= 50) return "bg-amber-400/80";
    return "bg-red-400/80";
  }

  return [
    {
      label: "Hydration",
      score: hydration,
      status: getStatus(hydration).label,
      statusColor: getStatus(hydration).color,
      barColor: getBarColor(hydration),
      icon: Droplets,
      bgColor: "bg-skin-violet/10",
      iconColor: "text-skin-violet",
      explanation: hydration >= 65
        ? "Your skin appears reasonably hydrated, though some areas may benefit from more moisture retention support."
        : "Your skin shows signs of dehydration. Consider incorporating a hydrating serum and barrier-supporting moisturizer.",
    },
    {
      label: "Oil Balance",
      score: oilBalance,
      status: getStatus(oilBalance).label,
      statusColor: getStatus(oilBalance).color,
      barColor: getBarColor(oilBalance),
      icon: Zap,
      bgColor: "bg-skin-gold/10",
      iconColor: "text-skin-gold",
      explanation: oilBalance >= 65
        ? "Sebum production appears well-regulated. Your skin maintains a healthy oil-to-moisture ratio."
        : "Oil production appears uneven. A gentle balancing cleanser and lightweight moisturizer may help regulate sebum.",
    },
    {
      label: "Texture",
      score: texture,
      status: getStatus(texture).label,
      statusColor: getStatus(texture).color,
      barColor: getBarColor(texture),
      icon: Activity,
      bgColor: "bg-skin-glow/10",
      iconColor: "text-skin-glow",
      explanation: texture >= 65
        ? "Surface smoothness is generally good, with only slight texture inconsistency in some areas."
        : "Surface smoothness shows noticeable inconsistency. Gentle exfoliation and consistent hydration may help refine texture.",
    },
    {
      label: "Pore Visibility",
      score: poreVisibility,
      status: getStatus(poreVisibility).label,
      statusColor: getStatus(poreVisibility).color,
      barColor: getBarColor(poreVisibility),
      icon: Eye,
      bgColor: "bg-skin-violet/10",
      iconColor: "text-skin-violet",
      explanation: poreVisibility >= 65
        ? "Pores appear refined and minimally visible. Your skin's surface structure is in good condition."
        : "Pores appear more visible than ideal, particularly in the T-zone. Consistent cleansing and niacinamide may help.",
    },
    {
      label: "Pigmentation",
      score: pigmentation,
      status: getStatus(pigmentation).label,
      statusColor: getStatus(pigmentation).color,
      barColor: getBarColor(pigmentation),
      icon: Sun,
      bgColor: "bg-amber-500/10",
      iconColor: "text-amber-400",
      explanation: pigmentation >= 65
        ? "Skin tone appears relatively even, with only mild pigmentation irregularity in some areas."
        : "Visible uneven tone suggests mild to moderate pigmentation irregularity. Consistent sun protection and targeted brightening may help.",
    },
    {
      label: "Redness & Sensitivity",
      score: redness,
      status: getStatus(redness).label,
      statusColor: getStatus(redness).color,
      barColor: getBarColor(redness),
      icon: ShieldCheck,
      bgColor: "bg-red-400/10",
      iconColor: "text-red-400",
      explanation: redness >= 65
        ? "Your skin barrier appears resilient with minimal visible redness or sensitivity markers."
        : "Visible redness suggests mild barrier sensitivity. Gentle, fragrance-free products and barrier repair ingredients may help.",
    },
    {
      label: "Breakout Risk",
      score: breakoutRisk,
      status: getStatus(breakoutRisk).label,
      statusColor: getStatus(breakoutRisk).color,
      barColor: getBarColor(breakoutRisk),
      icon: Sparkles,
      bgColor: "bg-skin-glow/10",
      iconColor: "text-skin-glow",
      explanation: breakoutRisk >= 65
        ? "Current breakout indicators are low. Your skin appears clear with minimal active inflammation."
        : "Some breakout indicators are present. A consistent cleansing routine and targeted spot treatment may help manage active concerns.",
    },
  ];
}

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

      <div className="px-4 py-6 md:px-8 lg:px-12 space-y-8 md:space-y-10 max-w-7xl mx-auto relative z-10">
        {/* ===== ABOVE THE FOLD ===== */}
        {/* A. TOP RESULT SUMMARY — headline + summary + confidence */}
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 hover:bg-white/5 transition-all duration-300 ease-out">
                  <ArrowLeft size={18} />
                </Button>
              </Link>
              <Badge className="rounded-full px-3 py-1 bg-skin-violet/15 text-skin-violet border border-skin-violet/20 text-[10px] font-black uppercase tracking-widest">
                <CheckCircle2 size={10} className="mr-1.5" />
                Analysis Complete
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <ShareButton scanId={scan.id} />
              <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-white/5 transition-all duration-300 ease-out">
                <Download size={16} />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black tracking-[-0.03em] leading-[1.05] text-content-primary">
              Your Skin Analysis
            </h1>
            <p className="text-sm text-content-secondary leading-relaxed max-w-2xl">
              {intel.summary || "Your skin currently appears balanced in some areas, with mild pigmentation sensitivity and early texture concerns."}
            </p>
          </div>

          {/* Quick confidence indicators */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[11px] text-content-muted font-medium">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5">
              <Eye size={11} className="text-skin-violet" />
              Quality: {scan.scan_quality || 92}%
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5">
              <Sun size={11} className="text-skin-gold" />
              Lighting: {scan.lighting_quality || "Good"}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5">
              <ShieldCheck size={11} className="text-emerald-400" />
              Confidence: {scan.confidence || "High"}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5">
              <Clock size={11} />
              Just now
            </span>
          </div>
        </header>

        {/* B. IMAGE PREVIEW + TOP 3 CONCERNS — compact side-by-side */}
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-6">
          {/* Image preview — smaller, not full-height */}
          <GlassCard className="p-2 md:p-3">
            <div className="aspect-[4/3] relative rounded-[1.5rem] overflow-hidden bg-skin-surface">
              <img src={displayUrl || scan.image_url} alt="Scan" className="w-full h-full object-cover" />
              <AIDiagnosticOverlay 
                markers={[
                  { x: 45, y: 35, label: "Texture sequencing" },
                  { x: 30, y: 65, label: "Hydration check" },
                ]}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
              <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-wider text-white/80">{scan.scan_quality || 92}% quality</span>
              </div>
            </div>
          </GlassCard>

          {/* Right: Score + Top 3 concerns + Profile */}
          <div className="space-y-4">
            {/* Overall score — prominent */}
            <GlassCard className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-skin-muted">Overall Score</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <p className="text-4xl font-black text-skin-violet">{scan.skin_score || intel.skinScore || 0}</p>
                    <p className="text-sm font-bold text-skin-violet/40">/100</p>
                  </div>
                </div>
                <div className="w-24">
                  <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden border border-white/5 p-[1px]">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${scan.skin_score || intel.skinScore || 0}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className="h-full bg-gradient-to-r from-skin-violet to-skin-violet/60 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Top 3 key concerns */}
            <GlassCard className="p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-skin-muted mb-3">Top Concerns</p>
              <div className="space-y-2.5">
                {focusAreas.slice(0, 3).map((area: string, i: number) => (
                  <div key={area} className="flex items-center gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                      i === 0 ? "bg-amber-500/15" : i === 1 ? "bg-amber-500/10" : "bg-white/[0.04]"
                    )}>
                      <span className={cn(
                        "text-[10px] font-black",
                        i === 0 ? "text-amber-400" : i === 1 ? "text-amber-400/70" : "text-content-muted"
                      )}>{i + 1}</span>
                    </div>
                    <p className="text-sm font-bold text-content-primary">{area}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Skin profile mini */}
            <GlassCard className="p-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-skin-muted">Skin Type</p>
                  <p className="text-sm font-bold text-content-primary mt-0.5">{getProfileCards(scan)[0].value}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-skin-muted">Archetype</p>
                  <p className="text-sm font-bold text-content-primary mt-0.5 truncate">{getProfileCards(scan)[1].value}</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        <Button variant="ghost" className="w-full h-10 rounded-xl text-xs font-bold border border-white/5 text-content-secondary hover:bg-white/5 hover:text-content-primary transition-all duration-300 ease-out" onClick={() => router.push("/scan")}>
          <Camera size={14} className="mr-2" /> Retake Scan
        </Button>

        {/* ===== MID PAGE ===== */}
        {/* C. SKIN HEALTH SCORECARDS */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-content-primary">Skin Health Metrics</h3>
            <p className="text-sm text-content-secondary mt-0.5">Detailed analysis of your skin's current condition</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getMetricCards(scan).map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <GlassCard className="p-5 md:p-6 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", metric.bgColor)}>
                        <metric.icon size={18} className={metric.iconColor} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-content-primary">{metric.label}</p>
                        <p className={cn("text-[10px] font-black uppercase tracking-wider", metric.statusColor)}>
                          {metric.status}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-content-primary">{metric.score}</p>
                      <p className="text-[9px] font-bold text-content-muted opacity-40">/100</p>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.score}%` }}
                      transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: "circOut" }}
                      className={cn("h-full rounded-full", metric.barColor)}
                    />
                  </div>

                  <p className="text-xs text-content-muted leading-relaxed">{metric.explanation}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* D. AI INTERPRETATION — "What SkinMinder sees" */}
        <GlassCard className="p-5 md:p-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-skin-violet/10 flex items-center justify-center flex-shrink-0 border border-skin-violet/20 mt-0.5">
              <Sparkles size={16} className="text-skin-violet" />
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="text-base font-bold text-content-primary">What SkinMinder sees</h3>
                <p className="text-xs text-content-secondary mt-0.5">Intelligent interpretation of your skin patterns</p>
              </div>
              <p className="text-sm text-content-muted leading-relaxed">
                {intel.interpretation || generateInterpretation(scan)}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-skin-violet/10 border border-skin-violet/20">
                  <ShieldCheck size={10} className="text-skin-violet" />
                  <span className="text-[10px] font-bold text-skin-violet">Barrier-safe approach</span>
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-skin-gold/10 border border-skin-gold/20">
                  <Sun size={10} className="text-skin-gold" />
                  <span className="text-[10px] font-bold text-skin-gold">Sun protection advised</span>
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* E. PRIMARY DIAGNOSIS SUMMARY — Skin Profile */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-content-primary">Your Skin Profile</h3>
            <p className="text-sm text-content-secondary mt-0.5">Your personalized skin identity based on this analysis</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {getProfileCards(scan).map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <GlassCard className="p-5 md:p-6 h-full">
                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", card.bgColor)}>
                    <card.icon size={18} className={card.iconColor} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-skin-muted mb-1">{card.label}</p>
                  <p className="text-base font-bold text-content-primary leading-tight">{card.value}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* F. INTELLIGENCE MAP */}
        <GlassCard className="p-6 md:p-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-content-primary">Skin Health Map</h3>
            <p className="text-sm text-content-secondary mt-0.5">Multi-dimensional biological profile</p>
          </div>
          <SkinRadar />
        </GlassCard>

        {/* G. PREDICTIVE MODELING */}
        <PredictiveModeling />

        {/* H. PERSONALIZED ROUTINE — Morning / Evening */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-content-primary">Your Recommended Routine</h3>
            <p className="text-sm text-content-secondary mt-0.5">Category-based steps tailored to your skin profile</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Morning Routine */}
            <GlassCard className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <Sun size={20} className="text-amber-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-content-primary">Morning</h4>
                  <p className="text-[10px] text-content-muted font-medium">Protect + hydrate + brighten</p>
                </div>
              </div>

              <div className="space-y-4">
                {getMorningSteps(scan).map((step, i) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5"
                  >
                    <div className="w-7 h-7 rounded-full bg-skin-violet/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-[11px] font-black text-skin-violet">{step.step}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-content-primary">{step.category}</p>
                      <p className="text-xs text-content-muted leading-relaxed mt-0.5">{step.rationale}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Evening Routine */}
            <GlassCard className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-skin-violet/10 flex items-center justify-center border border-skin-violet/20">
                  <Sparkles size={20} className="text-skin-violet" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-content-primary">Evening</h4>
                  <p className="text-[10px] text-content-muted font-medium">Cleanse + treat + repair</p>
                </div>
              </div>

              <div className="space-y-4">
                {getEveningSteps(scan).map((step, i) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5"
                  >
                    <div className="w-7 h-7 rounded-full bg-skin-violet/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-[11px] font-black text-skin-violet">{step.step}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-content-primary">{step.category}</p>
                      <p className="text-xs text-content-muted leading-relaxed mt-0.5">{step.rationale}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* I. PRODUCT RECOMMENDATIONS */}
        <div className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-lg font-bold text-content-primary">Suggested Products for Your Skin Profile</h3>
              <p className="text-sm text-content-secondary mt-0.5">Matched to your routine goals and visible skin concerns</p>
            </div>
          </div>

          {/* Grouped by routine role */}
          {getProductGroups(scan).map((group) => (
            <div key={group.role} className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-skin-muted ml-1">{group.role}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.products.map((product, i) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <GlassCard className="p-4 h-full flex flex-col">
                      {/* Product image placeholder */}
                      <div className="aspect-square rounded-2xl bg-white/[0.03] border border-white/5 mb-4 flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center">
                            <Droplets size={20} className="text-content-muted opacity-30" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="rounded-full px-2 py-0.5 bg-skin-violet/10 text-skin-violet border border-skin-violet/20 text-[9px] font-black uppercase tracking-wider">
                            {product.category}
                          </Badge>
                        </div>
                        <p className="text-sm font-bold text-content-primary leading-tight mb-1">{product.name}</p>
                        <p className="text-xs text-content-muted leading-relaxed">{product.why}</p>
                      </div>

                      <Button
                        variant="ghost"
                        className="mt-4 w-full h-10 rounded-xl text-xs font-bold border border-white/5 text-content-secondary hover:bg-white/5 hover:text-content-primary transition-all duration-300 ease-out"
                        onClick={() => product.url && window.open(product.url, '_blank')}
                      >
                        View Product <ChevronRight size={12} className="ml-1" />
                      </Button>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          {/* Trust note */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <ShieldCheck size={16} className="text-skin-gold flex-shrink-0 mt-0.5" />
            <p className="text-xs text-content-muted leading-relaxed">
              Products are recommended based on your visible skin profile and routine goals. We do not sell these products and receive no commission — these are suggestions to help you build an effective routine.
            </p>
          </div>
        </div>

        {/* J. PROGRESS / RETENTION — "Track your skin over time" */}
        <GlassCard className="p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-skin-violet/10 flex items-center justify-center flex-shrink-0 border border-skin-violet/20">
                <Activity size={22} className="text-skin-violet" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-content-primary">Track Your Skin Over Time</h3>
                <div className="space-y-2">
                  {[
                    "Today's scan has been saved to your profile",
                    "Compare future scans to see what changes",
                    "Monitor pigmentation, hydration, and texture trends",
                    "Build a routine that improves over time",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                      <p className="text-sm text-content-secondary">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
              <Link href="/progress" className="w-full sm:w-auto">
                <Button className="w-full h-12 px-8 rounded-2xl font-bold shadow-xl shadow-skin-violet/20 transition-all duration-300 ease-out hover:scale-[1.01] active:scale-[0.98]">
                  Save Result & Track Progress
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full h-12 px-8 rounded-2xl font-bold border border-white/5 text-content-secondary hover:bg-white/5 hover:text-content-primary transition-all duration-300 ease-out"
                onClick={() => {
                  // Set a reminder for 7 days
                  router.push("/scan");
                }}
              >
                <Clock size={14} className="mr-2" />
                Scan Again in 7 Days
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* K. NEXT ACTIONS */}
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

        {/* M. CONFIDENCE + PRIVACY FOOTER */}
        <div className="flex flex-wrap items-center justify-center gap-6 py-6 text-[11px] text-content-muted font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-skin-gold" />
            Your scan was processed securely
          </span>
          <span className="hidden md:block h-1 w-1 rounded-full bg-white/15" />
          <span className="flex items-center gap-1.5">
            <Eye size={12} className="text-skin-violet" />
            Results are private to your account
          </span>
          <span className="hidden md:block h-1 w-1 rounded-full bg-white/15" />
          <span className="flex items-center gap-1.5">
            <AlertCircle size={12} className="text-amber-400" />
            SkinMinder provides cosmetic analysis, not medical diagnosis
          </span>
        </div>

        {/* L. MEDICAL DISCLAIMER */}
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
