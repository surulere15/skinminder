import SectionHeading from "./SectionHeading";
import GlassCard from "./GlassCard";

export default function HowItWorks() {
  const steps = [
    ["01", "Scan your skin", "Take a guided photo to begin your skin check."],
    ["02", "Get clear insights", "See readable observations and next-step guidance."],
    ["03", "Follow and improve", "Stay consistent and track how your skin changes over time."],
  ];

  return (
    <section id="how-it-works" className="px-6 py-20 md:py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="How it works"
          title="A simple process you can actually stick with."
          description="Built to feel clear, fast, and easy to repeat."
        />

        <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3">
          {steps.map(([num, title, desc]) => (
            <GlassCard key={num} className="p-7 md:p-8 transition-all duration-300 ease-out hover:-translate-y-[2px] hover:border-white/18 hover:bg-white/[0.05]">
              <p className="text-[11px] font-semibold tracking-[0.28em] text-[#c9a96e]">{num}</p>
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/60">{desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
