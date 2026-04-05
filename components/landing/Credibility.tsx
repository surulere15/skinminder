import SectionHeading from "./SectionHeading";
import GlassCard from "./GlassCard";

export default function Credibility() {
  const items = [
    ["Built for repeat use", "Designed around consistency, not one-time novelty."],
    ["Structured by design", "Output is organized to reduce confusion, not add more of it."],
    ["Designed to feel trustworthy", "Calm language, premium UI, and simple next steps."],
  ];

  return (
    <section className="px-6 py-16 md:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Why people will trust it"
          title="Built to feel thoughtful, useful, and safe."
        />

        <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3">
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
