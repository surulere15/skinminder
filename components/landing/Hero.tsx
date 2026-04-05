"use client";

import { ArrowRight, ChevronRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 pb-20 pt-20 md:pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-32">
        <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-2xl">
          <motion.p
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#c9a96e]"
          >
            <ShieldCheck className="h-4 w-4" />
            Intelligent Skin Guidance
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="text-4xl font-semibold leading-[0.95] tracking-[-0.04em] md:text-6xl lg:text-7xl"
          >
            Understand Your Skin.
            <br />
            <span className="text-white/72">Improve It Daily.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-xl text-sm leading-7 text-white/66 md:mt-7 md:text-base md:leading-8"
          >
            Scan your skin, get clear insights, and follow a simpler routine with more confidence.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a
              href="/scan"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c9a96e] px-7 py-4 text-sm font-medium text-black shadow-[0_12px_40px_rgba(201,169,110,0.2)] transition-all duration-300 ease-out hover:scale-[1.01] hover:opacity-95 active:scale-[0.99]"
            >
              Start Your Skin Scan
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-medium text-white/86 transition-all duration-300 ease-out hover:-translate-y-[2px] hover:border-white/25 hover:bg-white/[0.06]"
            >
              See How It Works
              <ChevronRight className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.p variants={fadeUp} className="mt-6 text-sm text-white/50">
            Clear guidance. No guesswork. Built for consistency.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="relative mx-auto w-full max-w-[560px]"
          style={{ animation: "float 8s ease-in-out infinite" }}
        >
          <div className="absolute inset-0 rounded-[40px] bg-[#c9a96e]/10 blur-3xl" />

          {/* Floating mini-card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -right-4 top-12 z-10 md:-right-6"
            style={{ animation: "float 6s ease-in-out infinite 2s" }}
          >
            <GlassCard className="rounded-[20px] border border-[#c9a96e]/20 bg-[#c9a96e]/10 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
              <p className="text-[11px] font-medium text-[#e6c98f]">+12% improvement</p>
              <p className="text-[10px] text-white/50">Skin clarity · Weekly</p>
            </GlassCard>
          </motion.div>

          <GlassCard className="relative overflow-hidden rounded-[36px] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
            <div className="rounded-[30px] border border-white/10 bg-black/70 p-4">
              <div className="mx-auto w-full max-w-[320px] rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.03))] p-3">
                <div className="rounded-[28px] border border-white/10 bg-black/70 px-4 pb-5 pt-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
                        Today&apos;s Scan
                      </p>
                      <p className="mt-1 text-sm font-medium">Skin Result</p>
                    </div>
                    <div className="rounded-full border border-[#c9a96e]/25 bg-[#c9a96e]/12 px-3 py-1 text-[11px] font-medium text-[#e6c98f]">
                      Medium confidence
                    </div>
                  </div>

                  {/* Scan area with subtle rings */}
                  <div className="mb-4 overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(201,169,110,0.24),rgba(255,255,255,0.03))] p-5">
                    <div className="relative mx-auto h-52 w-40">
                      <div className="absolute inset-0 rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))]" />
                      <div className="absolute inset-4 rounded-[16px] border border-white/5" />
                      <div className="absolute inset-8 rounded-[12px] border border-white/5" />
                      <div className="absolute right-3 top-6 h-2 w-2 rounded-full bg-[#c9a96e]/60" />
                      <div className="absolute bottom-8 left-4 h-1.5 w-1.5 rounded-full bg-[#c9a96e]/40" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <GlassCard className="p-4">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-[#c9a96e]">
                        Observations
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/78">
                        Mild breakouts, dark spots, balanced oil pattern.
                      </p>
                    </GlassCard>

                    <GlassCard className="p-4">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-[#c9a96e]">
                        Interpretation
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/78">
                        Consistent with mild acne and post-inflammatory marks.
                      </p>
                    </GlassCard>

                    <GlassCard className="p-4">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-[#c9a96e]">
                        Routine Guidance
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/78">
                        Gentle cleanser, niacinamide, moisturizer, sunscreen.
                      </p>
                    </GlassCard>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </section>
  );
}
