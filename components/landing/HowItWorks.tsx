import SectionHeading from "./SectionHeading";
import GlassCard from "./GlassCard";

export default function HowItWorks() {
  const steps = [
    ["01", "Scan your skin", "Take a guided photo to start your skin check."],
    ["02", "Get clear insights", "Understand visible patterns like acne, dark spots, irritation, and routine-related stress."],
    ["03", "Follow and improve", "Use a simple routine and track how your skin changes over time."],
  ];

  return (
    <section id="how-it-works" className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="How it works"
          title="A simple process you can actually stick with."
          description="Built to feel clear, fast, and easy to repeat."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {steps.map(([num, title, desc]) => (
            <GlassCard key={num} className="p-7">
              <p className="text-xs font-semibold tracking-[0.24em] text-[#c9a96e]">{num}</p>
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/60">{desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
