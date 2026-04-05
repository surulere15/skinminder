import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import TrustStrip from "@/components/landing/TrustStrip";
import Problem from "@/components/landing/Problem";
import Solution from "@/components/landing/Solution";
import HowItWorks from "@/components/landing/HowItWorks";
import ResultsPreview from "@/components/landing/ResultsPreview";
import Benefits from "@/components/landing/Benefits";
import ProgressSection from "@/components/landing/ProgressSection";
import FeatureGrid from "@/components/landing/FeatureGrid";
import Credibility from "@/components/landing/Credibility";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-[#c9a96e]/12 blur-3xl" />
        <div className="absolute right-[-8%] top-[10%] h-[360px] w-[360px] rounded-full bg-white/[0.06] blur-3xl" />
        <div className="absolute bottom-[-8%] left-[25%] h-[300px] w-[300px] rounded-full bg-[#c9a96e]/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%),linear-gradient(to_bottom,#050505,#000000)]" />
      </div>

      <Header />
      <Hero />
      <TrustStrip />
      <Problem />
      <Solution />
      <HowItWorks />
      <ResultsPreview />
      <Benefits />
      <ProgressSection />
      <FeatureGrid />
      <Credibility />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
