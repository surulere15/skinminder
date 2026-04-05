import { cn } from "@/lib/utils";

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/15 bg-white/[0.04] backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.22)]",
        className
      )}
    >
      {children}
    </div>
  );
}
