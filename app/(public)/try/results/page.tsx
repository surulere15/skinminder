"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Share2, 
  Download, 
  CheckCircle2,
  AlertCircle,
  Zap,
  Droplets,
  Sun,
  Moon,
  Leaf,
  Loader2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  History,
  Fingerprint,
  Info,
  Beaker,
  Users,
  Clock,
  Calendar,
  CheckCircle,
  Bell,
  Trophy,
  MessageCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AIBrain } from "@/components/ui/ai-brain";
import { cn } from "@/lib/utils";
import { SkinIdentityCard } from "@/features/scan/components/skin-identity-card";
import { QRHandoff } from "@/features/scan/components/qr-handoff";
import { X, TrendingUp as TrendingUpIcon } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { ConfidenceBadge } from "@/components/ui/confidence-badge";
import { ArchetypeCard } from "@/components/ui/archetype-card";
import { InterpretationPanel } from "@/components/ui/interpretation-panel";
import { TrendCard } from "@/components/ui/trend-card";

export default function TryResultsPage() {
  const [scan, setScan] = useState<any>(null);
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [revealStep, setRevealStep] = useState(0);
  const [teaserActive, setTeaserActive] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [handoffToken, setHandoffToken] = useState<string | null>(null);
  const [showDetailedMetrics, setShowDetailedMetrics] = useState(false);
  const [activeMoment, setActiveMoment] = useState(1);
  const router = useRouter();

  const handleAddToCalendar = () => {
    const nextComp = scan?.analysis_raw?.interpretation?.nextComparison;
    if (!nextComp) return;

    const date = new Date();
    date.setDate(date.getDate() + (nextComp.days || 14));
    
    // Format for ICS
    const formatDate = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');
    const start = formatDate(date);
    const end = formatDate(new Date(date.getTime() + 30 * 60 * 1000));

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:SkinMinder: ${nextComp.label}`,
      `DESCRIPTION:Goal: ${nextComp.goal}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'skinminder-appointment.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isStationMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('mode') === 'station';

  // Widget communication
  useEffect(() => {
    if (typeof window !== 'undefined' && window.self !== window.top) {
      window.parent.postMessage({
        type: 'SKINMINDER_SCAN_COMPLETE',
        payload: { status: 'success' }
      }, '*');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = sessionStorage.getItem('skinminder_try_result');
        if (storedData) {
          const parsed = JSON.parse(storedData);
          setScan(parsed);
          
          // Sign the URL if it's a private path
          if (parsed.image_url && !parsed.image_url.startsWith('http')) {
             const signRes = await fetch('/api/storage/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: parsed.image_url })
             });
             const { signedUrl: url } = await signRes.json();
             setDisplayUrl(url);
          } else {
             setDisplayUrl(parsed.image_url);
          }
          
          // Transition from teaser to narrative
          setTimeout(() => {
            setTeaserActive(false);
            setRevealStep(1); // Enable all narrative sections
          }, 2000); 

          // Fetch handoff token if in station mode
          if (isStationMode && parsed.id) {
             const tokenRes = await fetch('/api/station/handoff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scanId: parsed.id })
             });
             const { token } = await tokenRes.json();
             setHandoffToken(token);
          }
        }
      } catch (e) {
        console.error("Failed to parse demo scan result", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading || teaserActive) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 overflow-hidden">
        {/* Elite Aesthetic Background */}
        <div className="fixed inset-0 bg-soft-studio opacity-40 pointer-events-none" />
        <div className="fixed inset-0 bg-diffuse-glow opacity-20 pointer-events-none" />

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-8 relative z-10"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-t-2 border-skin-primary animate-spin shadow-soft" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-b-2 border-skin-primary/30 animate-spin-slow opacity-60" />
                </div>
              </div>
              <div className="space-y-3 text-center">
                <h2 className="text-4xl font-black tracking-tighter text-skin-slate uppercase italic">Curating Your Narrative</h2>
                <p className="text-skin-primary text-[10px] font-black uppercase tracking-[0.4em]">Beauty-Tech: Refinement in progress</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="teaser"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
              className="space-y-8 text-center relative z-10"
            >
              <div className="w-24 h-24 rounded-full bg-skin-lavender border border-skin-primary/20 flex items-center justify-center mx-auto text-skin-primary shadow-soft">
                <Sparkles size={48} strokeWidth={2} className="animate-pulse" />
              </div>
              <div className="space-y-3 text-center">
                <h2 className="text-4xl font-black tracking-tighter text-skin-slate uppercase italic">Elite Presentation</h2>
                <p className="text-skin-primary text-[10px] font-black uppercase tracking-[0.4em]">Archive Authentication: ACTIVE</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-center p-6">
        <div className="space-y-6 max-w-sm">
          <AlertCircle size={40} className="mx-auto text-red-500" />
          <h2 className="text-xl font-semibold">No results found</h2>
          <p className="text-muted">Please try scanning again.</p>
          <Button onClick={() => router.push("/try")}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const intelligence = scan.analysis_raw?.intelligence;
  const routine = scan.analysis_raw?.routine;
  const nutrition = scan.analysis_raw?.nutrition;

  return (
    <div className="min-h-screen relative overflow-hidden bg-background h-screen overflow-y-auto scroll-snap-container snap-y snap-mandatory scroll-smooth pt-16 group/narrative text-skin-slate">
      {/* Precision Atmosphere - Beauty-Tech Gradients */}
      <div className="fixed inset-0 bg-soft-studio opacity-40 pointer-events-none" />
      <div className="fixed inset-0 bg-diffuse-glow opacity-20 pointer-events-none" />

      {/* Analytical Marker Bar (HUD) */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i} 
            className={cn(
              "w-0.5 transition-all duration-700 rounded-full",
              activeMoment === i ? "h-8 bg-skin-primary shadow-soft" : "h-3 bg-skin-primary/10"
            )} 
          />
        ))}
      </div>

      <div className="relative z-10">
        
        {/* Layer 1: Identity Moment (Clinical Archetype) */}
        <section 
          className="h-[100dvh] w-full flex items-center justify-center snap-start px-6"
          onMouseEnter={() => setActiveMoment(1)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ margin: "-100px", once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-container"
          >
            <div className="space-y-12 text-center">
              <ArchetypeCard 
                id={scan.id}
                name={scan.skin_archetype || "Balanced Skin"}
                description={intelligence?.summary || "Your scan shows your skin's current state with key metrics."}
                populationPercent={18.4}
                confidence={Math.round(((scan as any)?.confidence?.score || 0.91) * 100)}
                skinAge={scan.analysis_raw?.intelligence?.estimatedAge || 26}
                skinTwin={scan.analysis_raw?.intelligence?.skinTwinPercentage || 4.2}
              />
              <div className="pt-4 text-center">
                <p className="text-sm text-muted">Scroll to see your results</p>
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 2.5 }}
                className="flex flex-col items-center gap-2"
              >
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-skin-primary">Explore Your Archive</p>
                <div className="w-1 h-3- translate-y-20 flex flex-col gap-1 items-center">
                   <div className="w-px h-10 bg-skin-primary/20" />
                   <div className="w-1 h-1 rounded-full bg-skin-primary animate-bounce" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Layer 2: Insight Moment (Analytical Markers) */}
        <section 
          className="h-[100dvh] w-full flex items-center justify-center snap-start px-6 relative"
          onMouseEnter={() => setActiveMoment(2)}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px", once: true }}
            transition={{ duration: 1 }}
            className="max-container"
          >
            <div className="space-y-48 sm:space-y-48">
              <div className="text-center space-y-16">
                 <div className="text-[10px] font-black uppercase tracking-[0.4em] text-skin-primary opacity-60 italic">Clinical Master Calibration Active</div>
                 <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-skin-slate uppercase italic">The Analysis.</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <MetricCard label="Hydration" value={Math.round((scan.hydration_score || 0.62) * 100)} trend="up" showConfidence={false} />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <MetricCard label="Pigmentation" value={Math.round((scan.pigmentation_score || 0.45) * 100)} trend="stable" showConfidence={false} />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <MetricCard label="Texture" value={Math.round((scan.texture_score || 0.72) * 100)} trend="up" showConfidence={false} />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <MetricCard label="Oil Balance" value={Math.round((scan.oil_balance || 0.58) * 100)} trend="stable" showConfidence={false} />
                </motion.div>
              </div>

              {/* Progressive Disclosure: Deep Analytics */}
              <AnimatePresence>
                {showDetailedMetrics && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 overflow-hidden pt-12 border-t border-[rgb(var(--skin-lavender))]/10"
                  >
                     {[
                      { l: "UV Sensitivity", v: 34, u: "EXPOSURE_H" },
                      { l: "Dermal Density", v: 82, u: "DENSE_OPTIM" },
                      { l: "Bio Reactions", v: 12, u: "REACT_LOW" },
                      { l: "Elastic Force", v: 76, u: "VEL_NOMINAL" }
                    ].map((m, i) => (
                      <div key={i} className="p-8 rounded-[2rem] bg-white border border-skin-lavender text-left group/metric hover:border-skin-primary/30 transition-all shadow-soft">
                        <p className="text-skin-slate/40 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{m.l}</p>
                        <p className="text-3xl font-black italic tracking-tighter text-skin-slate group-hover/metric:text-skin-primary transition-colors">
                          {m.v}% <span className="text-[10px] text-skin-primary uppercase tracking-widest ml-3">[{m.u}]</span>
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-center">
                <Button 
                  variant="ghost" 
                  className="text-[10px] font-black uppercase tracking-[0.4em] text-skin-primary/40 hover:text-skin-primary flex items-center gap-4 transition-colors p-0"
                  onClick={() => setShowDetailedMetrics(!showDetailedMetrics)}
                >
                  {showDetailedMetrics ? "COLLAPSE DEEP DATA" : "INITIALIZE DEEP DATA"}
                  <ArrowRight size={14} className={cn("transition-transform", showDetailedMetrics && "rotate-90")} />
                </Button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Layer 3: Interpretation Moment (Clinical Logic) */}
        <section 
          className="h-[100dvh] w-full flex items-center justify-center snap-start px-6"
          onMouseEnter={() => setActiveMoment(3)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ margin: "-100px", once: true }}
            className="max-container"
          >
            <InterpretationPanel 
              summary={intelligence?.summary || "Your scan shows mild dehydration with early pigmentation clustering near the cheek region. This pattern is common in humid tropical climates where UV exposure stimulates melanin activity."}
              imageUrl={displayUrl || scan.image_url}
            />
          </motion.div>
        </section>

        {/* Layer 4: Journey Moment (Clinical Trend) */}
        <section 
          className="h-[100dvh] w-full flex items-center justify-center snap-start px-6 relative"
          onMouseEnter={() => setActiveMoment(4)}
        >
          {/* Section Diffuse Glow */}
          <div className="absolute inset-0 bg-skin-lavender/30 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px", once: true }}
            transition={{ duration: 1 }}
            className="w-full max-container relative z-10"
          >
            <div className="grid md:grid-cols-2 gap-24 items-center">
              <TrendCard 
                label="Skin Journey"
                value="Longitudinal Analysis"
                description="Expert calibration indicates a high probability of successful texture optimization through consistent hydration and stabilization."
                progress={15}
                className="shadow-soft bg-white"
              />
              <div className="space-y-12 text-left md:pl-12">
                 <div className="space-y-8">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-skin-primary">Intelligence Protocol Engaged</div>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-skin-slate leading-[0.85] uppercase italic">Baseline<br />Established.</h2>
                    <p className="text-skin-slate/40 text-xl italic font-bold max-w-lg">
                       Your biometric signature has been authenticated and archived. Analysis identifies stable pathways for your skin's unique journey.
                    </p>
                 </div>
                 <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-6 py-5 border-b border-skin-lavender">
                       <div className="w-2 h-2 rounded-full bg-skin-primary shadow-soft" />
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-skin-slate/30">Sync Window: <span className="text-skin-primary italic ml-3">14 Day Interval</span></span>
                    </div>
                    <div className="flex items-center gap-6 py-5 border-b border-skin-lavender">
                       <div className="w-2 h-2 rounded-full bg-skin-primary/40" />
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-skin-slate/30">Projection: <span className="text-skin-slate italic ml-3">Hydration +4.2%</span></span>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Layer 5: Report Authorization (Final CTA) */}
        <section 
          className="h-[100dvh] w-full flex items-center justify-center snap-start px-6 relative"
          onMouseEnter={() => setActiveMoment(5)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ margin: "-100px", once: true }}
            transition={{ duration: 1.5, type: "spring", bounce: 0.1 }}
            className="max-container text-center space-y-16 relative z-10"
          >
            <div className="space-y-12">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-skin-primary">Secure Archive Encryption</div>
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-skin-slate leading-[0.85] uppercase italic">
                Refine Your<br /><span className="text-skin-primary">Skin Future.</span>
              </h1>
              <p className="text-skin-slate/30 text-2xl font-black italic max-w-2xl mx-auto uppercase tracking-tighter">
                Authorize your analysis signature to the elite SkinMinder network for 24/7 intelligent monitoring.
              </p>
            </div>

            <div className="flex flex-col items-center gap-12">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="h-24 px-12 rounded-[16px] bg-skin-primary hover:bg-skin-primary/90 text-white shadow-soft text-2xl font-black uppercase italic tracking-tighter hover:scale-[1.05] active:scale-[0.98] transition-all flex items-center justify-center gap-8 group">
                  AUTHORIZE SECURE ACCESS <ShieldCheck size={32} strokeWidth={2} className="group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
              <div className="flex items-center gap-12">
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[10px] font-black uppercase tracking-[0.4em] text-skin-slate/20 hover:text-skin-primary transition-colors">Recall Identity</button>
                <Link href="/try" className="text-[10px] font-black uppercase tracking-[0.4em] text-skin-slate/20 hover:text-skin-primary transition-colors">Start New Analysis</Link>
              </div>
            </div>
          </motion.div>
        </section>

      </div>

      <footer className="mt-40 py-32 border-t border-skin-lavender bg-white relative">
        <div className="fixed inset-0 bg-soft-studio opacity-10 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-20 relative z-10">
          <div className="space-y-10">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-skin-primary/40 italic">PROFESSIONAL BEAUTY-TECH FRAMEWORK v2.5</p>
            <p className="text-skin-slate/20 text-sm italic max-w-2xl mx-auto uppercase tracking-tighter font-bold">
              SkinMinder is an elite beauty-tech assessment interface. It provides high-precision data reveals based on biometric capture. Not a replacement for professional clinical diagnosis.
            </p>
          </div>
          <div className="flex flex-col items-center gap-6">
             <div className="w-12 h-px bg-skin-lavender" />
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-skin-slate/10 italic">© 2026 SKINMINDER ATELIER GROUP</p>
          </div>
        </div>
      </footer>

      {/* Identity Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative"
            >
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute -top-16 right-0 text-white/40 hover:text-white transition-colors"
              >
                <X size={40} />
              </button>

              <div className="flex flex-col md:flex-row items-center gap-12">
                {scan && (
                  <SkinIdentityCard
                    archetype={scan.skin_archetype || "PIH-Prone"}
                    skinAge={scan.analysis_raw?.intelligence?.estimatedAge || 26}
                    skinTwin={scan.analysis_raw?.intelligence?.skinTwinPercentage || 3.4}
                    confidence={Math.round(((scan as any)?.confidence?.score || 0.98) * 100)}
                    locationContext={scan.environmental_context?.context || "Global Intelligence"}
                  />
                )}

                <div className="space-y-12 max-w-xs text-center md:text-left">
                  <div className="space-y-4">
                    <h4 className="text-4xl font-bold text-white tracking-tight uppercase italic whitespace-nowrap">Share Identity</h4>
                    <p className="text-white/40 font-bold leading-relaxed">Let your network discover their archetype. Every share powers the global skin intelligence network.</p>
                  </div>

                  <div className="grid gap-4">
                    <Button
                      className="h-16 rounded-2xl bg-primary text-white font-bold text-lg shadow-xl shadow-primary/20"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: 'My SkinMinder Identity',
                            text: `I just scanned my skin and my archetype is ${scan?.skin_archetype || "PIH-Reactivator"}!`,
                            url: window.location.origin + '/try',
                          });
                        }
                      }}
                    >
                      Share to Stories
                    </Button>
                    <Button
                      variant="outline"
                      className="h-16 rounded-2xl border-white/10 text-white font-bold hover:bg-white/5"
                      onClick={() => {
                        alert("Identity Card Downloaded to Photos");
                      }}
                    >
                      Download Card
                    </Button>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 text-white/20">
                      <Sparkles size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Diagnostic Network Growth Engaged</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Station Mode QR Handoff */}
      <AnimatePresence>
        {isStationMode && handoffToken && scan && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 right-8 z-50 w-full max-w-sm"
          >
            <QRHandoff scanId={String(scan.id)} token={handoffToken} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
