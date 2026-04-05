import GlassCard from "./GlassCard";

export default function ResultsPreview() {
  return (
    <section id="results" className="px-6 py-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c9a96e]">
            What you get
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
            Clear output, not generic AI noise.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-8 text-white/66 md:text-base">
            Skinminder is designed to give you useful, structured feedback that
            feels calm, readable, and practical.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-white/65">
            <li>• Clear observations in plain language</li>
            <li>• Practical routine guidance</li>
            <li>• Safety-aware communication</li>
            <li>• Less confusion, more confidence</li>
          </ul>
        </div>

        <GlassCard className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Observations", "Mild breakouts are visible along the cheeks with dark spots from previous irritation."],
              ["Interpretation", "This appears consistent with mild acne and post-inflammatory marks."],
              ["Routine Guidance", "Keep the routine simple: gentle cleanser, niacinamide, moisturizer, and daily sunscreen."],
              ["Safety Notes", "If your skin feels sensitive, avoid layering multiple strong treatments at once."],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
              >
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#c9a96e]">
                  {title}
                </p>
                <p className="mt-3 text-sm leading-7 text-white/70">{desc}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
