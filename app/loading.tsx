import { Loader2, Sparkles } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-xl z-50 flex flex-col items-center justify-center h-screen">
      <div className="relative">
         <div className="absolute inset-0 border-4 border-muted/50 rounded-full animate-ping opacity-50" />
         <div className="w-20 h-20 bg-background border border-muted/50 shadow-2xl rounded-full flex items-center justify-center relative overflow-hidden">
             <Loader2 size={32} className="text-primary animate-spin" />
             <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/10 to-transparent" />
         </div>
      </div>
      <div className="mt-8 flex items-center gap-2 text-content-primary">
         <Sparkles size={16} className="animate-pulse" />
         <h3 className="font-outfit font-black tracking-widest uppercase text-sm">Reading your glow...</h3>
      </div>
    </div>
  );
}
