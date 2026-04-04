"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Package, 
  Store, 
  Users, 
  Settings, 
  LogOut, 
  Sparkles,
  ExternalLink,
  Plus
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo3D } from "@/components/ui/logo-3d";

const institutionalNavItems = [
  { name: "Clinical Analytics", href: "/seller/dashboard", icon: BarChart3 },
  { name: "Asset Catalog", href: "/seller/products", icon: Package },
  { name: "Diagnostic Portal", href: "/seller/storefront", icon: Store },
  { name: "Patient Telemetry", href: "/seller/customers", icon: Users },
];

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen bg-[#121833]">
      {/* Institutional Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-[#0B1020] text-content-primary h-screen sticky top-0 flex flex-col p-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
             <span className="text-xl font-semibold tracking-tighter leading-none text-content-primary">SkinMinder</span>
             <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">Institutional</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {institutionalNavItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all group",
                pathname === item.href 
                  ? "bg-primary text-white shadow-xl shadow-primary/10" 
                  : "text-content-secondary hover:bg-white/5 hover:text-content-primary"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform group-hover:scale-110",
                pathname === item.href ? "text-white" : "text-content-secondary group-hover:text-content-primary"
              )} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-10 space-y-1">
          <Link 
            href="/seller/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-content-secondary hover:bg-white/5 transition-all"
          >
            <Settings className="w-5 h-5" /> Portal Settings
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-5 h-5" /> Exit Portal
          </button>
        </div>

        <div className="mt-6 p-6 rounded-3xl bg-[#1A2142] border border-white/5">
           <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Status: Institutional v4.2</p>
              <h4 className="font-bold text-sm text-content-primary">Predictive Mining Active</h4>
              <Button size="sm" className="w-full bg-primary text-white hover:bg-primary/90 rounded-xl font-bold h-9 shadow-lg">
                 <Plus className="w-4 h-4 mr-1" /> New Data Entry
              </Button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 border-b border-white/5 bg-[#0B1020]/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-50">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-xs font-bold uppercase tracking-widest text-content-secondary">Scientific Core Linked</span>
           </div>
           <div className="flex items-center gap-4">
              <Button variant="ghost" className="rounded-xl font-bold text-content-secondary hover:bg-white/5">
                 Technical Docs <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
              <div className="w-10 h-10 rounded-full bg-[#1A2142] border border-white/10 flex items-center justify-center font-bold text-xs text-primary">Lab</div>
           </div>
        </header>
        <div className="p-12 text-content-primary">
           {children}
        </div>
      </main>
    </div>
  );
}

import { Button } from "@/components/ui/button";
