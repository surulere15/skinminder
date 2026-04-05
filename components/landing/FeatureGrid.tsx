import SectionHeading from "./SectionHeading";
import GlassCard from "./GlassCard";

export default function FeatureGrid() {
  const items = [
    ["Skin Scan", "Start with a guided photo-based check."],
    ["Clear Insights", "Understand visible concerns in plain language."],
    ["Routine Guidance", "Get simple steps without unnecessary complexity."],
    ["Progress Tracking", "See changes over time and stay consistent."],
    ["Smart Reminders", "Keep your routine and scans on track."],
    ["Multi-Language Ready", "Designed for broader access across global markets."],
  ];

  return (
    <section id="features" className="px-6 py-16 md:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Features"
          title="Built for a premium, useful, everyday experience."
        />

        <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 lg:grid-cols-3">
          {items.map(([title, desc]) => (
            <GlassCard key={title} className="p-7 transition-all duration-300 ease-out hover:-translate-y-[2px] hover:border-white/18 hover:bg-white/[0.05]">
              <h3 className="text-lg font-semibold tracking-[-0.02em]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/60">{desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
