"use client";

import { ShareButton } from '@/components/ui/share-button';
import { AIBrain } from "@/components/ui/ai-brain";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PremiumCard } from "@/components/ui/premium-card";
import { Droplets, Sun, Activity, Fingerprint, Loader2, Camera, ShieldCheck, Eye, Zap, Sparkles, AlertCircle, Clock, ChevronRight, ArrowLeft, Share2, Download, CheckCircle2, Dna } from "lucide-react";
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
  let skinType = "BALANCED";
  if (oilBalance < 40 && hydration < 50) skinType = "DRY";
  else if (oilBalance > 75 && hydration < 60) skinType = "OILY";
  else if (oilBalance > 70 && hydration > 65) skinType = "COMBINATION";
  else if (irritation > 30) skinType = "SENSITIVE";

  // Determine skin archetype
  let archetype = "ELITE / RESILIENT";
  if (irritation > 25 && hydration < 60) archetype = "PIH-PRONE / BARRIER SENSITIVE";
  else if (hydration < 50) archetype = "DEHYDRATION-PRONE";
  else if (oilBalance > 75) archetype = "SEBUM-ACTIVE / CONGESTION-PRONE";
  else if (hydration > 75 && oilBalance > 60) archetype = "BALANCED / RESILIENT";

  // Determine barrier condition
  let barrier = "HEALTHY";
  if (irritation > 35) barrier = "STRESSED";
  else if (irritation > 20) barrier = "MILDLY STRESSED";
  else if (hydration < 50) barrier = "COMPROMISED";

  // Determine routine priority
  let priority = "MAINTAIN + PROTECT";
  if (hydration < 55) priority = "HYDRATE + REPAIR BARRIER";
  else if (irritation > 25) priority = "SOOTHE + STRENGTHEN";
  else if (oilBalance > 75) priority = "BALANCE + CLARIFY";

  return [
    {
      label: "SKIN TYPE",
      value: skinType,
      icon: Fingerprint,
      variant: "master" as const,
    },
    {
      label: "ARCHETYPE",
      value: archetype,
      icon: Dna,
      variant: "elevated" as const,
    },
    {
      label: "BARRIER",
      value: barrier,
      icon: ShieldCheck,
      variant: "elevated" as const,
    },
    {
      label: "PRIORITY",
      value: priority,
      icon: Zap,
      variant: "elevated" as const,
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

  function getStatus(score: number) {
    if (score >= 80) return { label: "OPTIMAL", color: "text-emerald-400" };
    if (score >= 65) return { label: "STABLE", color: "text-emerald-400/80" };
    if (score >= 50) return { label: "MODERATE", color: "text-primary/70" };
    return { label: "CRITICAL", color: "text-red-400" };
  }

  return [
    {
      label: "HYDRATION",
      score: hydration,
      status: getStatus(hydration).label,
      statusColor: getStatus(hydration).color,
      icon: Droplets,
    },
    {
      label: "OIL BALANCE",
      score: oilBalance,
      status: getStatus(oilBalance).label,
      statusColor: getStatus(oilBalance).color,
      icon: Activity,
    },
    {
      label: "TEXTURE",
      score: texture,
      status: getStatus(texture).label,
      statusColor: getStatus(texture).color,
      icon: Fingerprint,
    },
    {
      label: "PORE FIDELITY",
      score: poreVisibility,
      status: getStatus(poreVisibility).label,
      statusColor: getStatus(poreVisibility).color,
      icon: Eye,
    },
    {
      label: "PIGMENTATION",
      score: pigmentation,
      status: getStatus(pigmentation).label,
      statusColor: getStatus(pigmentation).color,
      icon: Sun,
    },
    {
      label: "RESILIENCE",
      score: redness,
      status: getStatus(redness).label,
      statusColor: getStatus(redness).color,
      icon: ShieldCheck,
    },
  ];
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
        <p className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-[#c9a96e] animate-pulse">Decrypting biological sequence...</p>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 relative overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-[#c9a96e]/10 blur-3xl opacity-50" />
        </div>
        <AlertCircle size={48} className="text-white/20 mb-4" />
        <p className="text-xl font-black uppercase italic text-white mb-2 tracking-tight">Analysis not found</p>
        <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-10">This biological record could not be retrieved.</p>
        <Button variant="flagship" onClick={() => router.push("/dashboard")} className="h-14 px-8 shadow-lg shadow-[#c9a96e]/10">
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
    <div className="min-h-screen relative overflow-hidden bg-black text-white">
      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-[#c9a96e]/10 blur-3xl opacity-50" />
        <div className="absolute right-[-8%] top-[10%] h-[360px] w-[360px] rounded-full bg-white/[0.03] blur-3xl opacity-50" />
      </div>

      <div className="px-8 py-16 lg:px-16 space-y-24 max-w-7x mx-auto relative z-10">
        {/* ===== DIAGNOSTIC HEADER ===== */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 relative z-10 border-b border-white/5 pb-16">
          <div className="space-y-6 text-left flex-1">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="clinical-ghost" size="icon" className="rounded-2xl h-12 w-12 border-white/5">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20 shadow-glow italic">
                <CheckCircle2 size={14} /> Analysis Complete
              </div>
            </div>
            <h1 className="text-4xl lg:text-7xl text-diagnostic leading-none">Biological Report</h1>
            <p className="text-white/40 text-xl font-medium max-w-2xl border-l-2 border-primary/30 pl-8 py-1 italic">
               {intel.summary || "Biological signature decrypted. Dermal biomarkers analyzed for structural integrity and hydration sequencing."}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ShareButton scanId={scan.id} />
             <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-elite">
               <div className="relative flex h-2.5 w-2.5">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white/60 italic">Record Locked & Secure</span>
            </div>
          </div>
        </header>

        {/* Global metadata tokens */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] text-white/30 font-bold uppercase tracking-[0.25em]">
          <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5">
            <ShieldCheck size={14} className="text-emerald-400" /> CONFIDENCE: {scan.confidence || "OPTIMAL"}
          </span>
          <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5">
            <Sun size={14} className="text-primary" /> OPTICS: {scan.lighting_quality || "CLINICAL"}
          </span>
          <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5">
            <Activity size={14} className="text-primary" /> ENGINE: 128-LAYER NEURAL SCAN
          </span>
        </div>

        {/* B. OPTICAL PREVIEW + BIO-SCORE COMMAND CENTER */}
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12">
          {/* Optical Data Preview */}
          <div className="space-y-8">
             <div className="aspect-[4/3] rounded-[3.5rem] overflow-hidden shadow-elite border-8 border-white/5 group relative bg-black">
                <img src={displayUrl || scan.image_url} alt="Scan" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale brightness-125" />
                <AIDiagnosticOverlay 
                  markers={[
                    { x: 45, y: 35, label: "Dermal Integrity Sequencing" },
                    { x: 30, y: 65, label: "Hydration Biomarker Check" },
                  ]}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
                
                {/* Diagnostic Overlay */}
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-3xl bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Activity size={18} className="text-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic">Subject Metadata Verified</span>
                   </div>
                   <div className="text-xl font-black text-emerald-400 italic">{scan.scan_quality || 98}%</div>
                </div>
             </div>
          </div>

          {/* Bio-Score Hub */}
          <div className="space-y-8">
            <PremiumCard variant="master" className="p-10 border-white/5">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="relative shrink-0">
                   <div className="text-center">
                     <p className="text-label text-primary/60 mb-2">VITALITY QUOTIENT</p>
                     <div className="flex items-baseline justify-center gap-2">
                       <span className="text-8xl lg:text-9xl font-black text-primary italic leading-none">{scan.skin_score || intel.skinScore || 0}</span>
                       <span className="text-2xl font-black text-white/10 leading-none">/100</span>
                     </div>
                   </div>
                </div>
                
                <div className="flex-1 space-y-8">
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Differential Probability</p>
                       <span className="text-xs font-black text-primary italic">OPTIMAL RANGE</span>
                    </div>
                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-1">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${scan.skin_score || intel.skinScore || 0}%` }}
                        transition={{ duration: 2, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-primary via-primary/60 to-primary/20 rounded-full shadow-glow"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                    <div>
                      <p className="text-label text-white/20">ESTIMATED BIO-AGE</p>
                      <p className="text-2xl font-black text-white italic">{scan.skin_age_estimate || 26}YRS</p>
                    </div>
                    <div>
                      <p className="text-label text-white/20">RECOVERY RATE</p>
                      <p className="text-2xl font-black text-white italic">ACCELERATED</p>
                    </div>
                  </div>
                </div>
              </div>
            </PremiumCard>

            {/* Top 3 focus areas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {focusAreas.slice(0, 3).map((area: string, i: number) => (
                <PremiumCard key={area} variant="elevated" className="p-6 border-white/5 group hover:border-primary/20 transition-all duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black italic shadow-glow shrink-0 group-hover:scale-110 transition-transform">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest leading-none mb-1">PRIORITY</p>
                      <p className="text-sm font-black text-white italic uppercase tracking-tight truncate">{area}</p>
                    </div>
                  </div>
                </PremiumCard>
              ))}
            </div>
          </div>
        </div>
        {/* C. BIOLOGICAL METRICS GRID */}
        <div className="space-y-12">
          <div className="border-b border-white/5 pb-8">
            <h3 className="text-3xl lg:text-4xl text-diagnostic leading-none">Biological Metrics</h3>
            <p className="text-label text-white/30 mt-4 italic">High-fidelity analysis of primary dermal signals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getMetricCards(scan).map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <PremiumCard className="p-8 h-full border-white/5 group hover:border-primary/20 transition-all duration-500">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-glow">
                        <metric.icon size={22} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white italic tracking-widest">{metric.label}</p>
                        <p className={cn("text-[10px] font-black uppercase tracking-[0.2em] mt-1", metric.statusColor)}>
                          {metric.status}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-white italic">{metric.score}</p>
                      <p className="text-[10px] font-black text-white/10 uppercase tracking-widest">/100</p>
                    </div>
                  </div>

                  {/* High-fidelity score bar */}
                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.score}%` }}
                      transition={{ duration: 1.5, delay: 0.5 + i * 0.1, ease: "circOut" }}
                      className="h-full bg-primary/80 rounded-full shadow-glow"
                    />
                  </div>
                </PremiumCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* D. DERMAL IDENTITY SUMMARY */}
        <div className="space-y-12">
          <div className="border-b border-white/5 pb-8">
            <h3 className="text-3xl lg:text-4xl text-diagnostic leading-none">Dermal Identity</h3>
            <p className="text-label text-white/30 mt-4 italic">Decrypted biological signature and archetype mapping.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {getProfileCards(scan).map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <PremiumCard variant={card.variant} className="p-10 h-full border-white/5 group hover:border-primary/30 transition-all duration-500">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 border border-primary/20 shadow-glow transition-transform group-hover:scale-110">
                    <card.icon size={28} className="text-primary" />
                  </div>
                  <p className="text-label text-primary/60 mb-2 truncate">{card.label}</p>
                  <p className="text-2xl font-black text-white italic tracking-tighter leading-tight uppercase">{card.value}</p>
                </PremiumCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* E. NEURAL INTERPRETATION */}
        <PremiumCard variant="master" className="p-12 border-primary/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles size={120} className="text-primary" />
          </div>
          <div className="flex flex-col md:flex-row items-start gap-12 relative z-10">
            <div className="w-20 h-20 rounded-[2.5rem] bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shadow-glow shrink-0">
              <Activity size={36} className="animate-pulse" />
            </div>
            <div className="space-y-8 flex-1">
              <div className="space-y-2">
                <h3 className="text-3xl text-diagnostic">Neural Interpretation</h3>
                <p className="text-label text-white/30 italic">Synthetic intelligence analysis of dermal patterns</p>
              </div>
              <p className="text-xl text-white/60 leading-relaxed font-medium italic border-l-4 border-primary/20 pl-8 py-4">
                "{intel.interpretation || generateInterpretation(scan)}"
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <span className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-emerald-400/10 border border-emerald-400/20">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  <span className="text-xs font-black text-emerald-400 italic uppercase tracking-widest">Barrier Protocol: STABLE</span>
                </span>
                <span className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-primary/10 border border-primary/20">
                  <Sun size={16} className="text-primary" />
                  <span className="text-xs font-black text-primary italic uppercase tracking-widest">UV Resistance: MODERATE</span>
                </span>
              </div>
            </div>
          </div>
        </PremiumCard>

        {/* F. INTELLIGENCE MAP */}
        <PremiumCard className="p-12 border-white/5">
          <div className="mb-12 border-b border-white/5 pb-8">
            <h3 className="text-3xl lg:text-4xl text-diagnostic leading-none">Biological Pulse</h3>
            <p className="text-label text-white/30 mt-4 italic">Multi-dimensional biological profile mapping across 5 core vectors.</p>
          </div>
          <div className="p-8 bg-black/40 rounded-[3rem] border border-white/5 shadow-inner">
            <SkinRadar />
          </div>
        </PremiumCard>

        {/* G. PREDICTIVE MODELING */}
        <PredictiveModeling />

        {/* H. PERSONALIZED ROUTINE */}
        <div className="space-y-12">
          <div className="border-b border-white/5 pb-8">
            <h3 className="text-3xl lg:text-4xl text-diagnostic leading-none">Diagnostic Routine</h3>
            <p className="text-label text-white/30 mt-4 italic">Algorithmic-optimized protocol built for structural resilience.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Morning Routine */}
            <PremiumCard variant="elevated" className="p-10 border-white/5 group hover:border-primary/20 transition-all duration-500">
              <div className="flex items-center gap-6 mb-12">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-glow">
                  <Sun size={28} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white uppercase italic leading-none">Am Protocol</h4>
                  <p className="text-label text-white/20 mt-2 italic">PROTECT + HYDRATE + REINFORCE</p>
                </div>
              </div>

              <div className="space-y-6">
                {getMorningSteps(scan).map((step, i: number) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-start gap-6 p-6 rounded-3xl bg-black/40 border border-white/5 shadow-inner group/step hover:border-primary/20 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                      <span className="text-sm font-black text-primary italic">{step.step}</span>
                    </div>
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-widest italic">{step.category}</p>
                      <p className="text-xs text-white/30 leading-relaxed mt-2 italic">{step.rationale}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </PremiumCard>

            {/* Evening Routine */}
            <PremiumCard variant="elevated" className="p-10 border-white/5 group hover:border-primary/20 transition-all duration-500">
              <div className="flex items-center gap-6 mb-12">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/10 shadow-elite">
                  <Sparkles size={28} className="text-white/40" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white uppercase italic leading-none">Pm Protocol</h4>
                  <p className="text-label text-white/20 mt-2 italic">CLEANSE + TREAT + REGENERATE</p>
                </div>
              </div>

              <div className="space-y-6">
                {getEveningSteps(scan).map((step, i: number) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-start gap-6 p-6 rounded-3xl bg-black/40 border border-white/5 shadow-inner group/step hover:border-primary/20 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                      <span className="text-sm font-black text-white/40 italic">{step.step}</span>
                    </div>
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-widest italic">{step.category}</p>
                      <p className="text-xs text-white/30 leading-relaxed mt-2 italic">{step.rationale}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </PremiumCard>
          </div>
        </div>

        {/* I. BIOLOGICAL MATCHING */}
        <div className="space-y-12">
          <div className="border-b border-white/5 pb-8">
            <h3 className="text-3xl lg:text-4xl text-diagnostic leading-none">Biological Matching</h3>
            <p className="text-label text-white/30 mt-4 italic">Neural-matched protocols calibrated for your dermal signature.</p>
          </div>

          {/* Grouped by routine role */}
          {getProductGroups(scan).map((group) => (
            <div key={group.role} className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary ml-2 italic">{group.role} SEQUENCE</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {group.products.map((product, i: number) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <PremiumCard variant="elevated" className="p-8 h-full flex flex-col border-white/5 group hover:border-primary/20 transition-all duration-500">
                      <div className="aspect-square rounded-[2rem] bg-black border border-white/5 mb-8 flex items-center justify-center overflow-hidden relative shadow-elite group-hover:scale-[1.02] transition-transform duration-700">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale brightness-125 transition-all duration-700 group-hover:grayscale-0 group-hover:brightness-100" />
                        ) : (
                          <div className="w-20 h-20 rounded-3xl bg-white/[0.02] flex items-center justify-center border border-white/5">
                            <Droplets size={32} className="text-white/10" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[9px] font-black uppercase tracking-[0.1em] italic">
                            {product.category}
                          </span>
                        </div>
                        <p className="text-xl font-black text-white italic leading-tight uppercase tracking-tight">{product.name}</p>
                        <p className="text-xs text-white/30 leading-relaxed font-medium italic">{product.why}</p>
                      </div>

                      <Button
                        variant="flagship"
                        className="mt-10 w-full h-14 text-[10px] uppercase tracking-[0.2em]"
                        onClick={() => product.url && window.open(product.url, '_blank')}
                      >
                        Access Protocol Record <ChevronRight size={14} className="ml-2" />
                      </Button>
                    </PremiumCard>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          {/* Privacy Signal */}
          <div className="flex items-start gap-6 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl">
            <ShieldCheck size={24} className="text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] italic leading-relaxed">
              Diagnostic Integrity: Verification confirmed. Recommendations synthesized via neural pattern analysis without commercial bias.
            </p>
          </div>
        </div>

        {/* J. BIOLOGICAL TRAJECTORY */}
        <PremiumCard variant="master" className="p-12 border-primary/10 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 relative z-10">
            <div className="flex items-start gap-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-glow shrink-0">
                <Activity size={32} className="text-primary" />
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-3xl text-diagnostic">Biological Trajectory</h3>
                  <p className="text-label text-white/30 italic">Predictive modeling enabled for long-term outcome simulation.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Record secured to protocol vault",
                    "Neural trend line initialized",
                    "Multi-engine delta analysis active",
                    "Predictive simulations enabled",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-glow" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/progress">
              <Button variant="flagship" className="h-20 px-12 text-lg shadow-glow">
                Initialize Trajectory <ChevronRight className="ml-3 w-8 h-8" />
              </Button>
            </Link>
          </div>
        </PremiumCard>

        {/* K. GLOBAL ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-6 pt-12">
          <Link href="/scan/new" className="flex-1">
            <Button variant="clinical-ghost" className="w-full h-20 text-sm border-white/5 uppercase tracking-[0.2em] italic">
              <Camera size={18} className="mr-4 text-primary" /> Initiate New Capture Sequence
            </Button>
          </Link>
          <Link href="/routine" className="flex-1">
            <Button variant="clinical-ghost" className="w-full h-20 text-sm border-white/5 uppercase tracking-[0.2em] italic">
              Full Strategy Intelligence <ChevronRight className="ml-4" size={18} />
            </Button>
          </Link>
        </div>

        {/* L. GLOBAL DISCLAIMER */}
        <footer className="pt-24 pb-12 items-center flex flex-col gap-12">
           <PremiumCard variant="elevated" className="max-w-2xl p-10 opacity-60 border-white/5">
              <div className="flex items-start gap-6">
                <AlertCircle className="w-8 h-8 text-primary shrink-0 mt-0.5" />
                <div className="space-y-3">
                   <p className="text-xs font-black text-white italic uppercase tracking-wider">Clinical Intelligence Boundary</p>
                   <p className="text-[11px] text-white/30 leading-relaxed font-medium italic">
                      Diagnostic synthesis is for cosmetic wellness optimization via neural pattern recognition. Biological records provide directional insights and do not constitute clinical medical diagnosis. Consulting a board-certified dermatologist is advised for pathological concerns.
                   </p>
                </div>
              </div>
           </PremiumCard>
           
           <div className="flex flex-wrap items-center justify-center gap-12 text-[10px] text-white/10 font-bold uppercase tracking-[0.4em] italic">
              <span className="flex items-center gap-3"><ShieldCheck size={14} /> Encrypted Synthesis</span>
              <span className="flex items-center gap-3"><Eye size={14} /> Private Protocol</span>
              <span className="flex items-center gap-3"><Activity size={14} /> Neural Verified</span>
           </div>
        </footer>
      </div>
    </div>
  );
}
