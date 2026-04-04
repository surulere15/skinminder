import { Sidebar } from "@/components/layout/sidebar";
import { Logo3D } from "@/components/ui/logo-3d";
import { AIBrain } from "@/components/ui/ai-brain";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-skin-dark relative overflow-hidden">
      
      {/* GLOBAL POLISH: Ambient Background Elements - Minimal Clinical Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         {/* Subtle Clinical Ambient Lighting */}
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(111,139,255,0.03),transparent_50%)]" />
         <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(63,182,139,0.02),transparent_50%)]" />
         
         {/* 3D Logo Watermark */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] blur-[1px]">
            <Logo3D className="w-[800px] h-[400px]" />
         </div>

         {/* AI Visualization Subtle Backdrop - Low Opacity Clinical Scanner */}
         <div className="absolute -bottom-32 -right-32 opacity-[0.03] scale-150">
            <AIBrain className="w-[500px] h-[500px]" />
         </div>
      </div>

      <Sidebar className="relative z-20 shadow-2xl" />
      
      <main className="flex-1 overflow-y-auto relative z-10 w-full">
        {/* Clinical Interface Panel Wrapper */}
        <div className="min-h-[calc(100vh-2rem)] m-4 mb-4 bg-skin-surface border border-white/5 rounded-2xl shadow-2xl relative overflow-hidden">
           {children}
        </div>
      </main>
    </div>
  );
}
