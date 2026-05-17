import { Sidebar } from "@/components/layout/sidebar";
import { PageTransition } from "@/components/ui/page-transition";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black relative overflow-hidden">
      
      {/* ELITE POLISH: Master Dermal Mesh & Ambient Glows */}
      <div className="dermal-mesh" />
      <div className="fixed inset-0 pointer-events-none z-0 dermal-grid opacity-40" />

      <Sidebar className="relative z-30" />
      
      <main className="flex-1 overflow-y-auto relative z-10 w-full scroll-smooth">
        {/* Master Clinical Panel - The "Diagnostic Deck" */}
        <div className="min-h-[calc(100vh-2.5rem)] m-5 lg:m-8 bg-black/40 border border-white/5 rounded-[2.5rem] shadow-elite relative overflow-hidden backdrop-blur-md">
           {/* Inner Top Edge Highlight (Sheen) */}
           <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-20" />
           
           <div className="relative z-10 w-full min-h-full">
             <PageTransition>
               {children}
             </PageTransition>
           </div>
        </div>
      </main>
    </div>
  );
}
