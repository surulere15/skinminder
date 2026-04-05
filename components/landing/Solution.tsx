import SectionHeading from "./SectionHeading";
import GlassCard from "./GlassCard";

export default function Solution() {
  const items = [
    ["Scan", "Capture a guided skin check in seconds."],
    ["Understand", "See what may be happening with breakouts, dark spots, redness, or irritation."],
    ["Follow", "Get a simple routine you can actually stay consistent with."],
    ["Track", "See whether your skin is improving over time."],
  ];

  return (
    <section className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="The solution"
          title="Skinminder turns skin confusion into clear daily guidance."
          description="It helps you understand visible concerns, follow a simpler routine, and track progress over time — all in one calm, premium experience."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map(([title, desc]) => (
            <GlassCard key={title} className="p-6">
              <p className="text-lg font-semibold">{title}</p>
              <p className="mt-3 text-sm leading-7 text-white/60">{desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
