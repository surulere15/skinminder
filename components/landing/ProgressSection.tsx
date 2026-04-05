import GlassCard from "./GlassCard";

export default function ProgressSection() {
  return (
    <section className="px-6 py-20 md:py-24 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
        <GlassCard className="p-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-white/40">Before</p>
              <div className="mt-4 h-48 rounded-2xl border border-white/10 bg-white/[0.03]" />
            </div>
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-white/40">After</p>
              <div className="mt-4 h-48 rounded-2xl border border-white/10 bg-white/[0.03]" />
            </div>
          </div>
        </GlassCard>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c9a96e]">
            Progress over time
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] leading-[1.02] md:text-5xl">
            The value gets stronger the more you use it.
          </h2>
          <p className="mt-5 text-sm leading-7 text-white/66 md:text-base md:leading-8">
            Skinminder is built for more than one scan. Over time, it helps you
            see what is changing, what is stable, and whether your routine is
            moving in the right direction.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-white/65">
            <li>• Compare scans over time</li>
            <li>• Notice visible improvement or stability</li>
            <li>• Stay motivated with clearer feedback</li>
            <li>• Build a more consistent routine</li>
          </ul>

          <p className="mt-6 text-sm font-medium text-white/78">
            This is where skincare becomes less reactive and more intentional.
          </p>
        </div>
      </div>
    </section>
  );
}
