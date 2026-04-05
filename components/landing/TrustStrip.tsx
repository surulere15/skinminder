export default function TrustStrip() {
  const items = [
    "Designed for multiple skin tones",
    "Built for repeat use, not one-time novelty",
    "Simple guidance without product overload",
    "Premium experience, globally ready",
  ];

  return (
    <section className="border-y border-white/8 bg-white/[0.02]">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 text-center text-sm text-white/55 md:grid-cols-4 lg:px-8">
        {items.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    </section>
  );
}
