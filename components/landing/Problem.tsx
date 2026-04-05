import GlassCard from "./GlassCard";

export default function Problem() {
  const pains = [
    {
      title: "Conflicting advice",
      desc: "Most skincare advice is generic. Your skin is not.",
    },
    {
      title: "Routine overload",
      desc: "More products do not always mean better results.",
    },
    {
      title: "No clear progress",
      desc: "It is hard to tell whether your skin is improving or just fluctuating.",
    },
  ];

  return (
    <section className="px-6 py-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c9a96e]">
            Why people need this
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
            Skincare gets confusing faster than it gets effective.
          </h2>
          <p className="mt-6 text-sm leading-8 text-white/66 md:text-base">
            Too many products. Too much advice. Not enough clarity on what your
            skin actually needs.
          </p>
          <p className="mt-4 text-sm leading-8 text-white/66 md:text-base">
            Most people are left guessing what is happening, what to use, and
            whether anything is really working.
          </p>
          <p className="mt-6 text-sm font-medium text-white/80">
            Skinminder brings structure, clarity, and consistency back into the
            process.
          </p>
        </div>

        <div className="space-y-4">
          {pains.map((item) => (
            <GlassCard key={item.title} className="p-6">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/60">{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
