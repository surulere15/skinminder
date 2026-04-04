"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CloudRain, Sun, Thermometer, Wind, AlertCircle, Droplets, MapPin, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ClimateWidget() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClimate() {
      try {
        const res = await fetch('/api/climate');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Failed to fetch climate intelligence", e);
      } finally {
        setLoading(false);
      }
    }
    fetchClimate();
  }, []);

  if (loading) {
     return (
        <Card className="bg-skin-graphite border-skin-border/20 shadow-[0_30px_60px_rgba(0,0,0,0.12)]">
           <CardContent className="p-8 h-[250px] flex flex-col items-center justify-center text-center">
              <Loader2 className="w-8 h-8 text-skin-violet animate-spin mb-4" />
              <p className="text-sm font-bold text-skin-dark animate-pulse">Syncing local atmospheric data...</p>
           </CardContent>
        </Card>
     );
  }

  if (!data || !data.weather || !data.advice) return null;

  const { weather, advice } = data;

  // Visual cues based on the AI's warning level
  const getWarningLevelStyles = (level: string) => {
     switch (level) {
        case 'high': return { bg: 'bg-skin-rose/10', border: 'border-skin-rose/30', text: 'text-skin-rose', icon: AlertCircle };
        case 'medium': return { bg: 'bg-skin-gold/10', border: 'border-skin-gold/30', text: 'text-skin-gold', icon: Thermometer };
        case 'low': return { bg: 'bg-skin-violet/10', border: 'border-skin-violet/30', text: 'text-skin-violet', icon: Droplets };
        default: return { bg: 'bg-skin-lavender/10', border: 'border-skin-lavender/30', text: 'text-skin-lavender', icon: Sun };
     }
  };

  const styles = getWarningLevelStyles(advice.warningLevel);
  const Icon = styles.icon;

  return (
    <Card className="bg-skin-graphite border-skin-border/20 shadow-[0_30px_60px_rgba(0,0,0,0.12)] relative overflow-hidden group">
      {/* Dynamic Background Glow based on weather/warning */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -z-10 transition-colors duration-1000 ${styles.bg}`} />
      
      <CardContent className="p-0">
         <div className="flex flex-col sm:flex-row h-full">
            
            {/* Left side: Weather Data */}
            <div className="sm:w-1/3 p-6 sm:p-8 border-b sm:border-b-0 sm:border-r border-skin-border/5 flex flex-col justify-center">
               <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-skin-muted mb-4">
                  <MapPin size={12} /> {weather.location}
               </div>
               
               <div className="flex items-end gap-2 mb-2">
                  <span className="text-5xl font-outfit font-black tracking-tighter text-skin-dark leading-none">
                     {weather.temp}
                  </span>
               </div>
               <p className="font-bold text-sm text-skin-dark capitalize mb-6">{weather.description}</p>
               
               <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-skin-muted">
                     <span className="flex items-center gap-1.5 opacity-70"><Droplets size={14} /> Humidity</span>
                     <span className="text-skin-dark">{weather.humidity}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-skin-muted">
                     <span className="flex items-center gap-1.5 opacity-70"><Sun size={14} /> UV Index</span>
                     <span className="text-skin-dark">{weather.uvIndex}</span>
                  </div>
               </div>
            </div>

            {/* Right side: AI Intelligence */}
            <div className="sm:w-2/3 p-6 sm:p-8 flex flex-col justify-center space-y-4">
               <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${styles.bg} ${styles.border} border`}>
                     <Icon size={16} className={styles.text} />
                  </div>
                  <h3 className="font-outfit font-black text-lg text-skin-dark tracking-tight">
                     Atmospheric Intelligence
                  </h3>
               </div>
               
               <p className="text-[15px] font-medium leading-relaxed text-skin-dark">
                  "{advice.adviceText}"
               </p>

               {advice.routineAdjustments?.length > 0 && (
                  <div className="pt-4 mt-2 border-t border-skin-border/5">
                     <p className="text-[10px] font-black uppercase tracking-widest text-skin-muted mb-3">
                        Today's Adjustments
                     </p>
                     <ul className="space-y-2">
                        {advice.routineAdjustments.map((adj: string, idx: number) => (
                           <li key={idx} className="flex items-start gap-2 text-sm font-bold text-skin-dark">
                              <span className={`mt-0.5 text-lg leading-none ${styles.text}`}>•</span>
                              {adj}
                           </li>
                        ))}
                     </ul>
                  </div>
               )}
            </div>

         </div>
      </CardContent>
    </Card>
  );
}
