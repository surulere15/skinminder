import SectionHeading from "./SectionHeading";
import GlassCard from "./GlassCard";

export default function Credibility() {
  const items = [
    ["Designed for real use", "Built for repeat skin checks, not one-time novelty."],
    ["Structured guidance", "Clear output designed to reduce confusion, not add more of it."],
    ["Premium experience", "A calm, polished interface that feels modern and credible."],
  ];

  return (
    <section className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Why people will trust it"
          title="Built to feel thoughtful, useful, and safe."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
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
