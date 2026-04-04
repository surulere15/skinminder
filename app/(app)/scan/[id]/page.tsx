"use client";

import { ShareButton } from '@/components/ui/share-button';
import { ShareReportCard } from '@/components/ui/share-report-card';
import { AIBrain } from "@/components/ui/ai-brain";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PremiumCard } from "@/components/ui/premium-card";
import { 
  Sparkles, 
  ArrowLeft, 
  Share2, 
  Download, 
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  ChevronRight,
  Droplets,
  Sun,
  Moon,
  Leaf,
  Loader2,
  Activity
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SkinRadar } from "@/components/dashboard/skin-radar";
import { ClinicalPrescription } from "@/components/ui/clinical-prescription";
import { AIDiagnosticOverlay } from "@/components/ui/ai-diagnostic-overlay";
import { ShieldAlert, Fingerprint } from "lucide-react";
import { PredictiveModeling } from "@/components/ui/predictive-modeling";

export default function ScanResultsPage() {
  const { id } = useParams();
  const [scan, setScan] = useState<any>(null);
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
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
          analysis_raw: {
            intelligence: {
              skinScore: 78,
              estimatedSkinAge: 27,
              primaryConcerns: ["boosting hydration", "evening out skin tone", "enhancing elasticity"],
              summary: "Your skin is looking wonderful! You have a strong foundation with great texture and clarity."
            }
          }
        });
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("skin_scans")
          .select("*")
          .eq("id", id)
          .single();
        if (data) {
          setScan(data);
          
          // Sign the URL if it's a private path
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
  }, [id, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-content-primary">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-content-primary p-6">
        <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-content-primary">
      <div className="p-4 sm:p-8 lg:p-12 space-y-12 max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div className="flex items-center gap-6">
            <Link href="/dashboard">
              <Button variant="clinical-ghost" size="icon" className="rounded-full w-12 h-12">
                <ArrowLeft />
              </Button>
            </Link>
            <div className="text-left space-y-1">
              <h1 className="text-3xl font-semibold tracking-tight text-content-primary">
                Clinical Dataset #{typeof id === 'string' ? id.slice(0, 8) : 'demo'}
              </h1>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-content-secondary">
                 <Clock size={12} className="text-primary" /> Analysis Completed
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShareButton scanId={scan.id} />
            <Button variant="clinical" className="h-12 px-8">
              <Download className="mr-2 w-5 h-5" /> Export Report
            </Button>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Panel: Imaging */}
          <div className="lg:col-span-12 xl:col-span-4 space-y-8">
            <div className="space-y-4">
               <h3 className="text-xs font-bold uppercase tracking-widest text-content-muted ml-1">Analytical Imaging</h3>
               <Card className="bg-skin-surface border border-white/5 p-3 rounded-[2.5rem] overflow-hidden shadow-2xl group relative transition-all duration-700">
                  <div className="aspect-[4/5] relative rounded-[2rem] overflow-hidden">
                    <img src={displayUrl || scan.image_url} alt="Scan" className="w-full h-full object-cover" />
                    
                    {/* HIGH-FIDELITY OVERLAY */}
                    <AIDiagnosticOverlay 
                      markers={[
                        { x: 45, y: 35, label: "Texture sequencing" },
                        { x: 30, y: 65, label: "Hydration check" },
                      ]}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
                      {scan.primary_concerns?.map((c: string) => (
                        <Badge key={c} variant="secondary" className="bg-primary/20 text-primary border-primary/20 backdrop-blur-md px-3 font-bold uppercase text-[9px] tracking-widest">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </div>
               </Card>
            </div>

             <Card className="bg-skin-surface border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
               {/* Decorative Background Element */}
               <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                  <Activity size={120} />
               </div>

               <div className="space-y-6 text-left relative z-10">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-content-muted">Dermal Marker Score</p>
                        <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em] opacity-60">Sequence #M-2049</p>
                     </div>
                     <div className="text-right">
                        <div className="flex items-baseline justify-end gap-1">
                           <p className="text-4xl font-semibold text-primary">{scan.skin_score}</p>
                           <p className="text-sm font-bold text-primary/40">/100</p>
                        </div>
                        <p className="text-[9px] font-bold text-content-muted uppercase tracking-widest mt-1">vs Biological Potential</p>
                     </div>
                  </div>

                  {/* Enhanced Progress Bar */}
                  <div className="space-y-3">
                    <div className="h-3 w-full bg-[#121833] rounded-full overflow-hidden border border-white/5 p-[2.5px]">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${scan.skin_score}%` }}
                          transition={{ duration: 2, ease: "circOut" }}
                          className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full shadow-[0_0_20px_rgba(var(--skin-medical-blue-rgb),0.3)]"
                       />
                    </div>
                    {/* Tick Marks */}
                    <div className="flex justify-between px-1">
                       {[0, 25, 50, 75, 100].map(tick => (
                         <div key={tick} className="flex flex-col items-center gap-1">
                            <div className="w-[1px] h-1 bg-white/10" />
                            <span className="text-[8px] font-bold text-content-muted opacity-40">{tick}</span>
                         </div>
                       ))}
                    </div>
                  </div>

                  <div className="flex gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/10 relative">
                     <div className="absolute top-0 left-0 w-1 h-full bg-primary/40 rounded-l-2xl" />
                     <ShieldAlert size={20} className="text-primary flex-shrink-0" />
                     <p className="text-xs font-medium text-content-secondary leading-relaxed">
                        Diagnostics indicate <span className="text-primary font-bold">Resilient Barrier Strength</span>. Current molecular stability is ranked in the <span className="text-content-primary font-bold">88th percentile</span> of biological peers.
                     </p>
                  </div>
               </div>
            </Card>

            {/* Dermal Signature Section */}
            <div className="space-y-4 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-content-muted ml-1 flex items-center gap-2">
                   <Fingerprint size={14} className="text-primary" /> Dermal Signature
                </h3>
                <div className="grid grid-cols-2 gap-3">
                   {[
                     { label: "Lipid Density", value: "High", trend: "Stable" },
                     { label: "Pore Profile", value: "Refined", trend: "Optimal" },
                     { label: "UVA Resilience", value: "82%", trend: "High" },
                     { label: "Sequence ID", value: "#X-2049", trend: "Verified" }
                   ].map((item, i) => (
                     <div key={i} className="p-4 rounded-2xl bg-[#121833] border border-white/5 flex flex-col gap-2 relative overflow-hidden group">
                        <div className="flex items-center justify-between">
                           <span className="text-[8px] font-black uppercase tracking-widest text-content-muted opacity-60">{item.label}</span>
                           <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
                        </div>
                        <div className="flex items-baseline justify-between">
                           <span className="text-base font-bold text-content-primary">{item.value}</span>
                           <span className="text-[7px] font-black uppercase tracking-tighter text-primary">{item.trend}</span>
                        </div>
                        {/* Static Grid Effect Background */}
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "10px 10px" }} />
                     </div>
                   ))}
                </div>
            </div>
          </div>

          {/* Right Panel: Intelligence Map & Protocols */}
          <div className="lg:col-span-12 xl:col-span-8 space-y-12">
            <PremiumCard className="bg-skin-surface border border-white/5 rounded-3xl p-8">
               <div className="flex items-center justify-between mb-8 text-left">
                  <div>
                    <h3 className="text-xl font-semibold text-content-primary">Skin Health Map</h3>
                    <p className="text-sm text-content-secondary">Multi-dimensional biological profile</p>
                  </div>
               </div>
               <SkinRadar />
            </PremiumCard>

            <PredictiveModeling />

            <section className="space-y-8">
               <ClinicalPrescription 
                 morning={[
                   { name: "Gentle Ph Barrier Cleanser", type: "Cleanser", why: "Low hydration baseline", match: "98%", benefit: "Maintains natural lipids" },
                   { name: "C15 Super Booster", type: "Serum", why: "Texture refinement needed", match: "94%", benefit: "Evens tone & clarity" }
                 ]}
                 night={[
                   { name: "Omga+ Lipid Cleanser", type: "Cleanser", why: "Double cleanse protocol", match: "96%", benefit: "Removes cellular debris" },
                   { name: "Clinical 1% Retinol", type: "Treatment", why: "Cellular renewal target", match: "92%", benefit: "Refines overall texture" }
                 ]}
               />
            </section>

            <div className="pt-8 flex flex-col sm:flex-row gap-6 items-center">
                <Link href="/scan/new" className="w-full sm:w-auto">
                  <Button variant="clinical-ghost" className="h-14 px-12 transition-all text-lg w-full sm:w-auto">
                     New Scan
                  </Button>
                </Link>
                <Link href="/routine" className="w-full sm:w-auto">
                  <Button variant="clinical" className="h-14 px-12 transition-all text-lg w-full sm:w-auto shadow-xl shadow-primary/20">
                     View Routine <ChevronRight className="ml-2" />
                  </Button>
                </Link>
             </div>

             {/* Medical Disclaimer */}
             <div className="mt-8 p-6 rounded-2xl bg-amber-50 border border-amber-200">
               <div className="flex items-start gap-3">
                 <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                 <div className="space-y-2">
                   <p className="font-semibold text-amber-800">Not a medical diagnosis</p>
                   <p className="text-sm text-amber-700">
                     This analysis is for cosmetic and informational purposes only. If you have concerning symptoms 
                     (new moles, persistent rashes, unusual spots), please consult a dermatologist.
                   </p>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
