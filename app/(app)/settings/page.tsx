"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PremiumCard } from "@/components/ui/premium-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Shield,
  Bell,
  Palette,
  LogOut,
  Save,
  Loader2,
  ChevronRight,
  Sparkles,
  Globe,
} from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { useI18n } from "@/lib/i18n/use-i18n";
import { cn } from "@/lib/utils";

const SKIN_TYPES = ["Dry", "Oily", "Combination", "Sensitive", "Normal"];

export default function SettingsPage() {
  const { profile, isLoading, updateProfile } = useProfile();
  const { t, locale, setLocale, supportedLocales } = useI18n();
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [skinType, setSkinType] = useState("");

  // Sync form when profile loads
  React.useEffect(() => {
    if (profile) {
      setName(profile.full_name || "");
      setAge(profile.age?.toString() || "");
      setSkinType(profile.skin_type || "");
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        full_name: name,
        age: age ? parseInt(age) : null,
        skin_type: skinType.toLowerCase(),
      });
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 relative overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-[#c9a96e]/10 blur-3xl opacity-50" />
        </div>
        <div className="relative">
          <Loader2 className="w-12 h-12 text-[#c9a96e] animate-spin" />
          <motion.div
            className="absolute inset-0 rounded-full bg-[#c9a96e]/20"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <p className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-[#c9a96e] animate-pulse italic">Synchronizing Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white p-6 lg:p-12">
      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-[#c9a96e]/10 blur-3xl opacity-50" />
        <div className="absolute right-[-8%] top-[10%] h-[360px] w-[360px] rounded-full bg-white/[0.03] blur-3xl opacity-50" />
      </div>

      <div className="max-w-4xl mx-auto space-y-12 md:space-y-24 relative z-10">
        {/* Header */}
        <header className="space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-[0.25em] shadow-glow italic">
            <User size={14} className="text-primary" /> Biological Account
          </div>
          <h1 className="text-4xl lg:text-7xl text-diagnostic leading-none">Account Settings</h1>
          <p className="text-white/40 text-xl font-medium max-w-2xl border-l-2 border-primary/30 pl-8 py-1 italic">
             Configuration matrix for dermal parameters and clinical preferences.
          </p>
        </header>

      {/* Profile Section */}
        <PremiumCard variant="master" className="p-1 border-white/5 relative z-10">
          <div className="p-10 pb-0 border-b border-white/5">
            <h3 className="text-3xl text-diagnostic">Biological Profile</h3>
            <p className="text-label text-white/30 mt-4 italic">Baseline data synchronization for optimized skincare intelligence.</p>
          </div>
          <div className="p-10 space-y-12">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2 italic">Dermal Identifier</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-16 rounded-2xl bg-black/40 border-white/5 text-white placeholder:text-white/10 text-lg font-black focus-visible:ring-primary focus-visible:border-primary transition-all italic tracking-tight"
                  placeholder="Clinical ID"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2 italic">Biological Age</label>
                <Input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="h-16 rounded-2xl bg-black/40 border-white/5 text-white placeholder:text-white/10 text-lg font-black focus-visible:ring-primary focus-visible:border-primary transition-all italic tracking-tight"
                  placeholder="Years"
                />
              </div>
            </div>

            <div className="space-y-6">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2 italic">Baseline Dermal Category</label>
              <div className="flex flex-wrap gap-4">
                {SKIN_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSkinType(type.toLowerCase())}
                    className={cn(
                      "px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all border italic shadow-elite",
                      skinType === type.toLowerCase()
                        ? "border-primary bg-primary/10 text-primary shadow-glow scale-105"
                        : "border-white/5 bg-black/40 text-white/40 hover:border-white/20 hover:text-white/60"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-8 border-t border-white/5">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                variant="flagship"
                className="h-20 px-16 shadow-glow"
              >
                {isSaving ? (
                  <><Loader2 className="mr-4 animate-spin" size={24} /> Syncing Matrix...</>
                ) : (
                  <><Save className="mr-4" size={24} /> Update Parameters</>
                )}
              </Button>
            </div>
          </div>
        </PremiumCard>

      {/* Language */}
        <PremiumCard className="p-1 border-white/5 relative z-10">
          <div className="p-10 pb-0 border-b border-white/5">
            <h3 className="text-3xl text-diagnostic">Clinical Region</h3>
            <p className="text-label text-white/30 mt-4 italic">Linguistic configuration for biological intelligence reporting.</p>
          </div>
          <div className="p-10">
            <div className="flex flex-wrap gap-6">
              {supportedLocales.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => setLocale(loc.code)}
                  className={cn(
                    "flex items-center gap-4 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border italic shadow-elite",
                    locale === loc.code
                      ? "border-primary bg-primary/10 text-primary shadow-glow scale-105"
                      : "border-white/5 bg-black/40 text-white/40 hover:border-white/20 hover:text-white/60"
                  )}
                >
                  <Globe size={18} className={locale === loc.code ? "text-primary" : "text-white/20"} />
                  <span className="text-lg">{loc.flag}</span>
                  <span>{loc.name}</span>
                </button>
              ))}
            </div>
          </div>
        </PremiumCard>

      {/* Preferences */}
        <div className="grid md:grid-cols-2 gap-8 relative z-10">
          <PremiumCard className="p-10 border-white/5 space-y-8 group hover:border-primary/20 transition-all duration-500 cursor-pointer">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-glow transition-all group-hover:scale-110">
              <Bell size={32} />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl text-diagnostic leading-none">Signal Alerts</h3>
              <p className="text-label text-white/30 italic">Temporal routine notifications and status updates.</p>
            </div>
            <span className="inline-flex px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 italic">MODULE ENCRYPTED</span>
          </PremiumCard>

          <PremiumCard className="p-10 border-white/5 space-y-8 group hover:border-primary/20 transition-all duration-500 cursor-pointer">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-glow transition-all group-hover:scale-110">
              <Shield size={32} />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl text-diagnostic leading-none">Privacy Node</h3>
              <p className="text-label text-white/30 italic">Secure data management and biological vault architecture.</p>
            </div>
            <div className="flex justify-end pr-4">
              <ChevronRight className="text-primary/40 group-hover:translate-x-4 group-hover:text-primary transition-all transition-transform duration-500" size={32} />
            </div>
          </PremiumCard>
        </div>

      {/* Danger Zone */}
        <PremiumCard className="border-red-500/20 bg-red-500/5 p-10 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-4 text-center md:text-left">
              <h3 className="text-2xl font-black text-red-500 uppercase italic tracking-tighter leading-none">Terminate Session</h3>
              <p className="text-label text-red-500/40 italic">Disconnect from the SkinMinder intelligence grid.</p>
            </div>
            <Button variant="ghost" className="rounded-2xl px-16 h-20 font-black uppercase tracking-[0.25em] shadow-elite hover:bg-red-500/10 hover:text-red-500 transition-all text-red-500/30 border border-red-500/20 italic text-sm">
              <LogOut className="mr-6" size={24} /> End Protocol
            </Button>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}
