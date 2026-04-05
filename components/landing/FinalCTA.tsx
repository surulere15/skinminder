import { ArrowRight } from "lucide-react";
import GlassCard from "./GlassCard";

export default function FinalCTA() {
  return (
    <section id="start" className="px-6 pb-20 md:pb-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="relative">
          {/* Subtle glow behind CTA */}
          <div className="pointer-events-none absolute -inset-8 rounded-[40px] bg-[#c9a96e]/8 blur-3xl" />
          <GlassCard className="relative overflow-hidden p-8 md:p-12">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-semibold tracking-[-0.03em] leading-[1.02] md:text-5xl">
                Start with more clarity.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/66 md:text-base md:leading-8">
                Get a clearer view of your skin, follow a simpler routine, and
                track progress with more confidence.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
                <a
                  href="/scan"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c9a96e] px-7 py-4 text-sm font-medium text-black shadow-[0_12px_40px_rgba(201,169,110,0.2)] transition-all duration-300 ease-out hover:scale-[1.01] hover:opacity-95 active:scale-[0.99]"
                >
                  Start Your Skin Scan
                  <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-medium text-white/86 transition-all duration-300 ease-out hover:-translate-y-[2px] hover:border-white/25 hover:bg-white/[0.06]"
                >
                  Sign In
                </a>
              </div>

              <p className="mt-5 text-sm text-white/45">
                Smarter skin guidance without the confusion.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
