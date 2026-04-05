type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c9a96e] md:text-xs">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-[-0.03em] leading-[1.02] text-white md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/65 md:text-base md:leading-8">
          {description}
        </p>
      )}
    </div>
  );
}
