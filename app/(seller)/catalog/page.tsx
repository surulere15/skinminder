"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Package, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Sparkles,
  TrendingUp,
  Tag,
  Loader2,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function SellerProductsPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadSellerProducts() {
      setIsLoading(true);
      // In a real app, filter by seller_id/brand
      const { data } = await supabase
        .from("products")
        .select("*")
        .ilike("name", `%${query}%`)
        .limit(20);
      
      setProducts(data || []);
      setIsLoading(false);
    }
    loadSellerProducts();
  }, [query]);

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-outfit font-black tracking-tight">Product Catalog</h1>
          <p className="text-content-muted font-medium text-lg">
             Manage your product listings and view AI-optimized performance metrics.
          </p>
        </div>
        <Button size="lg" className="h-16 px-10 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-black shadow-xl shadow-primary/20">
           <Plus className="mr-2 w-6 h-6 outline-none" strokeWidth={3} /> Add New Product
        </Button>
      </header>

      {/* Filters & Search */}
      <section className="flex flex-col md:flex-row gap-6">
         <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-content-secondary w-6 h-6" />
            <Input 
              placeholder="Search your catalog..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-16 pl-16 pr-6 rounded-2xl border-none shadow-xl bg-white text-lg font-bold"
            />
         </div>
         <div className="flex gap-4">
            <Button variant="outline" className="h-16 px-8 rounded-2xl font-black uppercase tracking-widest text-xs border-2 bg-white">
               Stock: Low to High
            </Button>
            <Button variant="outline" className="h-16 px-8 rounded-2xl font-black uppercase tracking-widest text-xs border-2 bg-white">
               Category: All
            </Button>
         </div>
      </section>

      {/* Product List */}
      <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
         <CardContent className="p-0">
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead>
                     <tr className="border-b bg-[#FAFAFA]">
                        <th className="px-10 py-6 text-left text-xs font-black uppercase tracking-widest text-content-muted">Product</th>
                        <th className="px-6 py-6 text-left text-xs font-black uppercase tracking-widest text-content-muted">Category</th>
                        <th className="px-6 py-6 text-left text-xs font-black uppercase tracking-widest text-content-muted">Price</th>
                        <th className="px-6 py-6 text-left text-xs font-black uppercase tracking-widest text-content-muted">AI Match Index</th>
                        <th className="px-6 py-6 text-left text-xs font-black uppercase tracking-widest text-content-muted">Status</th>
                        <th className="px-10 py-6 text-right text-xs font-black uppercase tracking-widest text-content-muted">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y">
                     {isLoading ? (
                       <tr>
                         <td colSpan={6} className="p-20 text-center">
                            <Loader2 className="animate-spin mx-auto w-10 h-10 text-content-secondary" />
                         </td>
                       </tr>
                     ) : products.length > 0 ? (
                       products.map((p) => (
                         <tr key={p.id} className="group hover:bg-[#F8F9FA] transition-colors">
                            <td className="px-10 py-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-xl bg-muted border flex items-center justify-center text-content-secondary group-hover:scale-105 transition-transform">
                                     <Package size={20} />
                                  </div>
                                  <div>
                                     <h4 className="font-bold text-base leading-tight">{p.name}</h4>
                                     <p className="text-xs text-content-muted font-medium truncate max-w-[200px]">{p.description || "High-performance formula."}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-6">
                               <span className="px-3 py-1 rounded-full bg-muted/50 text-content-primary text-[10px] font-black uppercase tracking-widest">
                                  {p.category}
                               </span>
                            </td>
                            <td className="px-6 py-6">
                               <span className="text-lg font-black font-outfit">${p.price || "45.00"}</span>
                            </td>
                            <td className="px-6 py-6">
                               <div className="flex items-center gap-2">
                                  <span className="text-xl font-black font-outfit text-primary-foreground">92%</span>
                                  <Sparkles size={14} className="text-primary-foreground" />
                               </div>
                               <p className="text-[10px] font-black uppercase tracking-widest text-content-muted">Optimization Rank</p>
                            </td>
                            <td className="px-6 py-6">
                               <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                  <span className="text-xs font-bold">Active</span>
                               </div>
                            </td>
                            <td className="px-10 py-6 text-right">
                               <div className="flex items-center justify-end gap-2">
                                  <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-white hover:shadow-md transition-all">
                                     <Edit3 size={18} />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-white hover:shadow-md transition-all text-destructive">
                                     <Trash2 size={18} />
                                  </Button>
                               </div>
                            </td>
                         </tr>
                       ))
                     ) : (
                       <tr>
                         <td colSpan={6} className="p-20 text-center space-y-4 opacity-50">
                            <Package size={48} className="mx-auto" />
                            <p className="font-outfit font-black text-xl">Your catalog is empty.</p>
                            <Button variant="outline" className="rounded-xl h-12 px-6">Add One Now</Button>
                         </td>
                       </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </CardContent>
      </Card>

      {/* Seller Quick Stats */}
      <div className="grid md:grid-cols-3 gap-8 pt-8">
         <Card className="border-none bg-[#111] text-content-glass rounded-[2.5rem] p-8 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-content-primary">
               <TrendingUp size={24} />
            </div>
            <div className="space-y-1">
               <h4 className="text-2xl font-outfit font-black tracking-tight">Market Opportunity</h4>
               <p className="text-content-glass text-sm font-medium">Your brand is trending in "Dry-Sensitive" user segments.</p>
            </div>
            <Button className="w-full bg-white text-content-primary hover:bg-white/90 rounded-xl font-bold h-12">
               Analyze High-Propensity Leads <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
         </Card>

         <Card className="border-none bg-white shadow-xl shadow-black/5 rounded-[2.5rem] p-8 space-y-6 flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center text-content-primary">
               <Tag size={24} />
            </div>
            <div className="space-y-1 flex-1">
               <h4 className="text-2xl font-outfit font-black tracking-tight">Active Promotions</h4>
               <p className="text-content-muted text-sm font-medium">You have 2 active campaigns ending in 4 days.</p>
            </div>
            <Button variant="outline" className="w-full rounded-xl border-2 font-bold h-12">
               Manage Campaigns
            </Button>
         </Card>

         <Card className="border-none bg-muted/50 border border-muted/50 rounded-[2.5rem] p-8 space-y-6 flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
               <Sparkles size={24} />
            </div>
            <div className="space-y-1 flex-1">
               <h4 className="text-2xl font-outfit font-black tracking-tight text-primary-foreground">Optimization Lab</h4>
               <p className="text-primary-foreground/80 text-sm font-medium">Unlock "Advanced Ingredient Sync" to increase match scores by 15%.</p>
            </div>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-black h-12 shadow-xl shadow-primary/20">
               Upgrade Portal <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
         </Card>
      </div>
    </div>
  );
}
