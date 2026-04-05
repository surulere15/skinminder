import SectionHeading from "./SectionHeading";
import GlassCard from "./GlassCard";

export default function Benefits() {
  const items = [
    ["Understand your skin", "See what may be happening without decoding random advice online."],
    ["Simplify your routine", "Focus on what matters instead of stacking too many products."],
    ["Track what changes", "Compare scans over time to see whether your routine is helping."],
    ["Stay consistent", "A clearer process makes it easier to keep going."],
  ];

  return (
    <section className="px-6 py-16 md:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Why it matters"
          title="Make better skin decisions with more clarity and less guesswork."
        />

        <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 lg:grid-cols-4">
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
