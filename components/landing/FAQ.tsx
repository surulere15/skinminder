import SectionHeading from "./SectionHeading";
import GlassCard from "./GlassCard";

export default function FAQ() {
  const faqs = [
    [
      "Does Skinminder diagnose skin conditions?",
      "No. Skinminder helps users understand visible skin patterns and follow clearer guidance. It does not replace professional medical care.",
    ],
    [
      "What can it help with?",
      "It helps you check visible concerns like breakouts, dark spots, redness, irritation, and routine consistency.",
    ],
    [
      "Why keep using it?",
      "Because the value increases over time. Repeated scans and progress tracking help you see whether your routine is working.",
    ],
    [
      "Is it for all skin tones?",
      "Skinminder is designed to support a broad range of skin tones and user contexts.",
    ],
    [
      "Is the routine complicated?",
      "No. The goal is to simplify what you do, not overload you.",
    ],
  ];

  return (
    <section id="faq" className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="FAQ"
          title="What people ask before they trust a product like this."
        />

        <div className="mt-14 space-y-4">
          {faqs.map(([q, a]) => (
            <GlassCard key={q} className="p-6">
              <h3 className="text-base font-semibold">{q}</h3>
              <p className="mt-3 text-sm leading-7 text-white/64">{a}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
