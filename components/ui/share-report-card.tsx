"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Link as LinkIcon, Twitter, Check, Sparkles, Activity } from "lucide-react";

interface ShareReportCardProps {
  score: number;
  scanId: string;
  strengths: string[];
  vulnerabilities: string[];
  ageProfile: { realAge: number; vitalityAge: number };
}

export function ShareReportCard({ score, scanId, strengths, vulnerabilities, ageProfile }: ShareReportCardProps) {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  // Generate the public link for this specific scan (assuming a public share route exists, or directing to landing page)
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/` : "";
  const shareText = `I scanned my skin with SkinMinder AI and got a score of ${score}. What's yours?`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        setSharing(true);
        await navigator.share({
          title: "My SkinMinder AI Results",
          text: shareText,
          url: shareUrl,
        });
      } catch (err: any) {
         // AbortErrors are common if user dismisses the share sheet, ignore them
         if (err.name !== 'AbortError') {
             console.error("Error sharing", err);
         }
      } finally {
        setSharing(false);
      }
    } else {
        copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  // Determine age difference phrasing
  const ageDifference = ageProfile.realAge - ageProfile.vitalityAge;
  let agePhrase = "";
  if (ageDifference > 0) {
     agePhrase = `${Math.abs(ageDifference)} years younger`;
  } else if (ageDifference < 0) {
     agePhrase = `${Math.abs(ageDifference)} years older`;
  } else {
     agePhrase = "matching your real age";
  }

  return (
    <Card className="glass-panel border-none shadow-2xl relative overflow-hidden bg-gradient-to-br from-skin-pearl to-skin-gold/10 rounded-3xl group">
       <div className="absolute -top-20 -right-20 w-64 h-64 bg-skin-violet/5 rounded-full blur-[60px]" />
       <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-skin-rose/5 rounded-full blur-[60px]" />

       <CardContent className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
             
             {/* Score Visualizer */}
             <div className="text-center space-y-2">
                <div className="relative">
                   <div className="w-32 h-32 rounded-full border-[8px] border-skin-muted/10 flex flex-col items-center justify-center p-2 bg-white shadow-inner relative z-10">
                      <span className="text-5xl font-outfit font-black text-transparent bg-clip-text bg-gradient-to-br from-skin-violet to-skin-glow">
                         {score}
                      </span>
                   </div>
                   {/* Orbiting element for flair */}
                   <div className="absolute inset-[-10px] animate-spin-slow rounded-full border border-dashed border-skin-muted/20" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-skin-muted/5 text-skin-dark font-bold text-[10px] uppercase tracking-widest mt-4">
                   <Activity size={12} /> Global Score
                </div>
             </div>

             {/* Report Details */}
             <div className="flex-1 space-y-6">
                <div>
                   <h3 className="text-2xl font-outfit font-black text-skin-dark flex items-center gap-2">
                      <Sparkles className="text-skin-violet w-6 h-6" /> Skin Vitality Age: {ageProfile.vitalityAge}
                   </h3>
                   <p className="text-sm font-medium text-skin-muted mt-1">
                      Your cellular vitality behaves <span className="text-skin-dark font-bold">{agePhrase}</span> biologically.
                   </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-skin-violet/70">Top Strengths</p>
                      <ul className="space-y-1">
                         {strengths.slice(0, 2).map((s, i) => (
                           <li key={i} className="text-xs font-bold text-skin-muted flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-skin-violet" /> {s}
                           </li>
                         ))}
                      </ul>
                   </div>
                   <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-skin-dark">Improvement Focus</p>
                      <ul className="space-y-1">
                         {vulnerabilities.slice(0, 1).map((v, i) => (
                           <li key={i} className="text-xs font-bold text-skin-dark flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-skin-gold" /> {v}
                           </li>
                         ))}
                      </ul>
                   </div>
                </div>

                {/* Viral Sharing Call to Action */}
                <div className="pt-4 border-t border-skin-border/5 flex flex-col sm:flex-row items-center gap-3">
                   <Button 
                      variant="premium" 
                      className="w-full sm:w-auto flex-1 rounded-xl h-12 shadow-md transition-transform active:scale-95"
                      onClick={handleNativeShare}
                      disabled={sharing}
                   >
                      <Share2 className="w-4 h-4 mr-2" /> Share Your Score
                   </Button>
                   <div className="flex gap-2 w-full sm:w-auto">
                      <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-skin-muted/20 hover:bg-skin-muted/5" onClick={copyToClipboard}>
                         {copied ? <Check className="w-4 h-4 text-skin-glow" /> : <LinkIcon className="w-4 h-4 text-skin-dark" />}
                      </Button>
                   </div>
                </div>
             </div>

          </div>
       </CardContent>
    </Card>
  );
}
