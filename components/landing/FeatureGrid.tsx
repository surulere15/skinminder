import SectionHeading from "./SectionHeading";
import GlassCard from "./GlassCard";

export default function FeatureGrid() {
  const items = [
    ["Skin Scan", "Start with a guided photo-based skin check."],
    ["Clear Insights", "Understand visible concerns in calm, readable language."],
    ["Routine Guidance", "Get simple steps without overwhelming complexity."],
    ["Progress Tracking", "See changes over time and stay consistent."],
    ["Smart Reminders", "Keep your routine and scans on track."],
    ["Multi-Language Ready", "Designed for broader access across global markets."],
  ];

  return (
    <section id="features" className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Features"
          title="Built for a premium, useful, everyday experience."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map(([title, desc]) => (
            <GlassCard key={title} className="p-6">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/60">{desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
