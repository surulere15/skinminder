import { ArrowRight } from "lucide-react";
import GlassCard from "./GlassCard";

export default function FinalCTA() {
  return (
    <section id="start" className="px-6 pb-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <GlassCard className="overflow-hidden p-8 md:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Start with more clarity.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-white/66 md:text-base">
              Get a clearer view of your skin, follow a simpler routine, and
              track progress with more confidence.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/scan"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c9a96e] px-7 py-4 text-sm font-medium text-black transition hover:opacity-90"
              >
                Start Your Skin Scan
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-medium text-white/86 transition hover:border-white/25 hover:bg-white/[0.06]"
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
    </section>
  );
}
