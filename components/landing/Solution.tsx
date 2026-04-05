import SectionHeading from "./SectionHeading";
import GlassCard from "./GlassCard";

export default function Solution() {
  const items = [
    ["Scan", "Guided skin check in seconds."],
    ["Understand", "See visible concerns more clearly."],
    ["Follow", "Use a simpler routine with confidence."],
    ["Track", "Monitor progress over time."],
  ];

  return (
    <section className="px-6 py-20 md:py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="The solution"
          title="Skinminder turns skin confusion into clear daily guidance."
          description="It helps you understand visible concerns, follow a simpler routine, and track progress over time — all in one calm, premium experience."
        />

        <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 lg:grid-cols-4">
          {items.map(([title, desc]) => (
            <GlassCard key={title} className="p-7 transition-all duration-300 ease-out hover:-translate-y-[2px] hover:border-white/18 hover:bg-white/[0.05]">
              <p className="text-lg font-semibold tracking-[-0.02em]">{title}</p>
              <p className="mt-3 text-sm leading-7 text-white/60">{desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
