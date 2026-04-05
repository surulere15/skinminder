import SectionHeading from "./SectionHeading";
import GlassCard from "./GlassCard";

export default function Benefits() {
  const items = [
    ["Understand your skin more clearly", "See what may be happening without trying to decode random advice online."],
    ["Simplify your routine", "Focus on what matters instead of stacking too many products."],
    ["Track real progress", "Compare scans over time to see whether your routine is actually helping."],
    ["Stay more consistent", "A clearer process makes it easier to keep going."],
  ];

  return (
    <section className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Why it matters"
          title="Make better skin decisions with more clarity and less guesswork."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
