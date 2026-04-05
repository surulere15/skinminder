export default function TrustStrip() {
  const items = [
    "Designed for diverse skin tones",
    "Built for repeat use",
    "Clear guidance, less overload",
    "Global-ready experience",
  ];

  return (
    <section className="border-y border-white/8 bg-white/[0.02]">
      <div className="mx-auto grid max-w-7xl gap-4 px-6 py-6 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-white/45 md:grid-cols-4 md:py-8 lg:px-8">
        {items.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    </section>
  );
}
