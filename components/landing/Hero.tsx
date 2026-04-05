import { ArrowRight, ChevronRight, ShieldCheck } from "lucide-react";
import GlassCard from "./GlassCard";

export default function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-24">
        <div className="max-w-2xl">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#c9a96e]">
            <ShieldCheck className="h-4 w-4" />
            Intelligent Skin Guidance
          </p>

          <h1 className="text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
            Understand Your Skin.
            <br />
            <span className="text-white/72">Improve It Daily.</span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-white/68 md:text-lg">
            Scan your skin, get clear insights, and follow a simple routine that
            works — without guesswork, overwhelm, or confusing product advice.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a
              href="/scan"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c9a96e] px-7 py-4 text-sm font-medium text-black transition hover:opacity-90"
            >
              Start Your Skin Scan
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-medium text-white/86 transition hover:border-white/25 hover:bg-white/[0.06]"
            >
              See How It Works
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          <p className="mt-6 text-sm text-white/50">
            No diagnosis. No guesswork. Just clear, safe guidance.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[560px]">
          <div className="absolute inset-0 rounded-[40px] bg-[#c9a96e]/10 blur-3xl" />
          <GlassCard className="relative overflow-hidden rounded-[36px] p-3">
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
        </div>
      </div>
    </section>
  );
}
