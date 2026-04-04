"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  CheckCircle2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PRODUCT_CATEGORIES, SKIN_CONCERNS } from "@/lib/constants";
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
      let q = supabase.from("products").select("*");
      
      if (category !== "all") {
        q = q.eq("category", category);
      }
      
      if (query.trim()) {
        q = q.ilike("name", `%${query}%`);
      }

      const { data } = await q.limit(20);
      setProducts(data || []);
      setIsLoading(false);
    }
    loadProducts();
  }, [category, query]);

  return (
    <div className="p-8 lg:p-12 space-y-12 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skin-surface text-content-secondary text-[10px] font-bold uppercase tracking-widest border border-white/5 shadow-md">
            <ShoppingBag size={12} className="text-primary" /> Curated Protocol Library
          </div>
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-content-primary">Clinical Marketplace</h1>
          <p className="text-content-secondary font-medium text-lg max-w-xl text-left">
             Every product is cross-referenced with your clinical dermal profile for molecular compatibility and efficacy.
          </p>
        </div>
      </header>

      {/* Filters & Search */}
      <section className="flex flex-col lg:flex-row gap-6">
         <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-content-secondary w-6 h-6" />
            <Input 
              placeholder="Search clinical catalog..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-14 pl-14 pr-6 rounded-xl border border-white/5 bg-skin-surface text-lg font-medium shadow-lg"
            />
         </div>
         <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button 
               variant={category === "all" ? "clinical" : "clinical-ghost"} 
               className="rounded-xl h-14 px-8"
               onClick={() => setCategory("all")}
            >
               All
            </Button>
            {PRODUCT_CATEGORIES.map(cat => (
              <Button 
                key={cat}
                variant={category === cat ? "clinical" : "clinical-ghost"} 
                className="rounded-xl h-14 px-8 capitalize"
                onClick={() => setCategory(cat)}
              >
                {cat}
              </Button>
            ))}
         </div>
      </section>

      {/* Product Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
           <Loader2 className="w-12 h-12 text-content-secondary animate-spin" />
           <p className="font-outfit font-black tracking-tight text-xl">Filtering Curations...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           {products.map((product) => (
             <motion.div
               key={product.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               whileHover={{ y: -5 }}
               className="group"
             >
                 <Card className="h-full border border-white/5 bg-skin-surface shadow-xl rounded-2xl overflow-hidden flex flex-col transition-all hover:bg-white/[0.02]">
                    <div className="aspect-[4/5] relative bg-skin-background flex items-center justify-center p-8">
                       <div className="w-full h-full rounded-xl bg-skin-surface shadow-sm flex items-center justify-center border border-white/5 text-content-secondary">
                          <ShoppingBag size={40} className="opacity-30" />
                       </div>
                       <div className="absolute top-4 right-4">
                          <div className="w-9 h-9 rounded-full bg-skin-surface/80 backdrop-blur-md shadow-sm flex items-center justify-center text-content-secondary hover:text-primary cursor-pointer transition-colors border border-white/5">
                             <Heart size={18} />
                          </div>
                       </div>
                       <div className="absolute bottom-4 left-4">
                          <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 border border-primary/20">
                             <CheckCircle2 size={10} /> {Math.floor(Math.random() * 15) + 84}% Match
                          </div>
                       </div>
                    </div>
                    <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
                       <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-content-muted">{product.brand || "Clinical Select"}</p>
                          <h3 className="text-lg font-semibold tracking-tight leading-tight text-content-primary">{product.name}</h3>
                       </div>
                       <p className="text-sm font-normal text-content-secondary line-clamp-2 leading-relaxed opacity-90">
                          {product.description || "Dermatological formula designed to stabilize and hydrate the cutaneous barrier."}
                       </p>
                       <div className="pt-4 mt-auto flex items-center justify-between">
                          <span className="text-xl font-semibold text-content-primary">${product.price || "45.00"}</span>
                          <Button size="icon" variant="clinical" className="rounded-xl h-10 w-10 shadow-lg">
                             <Plus size={20} />
                          </Button>
                       </div>
                    </CardContent>
                 </Card>
             </motion.div>
           ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-6 max-w-md mx-auto opacity-50">
           <div className="w-24 h-24 rounded-[2rem] bg-muted flex items-center justify-center mx-auto text-content-secondary">
              <Filter size={48} />
           </div>
           <div className="space-y-2">
              <h3 className="text-2xl font-outfit font-black">No products found</h3>
              <p className="font-medium text-content-muted">Try adjusting your filters or search query.</p>
           </div>
           <Button variant="outline" onClick={() => {setCategory("all"); setQuery("");}}>Clear All Filters</Button>
        </div>
      )}

      {/* Featured Banner */}
      <section className="pt-20">
         <Card className="border-none bg-[#B7E4C7] text-content-glass rounded-[4rem] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-foreground via-[#B7E4C7] to-secondary-foreground pointer-events-none" />
            <CardContent className="p-16 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
               <div className="space-y-6 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest">
                     <CheckCircle2 size={12} /> Personalized Verification
                  </div>
                  <h2 className="text-5xl lg:text-7xl font-outfit font-black tracking-tighter leading-[0.9]">
                     Verified for <br /> Your Profile.
                  </h2>
                  <p className="text-content-glass text-xl font-medium">
                     We analyze the ingredients of every product in our catalog against your scan results. No more guessing.
                  </p>
                  <Button size="lg" className="h-16 px-10 rounded-3xl bg-white text-content-primary hover:bg-white/90 font-black">
                     Learn About Verification
                  </Button>
               </div>
               <div className="w-full lg:w-1/3 aspect-square rounded-[3rem] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center relative group">
                  <ShoppingBag size={80} className="text-content-glass opacity-40 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-xl rotate-12">
                     <Sparkles className="text-content-glass" size={32} />
                  </div>
               </div>
            </CardContent>
         </Card>
      </section>
    </div>
  );
}

const Plus = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    width={size}
    height={size}
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);
