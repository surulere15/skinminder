"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowLeft,
  Search,
  Globe,
  ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScanCapture } from "@/features/scan/components/scan-capture";
import { CinematicScanner } from "@/features/scan/components/cinematic-scanner";
import { uploadScan } from "@/lib/storage";

const instructions = [
  {
    title: 'Use natural light',
    description: 'Face a window or step outdoors for a clearer, more reliable scan.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2.5v2.5M12 19v2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2.5 12H5M19 12h2.5M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
      </svg>
    ),
  },
  {
    title: 'Hold steady',
    description: "Keep your face centered, about arm's length away.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
        <rect x="8" y="2.75" width="8" height="18.5" rx="2.5" />
        <path d="M10.75 5.5h2.5" />
      </svg>
    ),
  },
  {
    title: 'Neutral expression',
    description: 'Look directly at the camera and avoid heavy shadows.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.8" />
      </svg>
    ),
  },
]

const outcomes = [
  '7 skin intelligence metrics',
  'Tone, texture, oil, and hydration readout',
  'Personalized routine guidance',
  'Private result saved to your progress history',
]

const trustPoints = [
  'Encrypted analysis pipeline',
  'Melanin-aware assessment logic',
  'Cosmetic guidance, not medical diagnosis',
]

export default function TryPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isStationMode = searchParams?.get('mode') === 'station';
  const stationId = searchParams?.get('stationId');
  const sessionId = searchParams?.get('sessionId');

  const handleCapture = async (capturedFile: File) => {
    setPreview(URL.createObjectURL(capturedFile));
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
          stationId,
          sessionId
        })
      });

      if (!res.ok) throw new Error('Failed to analyze skin');

      const scan = await res.json();
      sessionStorage.setItem('skinminder_try_result', JSON.stringify(scan));
      
      setTimeout(() => {
        router.push(`/try/results`);
      }, 10000);
      
    } catch (error) {
      console.error("Scan error:", error);
      alert("Error analyzing scan. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,161,87,0.14),transparent_26%),radial-gradient(circle_at_20%_20%,rgba(201,161,87,0.08),transparent_22%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_30%)]" />
        <div className="absolute inset-y-0 left-0 w-[28rem] bg-[radial-gradient(circle_at_left,rgba(201,161,87,0.08),transparent_62%)]" />

        <header className="relative border-b border-white/10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#C9A157]/35 text-[#C9A157]">
                  ✦
                </div>
              </div>
              <div>
                <div className="text-[1.05rem] font-semibold tracking-[0.22em] text-white">SKINMINDER</div>
                <div className="text-[0.72rem] uppercase tracking-[0.3em] text-white/35">Intelligent Skin Guidance</div>
              </div>
            </Link>

            <div className="hidden items-center gap-8 text-sm text-white/60 md:flex">
              <Link href="#how-it-works" className="transition hover:text-white">How It Works</Link>
              <Link href="#results" className="transition hover:text-white">Results</Link>
              <Link href="#privacy" className="transition hover:text-white">Privacy</Link>
            </div>

            <Link href="/" className="hidden rounded-full border border-[#C9A157]/35 bg-[#C9A157] px-6 py-3 text-sm font-medium text-black transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(201,161,87,0.22)] md:inline-flex">
              Start Your Skin Scan
            </Link>
          </div>
        </header>

        <main className="relative mx-auto max-w-7xl px-6 pb-20 pt-12 lg:px-10 lg:pb-24 lg:pt-16">
          <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
            <section className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A157]/18 bg-[#C9A157]/8 px-4 py-2 text-[0.72rem] uppercase tracking-[0.28em] text-[#C9A157] shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                <span className="inline-block h-2 w-2 rounded-full bg-[#C9A157] shadow-[0_0_16px_rgba(201,161,87,0.85)]" />
                Intelligent Scan Protocol
              </div>

              <h1 className="mt-8 max-w-xl text-5xl font-semibold leading-[0.95] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
                Analyze Your Skin With Calm, Structured Precision.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-white/68 sm:text-lg">
                Capture one clear photo and SkinMinder evaluates visible skin patterns, scores key metrics, and prepares personalized routine guidance in seconds.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button 
                  onClick={() => document.getElementById('start-scan')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center justify-center rounded-full bg-[#C9A157] px-7 py-4 text-sm font-medium text-black transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_44px_rgba(201,161,87,0.28)]"
                >
                  Start Skin Analysis
                  <span className="ml-2">→</span>
                </button>
                <button 
                  onClick={() => router.push('/try/results')}
                  className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-7 py-4 text-sm font-medium text-white/90 backdrop-blur-xl transition hover:border-white/22 hover:bg-white/[0.05]"
                >
                  See Example Results
                </button>
              </div>

              <div className="mt-4 text-sm text-white/42">
                Takes 10 seconds • Private by default • No guesswork
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {instructions.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:border-[#C9A157]/22 hover:bg-white/[0.045]"
                  >
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#C9A157]/18 bg-[#C9A157]/8 text-[#C9A157]">
                      {item.icon}
                    </div>
                    <div className="text-base font-medium text-white">{item.title}</div>
                    <p className="mt-2 text-sm leading-6 text-white/55">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                  <div className="text-[0.72rem] uppercase tracking-[0.28em] text-[#C9A157]">What you'll get</div>
                  <ul className="mt-4 space-y-3">
                    {outcomes.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-6 text-white/72">
                        <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-[#C9A157]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div id="privacy" className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-[0.72rem] uppercase tracking-[0.28em] text-[#C9A157]">Privacy protected</div>
                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.7rem] uppercase tracking-[0.24em] text-white/45">
                      Secure
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {trustPoints.map((item) => (
                      <div key={item} className="flex gap-3 text-sm leading-6 text-white/68">
                        <span className="mt-1.5 text-[#C9A157]">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="relative" id="start-scan">
              <div className="absolute -right-10 top-8 hidden h-28 w-28 rounded-full bg-[#C9A157]/10 blur-3xl lg:block" />
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.48)] backdrop-blur-2xl sm:p-5 lg:p-6">
                <div className="rounded-[1.9rem] border border-white/10 bg-black/70 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[0.72rem] uppercase tracking-[0.28em] text-white/38">Scan workspace</div>
                      <div className="mt-2 text-2xl font-medium tracking-[-0.03em] text-white">Intelligent Skin Analysis</div>
                    </div>
                    <div className="rounded-full border border-[#C9A157]/18 bg-[#C9A157]/8 px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.24em] text-[#C9A157]">
                      AI Engine Active
                    </div>
                  </div>

                  <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[0.7rem] uppercase tracking-[0.24em] text-white/38">Before you scan</div>
                        <div className="mt-2 text-lg font-medium text-white">Optimal capture conditions</div>
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/45">
                        Ready
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {instructions.map((item) => (
                        <div key={item.title} className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
                          <div className="text-sm font-medium text-white">{item.title}</div>
                          <div className="mt-2 text-sm leading-6 text-white/52">{item.description}</div>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => {
                        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                        if (fileInput) fileInput.click();
                      }}
                      className="mt-5 flex w-full items-center justify-center rounded-[1.2rem] bg-[#C9A157] px-5 py-4 text-sm font-medium text-black transition duration-300 hover:scale-[1.01] hover:shadow-[0_0_48px_rgba(201,161,87,0.28)]"
                    >
                      <span className="mr-2">◉</span>
                      Start Skin Analysis
                    </button>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-[1.1rem] border border-white/10 bg-white/[0.03] p-4 text-sm text-white/62">
                        <div className="text-[0.68rem] uppercase tracking-[0.24em] text-[#C9A157]">Result speed</div>
                        <div className="mt-2 leading-6">Instant evaluation in seconds after capture.</div>
                      </div>
                      <div className="rounded-[1.1rem] border border-white/10 bg-white/[0.03] p-4 text-sm text-white/62">
                        <div className="text-[0.68rem] uppercase tracking-[0.24em] text-[#C9A157]">Metrics scored</div>
                        <div className="mt-2 leading-6">Hydration, oil, texture, tone, pores, redness, and breakout risk.</div>
                      </div>
                      <div className="rounded-[1.1rem] border border-white/10 bg-white/[0.03] p-4 text-sm text-white/62">
                        <div className="text-[0.68rem] uppercase tracking-[0.24em] text-[#C9A157]">Data privacy</div>
                        <div className="mt-2 leading-6">Encrypted processing with private result access by default.</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-white/58">
                    <div className="text-[0.7rem] uppercase tracking-[0.24em] text-[#C9A157]">Guidance note</div>
                    <p className="mt-3">
                      SkinMinder provides cosmetic analysis and structured routine guidance. It does not diagnose medical conditions.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
