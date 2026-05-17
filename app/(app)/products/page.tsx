"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumCard } from "@/components/ui/premium-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ShoppingBag, 
  Sparkles, 
  Filter, 
  Heart, 
  Star,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Plus as PlusIcon
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        let q = supabase.from("products").select("*");
        
        if (category !== "all") {
          q = q.eq("category", category);
        }
        
        if (query.trim()) {
          q = q.ilike("name", `%${query}%`);
        }

        const { data } = await q.limit(20);
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, [category, query, supabase]);

  return (
    <div className="p-8 lg:p-16 space-y-16 max-w-7xl mx-auto bg-transparent min-h-full text-white relative">
      <div className="space-y-16 relative z-10">
        {/* Header: Diagnostic Title */}
        <header className="space-y-6 pb-12 border-b border-white/5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] shadow-glow italic">
            <ShoppingBag size={14} /> Curated Protocol Library
          </div>
          <h1 className="text-5xl lg:text-7xl text-diagnostic leading-none">Clinical Marketplace</h1>
          <p className="text-white/40 text-xl font-medium max-w-2xl border-l-2 border-primary/30 pl-8 py-2">
             Every product is cross-referenced with your clinical dermal profile for molecular compatibility and maximum biological efficacy.
          </p>
        </header>

        {/* Search & Interface Controls */}
        <section className="flex flex-col xl:flex-row gap-10">
           <div className="relative flex-1 group">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-white/20 w-7 h-7 group-focus-within:text-primary transition-colors duration-500" />
              <Input 
                placeholder="Search clinical catalog..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-20 pl-20 pr-8 rounded-[1.5rem] border-white/5 bg-white/[0.02] text-xl font-black uppercase italic tracking-widest shadow-elite focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all placeholder:text-white/10 text-white"
              />
           </div>
           <div className="flex gap-4 overflow-x-auto pb-4 xl:pb-0 scrollbar-hide">
              <Button 
                 variant={category === "all" ? "flagship" : "clinical-ghost"} 
                 className={cn("h-20 px-12 text-[11px]", category === "all" ? "shadow-glow" : "border-white/5 text-white/30")}
                 onClick={() => setCategory("all")}
              >
                 All Matrix
              </Button>
              {PRODUCT_CATEGORIES.map(cat => (
                <Button 
                  key={cat}
                  variant={category === cat ? "flagship" : "clinical-ghost"} 
                  className={cn("h-20 px-12 text-[11px]", category === cat ? "shadow-glow" : "border-white/5 text-white/30")}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
           </div>
        </section>

        {/* Product Matrix */}
        {isLoading ? (
          <div className="py-48 flex flex-col items-center justify-center space-y-10">
             <div className="relative">
               <Loader2 className="w-20 h-20 text-primary animate-spin opacity-20" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBag size={40} className="text-primary animate-pulse" />
               </div>
             </div>
             <p className="text-diagnostic text-primary/40 text-sm animate-pulse">Filtering Biological Curations...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
             {products.map((product) => (
                <PremiumCard
                  key={product.id}
                  variant="elevated"
                  className="p-0 border-white/5 group hover:border-primary/30 transition-all duration-700"
                >
                     <div className="aspect-[4/5] relative bg-black/40 flex items-center justify-center p-12 overflow-hidden">
                        {/* High-Fidelity Product Placeholder */}
                        <div className="w-full h-full rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/5 group-hover:scale-110 transition-transform duration-1000 ease-out">
                           <ShoppingBag size={64} className="opacity-10 group-hover:opacity-20 transition-opacity" />
                        </div>
                        
                        <div className="absolute top-8 right-8">
                           <button className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-md shadow-elite flex items-center justify-center text-white/30 hover:text-primary transition-all border border-white/10 group-hover:scale-110">
                              <Heart size={20} />
                           </button>
                        </div>
                        
                        <div className="absolute bottom-8 left-8 right-8">
                           <div className="px-5 py-2.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 border border-emerald-500/20 shadow-glow backdrop-blur-xl">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              {Math.floor(Math.random() * 15) + 84}% Bio-Match
                           </div>
                        </div>
                     </div>
                     
                     <div className="p-10 space-y-8 text-left">
                        <div className="space-y-3">
                           <p className="text-label text-primary/50">{product.brand || "Clinical Direct"}</p>
                           <h3 className="text-2xl text-diagnostic leading-tight">{product.name}</h3>
                        </div>
                        
                        <p className="text-sm font-medium text-white/30 line-clamp-3 leading-relaxed border-l border-white/10 pl-6 h-18 py-1">
                           {product.description || "Experimental dermatological compound engineered to recalibrate cutaneous stability."}
                        </p>
                        
                        <div className="pt-8 flex items-center justify-between border-t border-white/5">
                           <span className="text-3xl font-black text-white italic tracking-tighter">${product.price || "145.00"}</span>
                           <Button size="icon" variant="clinical" className="h-14 w-14 group-hover:scale-110 shadow-glow">
                              <PlusIcon size={28} />
                           </Button>
                        </div>
                     </div>
                </PremiumCard>
             ))}
          </div>
        ) : (
          <PremiumCard variant="master" className="py-32 text-center space-y-10 max-w-lg mx-auto opacity-60">
             <div className="w-36 h-36 rounded-[3.5rem] bg-white/[0.03] flex items-center justify-center mx-auto text-white/10 border border-white/5 shadow-inner">
                <Filter size={64} className="opacity-20" />
             </div>
             <div className="space-y-4">
                <h3 className="text-4xl text-diagnostic">Filtering Mismatch</h3>
                <p className="text-lg font-black uppercase tracking-[0.2em] text-primary/40">Adjust parameters for protocol synthesis.</p>
             </div>
             <Button variant="clinical-ghost" className="h-16 px-12" onClick={() => {setCategory("all"); setQuery("");}}>Reset Filter Logic</Button>
          </PremiumCard>
        )}

        {/* Featured Verification Banner */}
        <section className="pt-20 pb-32">
           <PremiumCard variant="master" className="p-16 lg:p-32 border-primary/20 relative overflow-hidden group shadow-glow">
              <div className="absolute inset-0 bg-gradient-to-br from-black via-primary/5 to-black pointer-events-none" />
              <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-24 w-full text-left">
                 <div className="space-y-12 max-w-3xl">
                    <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-primary/10 text-primary border border-primary/30 text-[11px] font-black uppercase tracking-[0.3em] shadow-glow italic">
                       <CheckCircle2 size={16} /> Molecular Verification Active
                    </div>
                    <h2 className="text-7xl lg:text-9xl text-diagnostic leading-[0.85] text-white">
                       Engineered <br /> for Your <span className="text-primary">DNA.</span>
                    </h2>
                    <p className="text-white/40 text-2xl font-medium leading-relaxed border-l-4 border-primary/30 pl-14 py-4 italic">
                       Our AI sequences every clinical compound against your real-time scan results. Zero biological error. Maximum efficacy.
                    </p>
                    <Button variant="flagship" className="h-24 px-20">
                       Analysis Sequence Mapping <Sparkles size={20} className="ml-4 animate-pulse" />
                    </Button>
                 </div>
                 <div className="w-96 h-96 xl:w-[480px] xl:h-[480px] rounded-[5rem] bg-white/[0.02] backdrop-blur-3xl border border-white/5 flex items-center justify-center relative shadow-elite group-hover:border-primary/20 transition-all duration-1000 ease-in-out">
                    <ShoppingBag size={140} className="text-primary opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-1000" />
                    {/* Floating Tech Widgets */}
                    <motion.div 
                      animate={{ y: [0, -20, 0], rotate: [12, 12, 12] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-12 -left-12 w-36 h-36 rounded-[2.5rem] bg-primary flex items-center justify-center shadow-glow text-black z-20"
                    >
                       <Sparkles size={56} />
                    </motion.div>
                    <div className="absolute -bottom-8 -right-8 p-6 rounded-[2rem] glass-master border-primary/30 text-primary z-20">
                       <div className="text-[10px] font-black uppercase tracking-widest mb-1">Stability Rate</div>
                       <div className="text-4xl text-diagnostic">99.2%</div>
                    </div>
                 </div>
              </div>
           </PremiumCard>
        </section>
      </div>
    </div>
  );
}
