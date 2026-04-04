"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
} from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { cn } from "@/lib/utils";

const SKIN_TYPES = ["Dry", "Oily", "Combination", "Sensitive", "Normal"];

export default function SettingsPage() {
  const { profile, isLoading, updateProfile } = useProfile();
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
      <div className="p-12 flex flex-col items-center justify-center min-h-[60vh] bg-skin-pearl">
        <Loader2 className="w-12 h-12 text-skin-violet animate-spin mb-4" />
        <p className="font-outfit font-black tracking-tight text-skin-dark">Loading your settings...</p>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 space-y-12 max-w-4xl mx-auto bg-skin-pearl min-h-screen">
      {/* Header */}
      <header className="space-y-2 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skin-muted/5 text-skin-dark text-[10px] font-black uppercase tracking-widest border border-skin-border/10">
          <User size={12} /> Account
        </div>
        <h1 className="text-4xl lg:text-5xl font-outfit font-black tracking-tight text-skin-dark text-left">Settings</h1>
        <p className="text-skin-muted font-medium text-lg max-w-xl opacity-90 text-left">
          Manage your profile, preferences, and privacy.
        </p>
      </header>

      {/* Profile Section */}
      <Card className="border-none bg-white/5 border border-skin-border/10 shadow-xl shadow-black/5 rounded-[3rem] overflow-hidden relative z-10">
        <CardHeader className="p-8 pb-0 text-left">
          <CardTitle className="text-2xl font-outfit font-black tracking-tight text-skin-dark">
            Profile Information
          </CardTitle>
          <CardDescription className="font-bold text-skin-muted opacity-80">
            This helps us personalize your skincare intelligence.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6 text-left">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-skin-muted ml-1">Full Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 rounded-2xl border-2 border-skin-border/20 text-base focus-visible:ring-skin-violet focus-visible:border-skin-violet"
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-skin-muted ml-1">Age</label>
              <Input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="h-14 rounded-2xl border-2 border-skin-border/20 text-base focus-visible:ring-skin-violet focus-visible:border-skin-violet"
                placeholder="Your age"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-skin-muted ml-1">Skin Type</label>
            <div className="flex flex-wrap gap-3">
              {SKIN_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setSkinType(type.toLowerCase())}
                  className={cn(
                    "px-6 py-3 rounded-2xl text-sm font-black transition-all border-2",
                    skinType === type.toLowerCase()
                      ? "border-skin-violet bg-skin-violet/5 text-skin-violet shadow-sm"
                      : "border-skin-border/20 bg-transparent text-skin-muted hover:border-skin-border/40 hover:text-skin-dark"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <Separator className="bg-skin-border/10" />

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              variant="premium"
              className="h-14 px-10 rounded-2xl font-black shadow-xl shadow-skin-violet/20 hover:scale-[1.02] transition-all"
            >
              {isSaving ? (
                <><Loader2 className="mr-2 animate-spin" size={18} /> Saving...</>
              ) : (
                <><Save className="mr-2" size={18} /> Save Changes</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <div className="grid md:grid-cols-2 gap-6 relative z-10">
        <Card className="border-none bg-white/5 border border-skin-border/10 shadow-xl shadow-black/5 rounded-[2.5rem] p-8 space-y-6 group hover:bg-white/10 transition-all cursor-pointer text-left">
          <div className="w-12 h-12 rounded-2xl bg-skin-muted/5 flex items-center justify-center text-skin-dark border border-skin-border/10 group-hover:bg-skin-violet group-hover:text-skin-pearl group-hover:border-skin-violet transition-all">
            <Bell size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-outfit font-black text-xl tracking-tight text-skin-dark">Notifications</h3>
            <p className="text-sm text-skin-muted font-medium opacity-90">Scan reminders, routine nudges, and wellness tips.</p>
          </div>
          <Badge variant="secondary" className="text-[8px] font-black bg-skin-muted/5 text-skin-dark border-skin-border/10 rounded-full">Coming Soon</Badge>
        </Card>

        <Card className="border-none bg-white/5 border border-skin-border/10 shadow-xl shadow-black/5 rounded-[2.5rem] p-8 space-y-6 group hover:bg-white/10 transition-all cursor-pointer text-left">
          <div className="w-12 h-12 rounded-2xl bg-skin-muted/5 flex items-center justify-center text-skin-dark border border-skin-border/10 group-hover:bg-skin-graphite group-hover:text-skin-pearl group-hover:border-skin-graphite transition-all">
            <Shield size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-outfit font-black text-xl tracking-tight text-skin-dark">Privacy & Data</h3>
            <p className="text-sm text-skin-muted font-medium opacity-90">Manage your data, export scans, or delete your account.</p>
          </div>
          <div className="flex justify-end">
            <ChevronRight className="opacity-40 group-hover:translate-x-1 group-hover:opacity-100 transition-all" size={20} />
          </div>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-2 border-skin-rose/20 bg-skin-rose/5 rounded-[2.5rem] p-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-outfit font-black text-xl tracking-tight text-skin-dark">Sign Out</h3>
            <p className="text-sm text-skin-muted font-bold opacity-80">You can always sign back in later.</p>
          </div>
          <Button variant="destructive" className="rounded-2xl px-10 h-14 font-black shadow-lg shadow-skin-rose/10 hover:bg-skin-rose hover:text-white transition-all bg-transparent text-skin-rose border-2 border-skin-rose/20">
            <LogOut className="mr-2" size={18} /> Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
}
