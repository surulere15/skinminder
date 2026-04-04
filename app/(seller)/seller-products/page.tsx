"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Star,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const mockProducts = [
  { id: 1, name: "Hyaluronic Acid Serum", category: "Serum", matchScore: 94, views: 342, status: "active" },
  { id: 2, name: "SPF 50 Mineral Sunscreen", category: "Sunscreen", matchScore: 88, views: 287, status: "active" },
  { id: 3, name: "Retinol Night Cream", category: "Moisturizer", matchScore: 82, views: 198, status: "active" },
  { id: 4, name: "Vitamin C Brightening Toner", category: "Toner", matchScore: 76, views: 156, status: "draft" },
];

export default function SellerProductsPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-outfit font-black tracking-tight">Products</h1>
          <p className="text-content-muted font-medium text-lg">Manage your product catalog.</p>
        </div>
        <Button variant="premium" className="h-12 px-6 rounded-2xl font-bold gap-2">
          <Plus size={18} /> Add Product
        </Button>
      </header>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-content-secondary" size={20} />
        <Input placeholder="Search products..." className="h-14 pl-12 rounded-2xl border-2 text-base" />
      </div>

      {/* Product List */}
      <div className="space-y-4">
        {mockProducts.map((product) => (
          <Card key={product.id} className="border-none bg-white shadow-lg shadow-black/5 rounded-[2rem] hover:shadow-xl transition-shadow">
            <CardContent className="p-6 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center text-content-secondary">
                <Package size={24} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-outfit font-black text-lg">{product.name}</h3>
                  <Badge variant={product.status === "active" ? "default" : "secondary"} className="text-[8px]">
                    {product.status}
                  </Badge>
                </div>
                <p className="text-sm text-content-muted font-medium">{product.category}</p>
              </div>
              <div className="hidden md:flex items-center gap-6 text-center">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-content-muted">AI Match</p>
                  <p className="text-lg font-black text-primary-foreground">{product.matchScore}%</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-content-muted">Views</p>
                  <p className="text-lg font-black">{product.views}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-xl h-10 w-10">
                  <Edit size={16} />
                </Button>
                <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 text-destructive hover:text-destructive">
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
