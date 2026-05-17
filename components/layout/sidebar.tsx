"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  Sparkles, 
  Camera, 
  History, 
  Beaker, 
  Dna, 
  Users, 
  Apple,
  Activity,
  ShoppingBag,
  LogOut,
  Settings,
  ChevronRight,
  Zap
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

import { Logo3D } from "@/components/ui/logo-3d";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  highlight?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Intelligence",
    items: [
      { name: "Scan", href: "/scan/new", icon: Camera, highlight: true },
      { name: "Skin DNA", href: "/skin-dna", icon: Dna },
      { name: "Skin-Twin", href: "/skin-twin", icon: Sparkles },
    ]
  },
  {
    title: "Protocols",
    items: [
      { name: "Routine", href: "/routine", icon: Zap },
      { name: "Marketplace", href: "/products", icon: ShoppingBag },
      { name: "Nutrition", href: "/nutrition", icon: Apple },
    ]
  },
  {
    title: "Lab & Insights",
    items: [
      { name: "Ingredients", href: "/ingredients", icon: Beaker },
      { name: "Community", href: "/community", icon: Users },
      { name: "Analytics", href: "/progress", icon: History },
    ]
  }
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <aside className={cn("w-76 bg-black/40 backdrop-blur-3xl h-screen sticky top-0 flex flex-col p-8 overflow-y-auto scrollbar-hide border-r border-white/5", className)}>
      {/* Sidebar Header: Brand Hub */}
      <div className="flex items-center gap-4 mb-14 px-2 group shrink-0">
        <Link href="/dashboard" className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-elite hover:shadow-glow transition-all duration-500 ease-out"
          >
            <Sparkles className="text-black w-6 h-6" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter text-white uppercase italic leading-none">SkinMinder</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mt-1 opacity-80">AI Core v4.0</span>
          </div>
        </Link>
      </div>

      {/* Main Navigation: Diagnostic Hub */}
      <nav className="flex-1 space-y-10">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/25 px-4 italic">{section.title}</h3>
            <div className="space-y-1.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all group relative overflow-hidden italic",
                      isActive 
                        ? "active-hub" 
                        : "text-white/40 hover:bg-white/[0.04] hover:text-white"
                    )}
                  >
                    {/* Active Background Glow */}
                    {isActive && (
                      <motion.div 
                        layoutId="active-nav"
                        className="absolute inset-0 bg-primary/5 -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                     <item.icon className={cn(
                      "w-4 h-4 transition-all duration-500 group-hover:scale-125 group-hover:rotate-6",
                      isActive ? "text-primary" : "text-white/30 group-hover:text-white/80"
                    )} />
                    
                    <span className="flex-1 translate-y-[1px]">{item.name}</span>
                    
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-primary" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Highlight Dot for Key Actions */}
                    {item.highlight && !isActive && (
                      <span className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary shadow-glow animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer: Service & Status */}
      <div className="mt-12 space-y-6 shrink-0">
        <div className="pt-6 border-t border-white/5 space-y-1.5">
          <Link 
            href="/settings"
            className={cn(
              "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest italic transition-all group",
              pathname === "/settings" ? "text-white bg-white/5" : "text-white/30 hover:bg-white/5 hover:text-white/80"
            )}
          >
            <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-700" /> 
            <span className="translate-y-[1px]">Settings</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest italic text-red-500/40 hover:bg-red-500/5 hover:text-red-500/80 transition-all text-left"
          >
            <LogOut className="w-4 h-4" /> 
            <span className="translate-y-[1px]">Logout</span>
          </button>
        </div>

        {/* Intelligence Engine Status Card */}
        <div className="p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5 space-y-5 relative overflow-hidden group hover:border-primary/20 transition-all duration-500 shadow-elite">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm border border-primary/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <Activity className="w-6 h-6 animate-pulse-slow" />
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-1">Intelligence</p>
               <p className="text-sm font-black italic truncate text-white uppercase tracking-tighter">Active Sync</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/5 relative z-10 flex items-center justify-between">
             <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.15em] italic">V4.28 STABLE</p>
             <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-primary" />
                <div className="w-1 h-1 rounded-full bg-primary opacity-40" />
                <div className="w-1 h-1 rounded-full bg-primary opacity-20" />
             </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
