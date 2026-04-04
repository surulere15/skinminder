"use client";

import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ScanCapture } from "@/features/scan/components/scan-capture";
import { CinematicScanner } from "@/features/scan/components/cinematic-scanner";
import { uploadScan } from "@/lib/storage";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * Shadow DOM Wrapper for SkinMinder Widget
 * Ensures CSS isolation on partner sites (Shopify, Custom CMS).
 */
interface WidgetInterfaceProps {
  brandId?: string;
}

export function WidgetInterface({ brandId }: WidgetInterfaceProps) {
  const [partner, setPartner] = useState<any>(null);
  const [step, setStep] = useState<'capture' | 'analyzing' | 'logging'>('capture');
  const [capturedScan, setCapturedScan] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);

  React.useEffect(() => {
    if (containerRef.current && !containerRef.current.shadowRoot) {
      const root = containerRef.current.attachShadow({ mode: 'open' });
      
      // Inject Tailwind and Global styles into Shadow DOM
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/_next/static/css/app/globals.css';
      root.appendChild(link);

      setShadowRoot(root);
    }
  }, []);

  React.useEffect(() => {
    async function fetchPartner() {
      // In a real scenario, this fetches from Supabase by brandId
      // For the pilot, we simulate a 'Clinical Neutral' brand identity
      setPartner({
        id: 'clinical-neutral',
        settings: {
          brand_name: 'SkinMinder_Protocol',
          primary_color: '#2F6BFF',
          accent_color: '#00F5FF'
        }
      });
    }
    fetchPartner();
  }, []);

  const handleCapture = async (capturedFile: File) => {
    setPreview(URL.createObjectURL(capturedFile));
    setStep('analyzing');
    setIsUploading(true);
    
    try {
      const storagePath = await uploadScan(capturedFile);
      
      const res = await fetch('/api/try', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: storagePath,
          bodyArea: "Face", 
          concerns: [],
          metadata: { 
            partner_id: partner?.id, 
            source: "widget",
            theme: partner?.settings?.primary_color 
          }
        })
      });

      if (!res.ok) throw new Error('Failed to analyze skin');

      const scan = await res.json();
      setCapturedScan(scan);
      
      if (window.parent) {
          window.parent.postMessage({ type: 'SKINMINDER_SCAN_COMPLETE', scan }, '*');
      }

      sessionStorage.setItem('skinminder_try_result', JSON.stringify(scan));
      
      // Move to Product Logging step before final redirect
      setStep('logging');
    } catch (error) {
       console.error("Widget scan error:", error);
       alert("Error analyzing scan. Please try again.");
       setIsUploading(false);
    }
  };

  const handleLogIntervention = async (ingredients: string[]) => {
    // Update the scan record with intervention data for Cross-Brand Neutrality
    if (capturedScan?.scanId) {
        await fetch(`/api/scans/${capturedScan.scanId}/interventions`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredients })
        });
    }
    
    setTimeout(() => {
        window.location.href = `/try/results?partnerId=${partner?.id}&embedded=true`;
    }, 500);
  };

  const content = (
    <div 
      className="w-full max-w-lg mx-auto p-8 rounded-2xl bg-background border border-border shadow-diagnostic relative overflow-hidden text-foreground antialiased"
      style={{ '--partner-glow': partner?.settings?.primary_color || '#2F6BFF' } as any}
    >
      {step === 'capture' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
             <div className="space-y-1">
                <h2 className="text-xl font-bold tracking-tight">
                    {partner?.settings?.brand_name || "Skin Analysis"}
                </h2>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--skin-teal))]/40" />
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#64748B]">Diagnostics Active</span>
                </div>
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E7EDF3] border border-[#E7EDF3] text-[#0F172A]">
                <ShieldCheck size={12} className="text-[rgb(var(--skin-blue))]" />
                <span className="text-[10px] font-black uppercase tracking-wider">Secure Scan</span>
             </div>
          </div>

          <ScanCapture onCapture={handleCapture} />

          {/* Confidence Signal: The "Medical Trick" */}
          <div className="pt-6 border-t border-border grid grid-cols-3 gap-4">
             {[
               { label: "Luminance", val: "Optimal", color: "text-accent" },
               { label: "Vector", val: "Stabilized", color: "text-accent" },
               { label: "Resolution", val: "High-Res", color: "text-primary" }
             ].map((sig) => (
               <div key={sig.label} className="flex flex-col gap-1.5 p-3 rounded-xl bg-muted/30 border border-border/50">
                  <span className="text-[9px] uppercase text-muted-foreground font-bold tracking-[0.1em] opacity-60">{sig.label}</span>
                  <span className={cn("text-[10px] font-bold uppercase tracking-wider", sig.color)}>{sig.val}</span>
               </div>
             ))}
          </div>
        </div>
      )}

      {step === 'analyzing' && (
        <div className="h-[400px] relative">
           <CinematicScanner preview={preview!} />
        </div>
      )}

      {step === 'logging' && (
        <div className="space-y-8 py-6 text-left">
            <div className="space-y-3">
                <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#F7F8FA] border border-[#E7EDF3] text-[#64748B] text-[9px] font-black uppercase tracking-widest">Intelligence Calibration</div>
                <h3 className="text-3xl font-black tracking-tight text-[#0F172A] italic">Calibrate Sequence</h3>
                <p className="text-sm font-medium text-[#64748B] leading-relaxed">Select active molecules in your current routine to normalize population response data.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                {['Cleanser', 'Vitamin C', 'Retinol', 'Moisturizer', 'SPF', 'Niacinamide'].map(ing => (
                    <button 
                        key={ing}
                        onClick={() => handleLogIntervention([ing])}
                        className="p-5 rounded-2xl border border-[#E7EDF3] bg-[#F7F8FA] hover:bg-white hover:border-[rgb(var(--skin-blue))]/20 text-xs font-black transition-all text-left flex justify-between items-center group shadow-sm hover:shadow-md"
                    >
                        <span className="uppercase tracking-widest opacity-40 group-hover:opacity-100 group-hover:text-[rgb(var(--skin-blue))]">{ing}</span>
                        <div className="w-2 h-2 rounded-full border border-[#E7EDF3] group-hover:bg-[rgb(var(--skin-blue))] group-hover:border-[rgb(var(--skin-blue))] transition-all" />
                    </button>
                ))}
            </div>
 
            <button 
                onClick={() => handleLogIntervention([])}
                className="w-full py-4 text-[10px] text-muted-foreground hover:text-foreground font-bold uppercase tracking-[0.3em] transition-colors opacity-40 hover:opacity-100"
            >
                Bypass Calibration
            </button>
        </div>
      )}
      {/* Powered by SkinMinder Attribution */}
      <div className="absolute bottom-4 right-8 flex items-center gap-1.5 opacity-30 select-none pointer-events-none">
        <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-muted-foreground font-inter">Powered by</span>
        <span className="text-[10px] font-black tracking-tighter text-foreground font-inter">SkinMinder</span>
      </div>
    </div>
  );

  return (
    <div ref={containerRef}>
      {shadowRoot && createPortal(content, shadowRoot)}
    </div>
  );
}
