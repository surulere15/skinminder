"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  Sparkles, 
  LayoutDashboard, 
  Camera, 
  History, 
  Beaker, 
  UserCircle, 
  Dna, 
  Users, 
  MessageSquare,
  Apple,
  FlaskConical,
  Activity,
  ShoppingBag,
  LogOut,
  Settings
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const Zap = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M4 14.5L12 3L11 11H20L12 21L13 13H4Z" />
  </svg>
);

import { Logo3D } from "@/components/ui/logo-3d";

const navItems = [
  { name: "Scan", href: "/scan/new", icon: Camera, highlight: true },
  { name: "Skin Analysis", href: "/skin-dna", icon: Dna },
  { name: "Routine", href: "/routine", icon: Zap },
  { name: "Products", href: "/products", icon: ShoppingBag },
  { name: "Progress", href: "/progress", icon: History },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <aside className={cn("w-72 border-r border-white/5 bg-skin-surface h-screen sticky top-0 flex flex-col p-6 overflow-y-auto", className)}>
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
          <Sparkles className="text-white w-6 h-6" />
        </div>
        <Logo3D className="h-8 w-auto" />
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group",
              pathname === item.href 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-content-secondary hover:bg-white/5 hover:text-content-primary",
              item.highlight && ! (pathname === item.href) && "bg-primary/10 border border-primary/20"
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
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-content-primary hover:bg-white/5 transition-all"
        >
          <Settings className="w-5 h-5" /> Settings
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>

      <div className="mt-6 p-4 rounded-3xl bg-[#1A2142] border border-white/5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xs border border-primary/20">AI</div>
          <div className="flex-1 min-w-0">
             <p className="text-[10px] font-black uppercase tracking-widest text-primary">Intelligence Engine</p>
             <p className="text-sm font-bold truncate">Active Protocol</p>
          </div>
        </div>
        <div className="pt-2 border-t border-white/5">
           <p className="text-[9px] font-bold text-content-muted uppercase tracking-tighter">System: Predictive Modeling v4.2</p>
        </div>
      </div>
    </aside>
  );
}
