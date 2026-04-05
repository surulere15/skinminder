import { Sparkles, ArrowRight } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="#" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] text-[#c9a96e]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.18em]">SKINMINDER</p>
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
              Intelligent Skin Guidance
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          <a href="#how-it-works" className="hover:text-white transition">
            How It Works
          </a>
          <a href="#results" className="hover:text-white transition">
            Results
          </a>
          <a href="#features" className="hover:text-white transition">
            Features
          </a>
          <a href="#faq" className="hover:text-white transition">
            FAQ
          </a>
        </nav>

        <a
          href="#start"
          className="inline-flex items-center gap-2 rounded-full bg-[#c9a96e] px-5 py-2.5 text-sm font-medium text-black transition hover:opacity-90"
        >
          Start Your Skin Scan
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}
