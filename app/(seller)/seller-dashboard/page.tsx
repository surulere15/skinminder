"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Package,
  Users,
  TrendingUp,
  Eye,
  ShoppingBag,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const stats = [
  { label: "Total Products", value: "12", icon: Package, change: "+2 this month" },
  { label: "Total Views", value: "3,847", icon: Eye, change: "+18% growth" },
  { label: "Recommendations", value: "241", icon: Sparkles, change: "+32 this week" },
  { label: "Unique Customers", value: "89", icon: Users, change: "+12 new" },
];

export default function SellerDashboardPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <h1 className="text-4xl font-outfit font-black tracking-tight">Seller Dashboard</h1>
        <p className="text-content-muted font-medium text-lg">
          Track your product performance and customer engagement.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none bg-white shadow-lg shadow-black/5 rounded-[2rem] hover:shadow-xl transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center text-content-primary">
                  <stat.icon size={24} />
                </div>
                <Badge variant="secondary" className="text-[8px]">
                  {stat.change}
                </Badge>
              </div>
              <div>
                <p className="text-3xl font-outfit font-black">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-content-muted">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-none bg-primary text-content-glass rounded-[3rem] p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary pointer-events-none" />
          <div className="relative z-10 space-y-6">
          <ShoppingBag size={32} />
          <h3 className="text-2xl font-outfit font-black tracking-tight">Add New Product</h3>
          <p className="text-content-glass font-medium">List a new product for AI-powered recommendation matching.</p>
          <Button className="bg-white text-content-primary hover:bg-white/90 rounded-2xl h-12 px-8 font-bold">
            Add Product <ArrowUpRight className="ml-2" size={16} />
          </Button>
          </div>
        </Card>
        <Card className="border-none bg-[#111] text-content-glass rounded-[3rem] p-10 space-y-6">
          <BarChart3 size={32} />
          <h3 className="text-2xl font-outfit font-black tracking-tight">View Analytics</h3>
          <p className="text-content-glass font-medium">Deep-dive into recommendation performance and customer behavior.</p>
          <Button variant="outline" className="border-white/20 text-content-primary hover:bg-white/10 rounded-2xl h-12 px-8 font-bold">
            View Report <ArrowUpRight className="ml-2" size={16} />
          </Button>
        </Card>
      </div>
    </div>
  );
}
