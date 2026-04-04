"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from "recharts";
import { 
  Activity, Users, ShieldAlert, Target, 
  BarChart3, RefreshCcw, LayoutGrid, CheckCircle2 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data for Pilot Readiness
const SUMMARY_STATS = [
  { label: "Total_Scans", value: "1,248", change: "+12%", icon: Activity, color: "text-[rgb(var(--skin-blue))]" },
  { label: "Valid_Samples", value: "1,180", change: "94.5%", icon: CheckCircle2, color: "text-[rgb(var(--skin-teal))]" },
  { label: "Comparison_Rate", value: "22.4%", change: "North_Star", icon: Target, color: "text-indigo-400" },
  { label: "Rejected_Scans", value: "68", change: "5.5%", icon: ShieldAlert, color: "text-red-400" },
];

const DEVICE_DISTRIBUTION = [
  { name: "iPhone", value: 560 },
  { name: "Android", value: 480 },
  { name: "Desktop", value: 120 },
  { name: "Tablet", value: 88 },
];

const LIGHTING_DISTRIBUTION = [
  { range: "Optimal (>0.8)", value: 480 },
  { range: "Good (0.6-0.8)", value: 420 },
  { range: "Suboptimal (<0.6)", value: 348 },
];

const REJECTION_REASONS = [
  { reason: "Hair_Occlusion", value: 31 },
  { reason: "Low_Luminance", value: 26 },
  { reason: "Tilt_Angle", value: 24 },
  { reason: "Dist_Mismatch", value: 19 },
];

const CLIMATE_SIGNALS = [
  { region: "Lagos", humidity: "82%", sebum: "High", uv: 11, humidityRaw: 85 },
  { region: "Dubai", humidity: "55%", sebum: "Medium", uv: 10, humidityRaw: 22 },
  { region: "London", humidity: "65%", sebum: "Low", uv: 4, humidityRaw: 45 },
  { region: "Singapore", humidity: "80%", sebum: "High", uv: 9, humidityRaw: 78 },
];

const SII_METRICS = [
  { label: "Hydration_Stability", score: 58, trend: "Stable", color: "bg-blue-500" },
  { label: "Pigmentation_Risk", score: 47, trend: "Rising", color: "bg-amber-500" },
  { label: "Barrier_Strength", score: 63, trend: "Strong", color: "bg-emerald-500" },
  { label: "Oil_Volatility", score: 54, trend: "Variable", color: "bg-indigo-500" },
];

const DEMOGRAPHICS = [
  { group: "18-24", value: 38, fitzpatrick: "IV-VI (62%)" },
  { group: "25-34", value: 41, fitzpatrick: "II-III (38%)" },
  { group: "35-44", value: 14, fitzpatrick: "N/A" },
  { group: "45+", value: 7, fitzpatrick: "N/A" },
];

const COMMERCIAL_INSIGHTS = {
  archetypes: "Melanin-rich phenotypes (Fitzpatrick IV-VI) dominate the dataset, suggesting high corrective formulation demand.",
  climate: "Lagos/Singapore show 85% correlation between humidity and sebum reactivity index > 0.7.",
  integrity: "Biometric hashing ensures 100% identity continuity in longitudinal comparison loop.",
  sii: "Regional 'Skin Health Credit Score' peaks in the 25-34 demographic for barrier resilience."
};

const INTEGRITY_FLAGS = [
  { type: "Hydration_Jump", value: "+51%", weight: 0.4, status: "Flagged" },
  { type: "Bot_Velocity", value: "50s/2m", weight: 0.2, status: "Blocked" },
  { type: "Face_Hash_Mismatch", value: "3.2%", weight: 0.8, status: "Logged" },
];

const ARCHETYPE_DISTRIBUTION = [
  { name: "PIH-Prone", value: 420 },
  { name: "Oily-Dehydrated", value: 380 },
  { name: "Sensitive-Reactive", value: 240 },
  { name: "Balanced", value: 120 },
  { name: "Photo-Damaged", value: 88 },
];

const CONFIDENCE_TIMELINE = [
  { day: "Mon", avg: 82, min: 74 },
  { day: "Tue", avg: 85, min: 78 },
  { day: "Wed", avg: 84, min: 76 },
  { day: "Thu", avg: 88, min: 81 },
  { day: "Fri", avg: 87, min: 80 },
  { day: "Sat", avg: 91, min: 84 },
  { day: "Sun", avg: 89, min: 82 },
];

const COLORS = ["#2F6BFF", "#7AD6B3", "#94a3b8", "#6366f1", "#f43f5e"];

export function ScanHealthDashboard() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] p-8 space-y-8 font-sans antialiased text-[#0F172A]">
      {/* Header: System Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-[rgb(var(--skin-teal))] shadow-[0_0_8px_rgba(var(--skin-teal),0.5)] animate-pulse" />
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[rgb(var(--skin-teal))] italic">Pilot_Optimization_Active</p>
          </div>
          <h1 className="text-4xl font-black tracking-tight italic">Scan_Health_Console</h1>
        </div>
        
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-[#E7EDF3] text-xs font-black uppercase tracking-widest hover:border-[rgb(var(--skin-blue))]/20 transition-all shadow-sm">
             <RefreshCcw size={14} />
             Live_Sync
           </button>
           <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[rgb(var(--skin-navy))] text-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg">
             Export_Pilot_Data
           </button>
        </div>
      </div>

      {/* Row 1: Skin Intelligence Index (SII) */}
      <div className="skin-card p-8 bg-white border border-[#E7EDF3] space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] italic text-[rgb(var(--skin-blue))]">Skin_Intelligence_Index_SII™</h3>
            <p className="text-xs text-muted-foreground">Aggregated regional skin health stability benchmarks.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#F7F8FA] rounded-full border border-[#E7EDF3]">
            <span className="w-2 h-2 rounded-full bg-[rgb(var(--skin-blue))] animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest">Global_Average: 56.4</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SII_METRICS.map((metric) => (
            <div key={metric.label} className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase text-muted-foreground">{metric.label.replace('_', ' ')}</p>
                  <p className="text-3xl font-black italic tracking-tighter">{metric.score}</p>
                </div>
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[rgb(var(--skin-teal))] mb-2 italic">{metric.trend}</p>
              </div>
              <div className="w-full h-2 bg-[#F7F8FA] border border-[#E7EDF3] rounded-full overflow-hidden relative">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${metric.score}%` }}
                   className={cn("h-full", metric.color)} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Dataset Health | Comparison Rate */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SUMMARY_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="skin-card p-6 bg-white border border-[#E7EDF3]"
          >
            <div className="flex justify-between items-start mb-4">
               <div className={cn("p-3 rounded-2xl bg-[#F7F8FA] border border-[#E7EDF3]", stat.color)}>
                  <stat.icon size={20} />
               </div>
               <span className="text-[9px] font-black italic text-muted-foreground bg-[#F7F8FA] px-2 py-1 rounded border border-[#E7EDF3]">
                 {stat.change}
               </span>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
              <h3 className="text-3xl font-black italic">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Row 3: Confidence Distribution | Lighting Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="skin-card p-8 bg-white border border-[#E7EDF3] space-y-8">
           <div className="space-y-1">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">Confidence_Stability_Matrix</h3>
              <p className="text-xs text-muted-foreground">Healthy: High Confidence ≥ 60%.</p>
           </div>
           <div className="h-[240px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={CONFIDENCE_TIMELINE}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(var(--skin-blue))" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="rgb(var(--skin-blue))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                 <XAxis 
                   dataKey="day" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                 />
                 <Tooltip />
                 <Area 
                   type="monotone" 
                   dataKey="avg" 
                   stroke="rgb(var(--skin-blue))" 
                   strokeWidth={3}
                   fillOpacity={1} 
                   fill="url(#colorAvg)" 
                 />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="skin-card p-8 bg-white border border-[#E7EDF3] space-y-8">
           <div className="space-y-1">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">Luminance_Accuracy_Audit</h3>
              <p className="text-xs text-muted-foreground">Monitoring environmental variability. Healthy: Optimal {">"} 40%.</p>
            </div>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={LIGHTING_DISTRIBUTION}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="range" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                    width={120}
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill="rgb(var(--skin-teal))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Row 4: Device Ecosystem | Occlusion Rejection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="skin-card p-8 bg-white border border-[#E7EDF3] space-y-8">
           <div className="space-y-1">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">Device_Hardware_Ecosystem</h3>
              <p className="text-xs text-muted-foreground">Identifying hardware-based scan variability.</p>
           </div>
           
           <div className="h-[240px] w-full flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                    data={DEVICE_DISTRIBUTION}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                 >
                    {DEVICE_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
             <div className="flex flex-col gap-2 ml-4">
                {DEVICE_DISTRIBUTION.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-[10px] font-black uppercase text-muted-foreground">{d.name}</span>
                  </div>
                ))}
             </div>
           </div>
        </div>

        <div className="skin-card p-8 bg-white border border-[#E7EDF3] space-y-8">
           <div className="space-y-1">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">Occlusion_Rejection_Audit</h3>
              <p className="text-xs text-muted-foreground">Identifying UX friction points. Goal: Rejection {"<"} 15%.</p>
           </div>
           <div className="h-[200px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={REJECTION_REASONS}>
                 <XAxis dataKey="reason" hide />
                 <Tooltip />
                 <Bar dataKey="value" fill="#f43f5e" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
             <div className="grid grid-cols-2 gap-2 mt-4">
                {REJECTION_REASONS.map((r) => (
                  <div key={r.reason} className="flex justify-between items-center text-[9px] font-black uppercase text-muted-foreground bg-[#F7F8FA] px-2 py-1 rounded">
                    <span>{r.reason.replace('_', ' ')}</span>
                    <span className="text-[#0F172A]">{r.value}%</span>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>

      {/* Row 5: Climate Intelligence Map & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 skin-card p-8 bg-white border border-[#E7EDF3] space-y-6">
           <div className="space-y-1">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">Climate_Market_Intelligence_Map</h3>
              <p className="text-xs text-muted-foreground">Regional skin signals vs. Environmental stressors.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CLIMATE_SIGNALS.map((c) => (
                <div key={c.region} className="flex flex-col gap-2 p-4 border border-[#E7EDF3] hover:bg-[#F7F8FA] transition-colors rounded-xl group">
                   <div className="flex items-center justify-between">
                     <span className="text-xs font-black italic text-[#0F172A] group-hover:text-[rgb(var(--skin-blue))] transition-colors">{c.region}</span>
                     <span className="text-[9px] font-bold uppercase tracking-widest text-[rgb(var(--skin-teal))]">UV_Index_{c.uv}</span>
                   </div>
                   <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                      <span>Humidity: {c.humidity}</span>
                      <span className="w-px h-2 bg-[#E7EDF3]" />
                      <span>Sebum: {c.sebum}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="skin-card p-8 bg-[#0F172A] text-white space-y-6 relative overflow-hidden flex flex-col justify-center">
           <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--skin-blue))]/20 to-transparent pointer-events-none" />
           <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 italic">B2B_Commercial_Signal</p>
           <p className="text-lg font-bold leading-tight italic">
             "Lagos and Singapore correlate high humidity with a **85% spike** in sebum reactivity index."
           </p>
           <div className="pt-4 flex items-center gap-2">
              <span className="px-3 py-1 bg-[rgb(var(--skin-teal))]/10 text-[8px] font-black uppercase text-[rgb(var(--skin-teal))] tracking-widest italic rounded-full">High_Value_Insight</span>
           </div>
        </div>
      </div>

      {/* Row 6: Archetypes & Demographics (Supplementary) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="skin-card p-8 bg-white border border-[#E7EDF3] space-y-8">
           <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">Archetype_Prevalence</h3>
                <p className="text-xs text-muted-foreground">Segmentation for R&D prioritization.</p>
              </div>
           </div>
           <div className="h-[240px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={ARCHETYPE_DISTRIBUTION}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                 <YAxis hide />
                 <Tooltip />
                 <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {ARCHETYPE_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="skin-card p-8 bg-white border border-[#E7EDF3] space-y-8">
           <div className="space-y-1">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">Demographic_Audit</h3>
              <p className="text-xs text-muted-foreground">Fitzpatrick Scale diversity benchmarks.</p>
           </div>
           <div className="grid grid-cols-2 gap-4">
              {DEMOGRAPHICS.map((d) => (
                <div key={d.group} className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3]">
                   <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">{d.group}</p>
                   <p className="text-xl font-black italic">{d.value}%</p>
                   {d.fitzpatrick !== "N/A" && (
                     <p className="text-[8px] font-bold text-[rgb(var(--skin-blue))] uppercase tracking-widest mt-2">{d.fitzpatrick}</p>
                   )}
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Footer: Diagnostic Integrity */}
      <div className="flex items-center justify-between text-[rgb(var(--skin-gray))] border-t border-[#E7EDF3] pt-8 opacity-40">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
             <LayoutGrid size={14} />
             <span className="text-[10px] font-black uppercase tracking-widest italic leading-none">Cluster_V2</span>
           </div>
           <div className="flex items-center gap-2">
             <Target size={14} />
             <span className="text-[10px] font-black uppercase tracking-widest italic leading-none">Inference_Engine_9.4</span>
           </div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest italic leading-none">© 2026 SkinMinder Lab</p>
      </div>
    </div>
  );
}
