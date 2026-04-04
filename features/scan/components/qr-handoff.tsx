"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Download, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QRHandoffProps {
  scanId: string;
  token: string;
}

export function QRHandoff({ scanId, token }: QRHandoffProps) {
  const [copied, setCopied] = useState(false);
  const claimUrl = `${window.location.origin}/claim?token=${token}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(claimUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-10 rounded-[3rem] bg-[#1E293B]/90 border border-[#14B8A6]/20 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-dermal-grid opacity-[0.03] pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow opacity-20 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center gap-10 text-center">
        <div className="space-y-4">
          <Badge className="bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20 font-black tracking-[0.5em] uppercase text-[10px] px-5 py-2 rounded-full mb-2 italic">REMOTE_SYNCHRONIZATION</Badge>
          <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-[0.8]">Vault_Export</h3>
          <p className="text-[11px] text-white/30 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[240px] mx-auto">Initialize secure handoff to bind diagnostic session to permanent profile.</p>
        </div>

        <div className="p-6 bg-white rounded-3xl shadow-2xl border-4 border-[#14B8A6]/20">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(claimUrl)}`}
            alt="Scan to link results"
            className="w-[180px] h-[180px] grayscale contrast-125 hover:grayscale-0 transition-all duration-1000"
          />
        </div>

        <div className="w-full space-y-5">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between gap-4 group/url">
            <span className="text-[9px] font-mono font-bold text-white/10 uppercase tracking-widest truncate group-hover/url:text-[#14B8A6]/60 transition-colors italic">{claimUrl}</span>
            <button onClick={handleCopy} className="text-[#14B8A6]/40 hover:text-[#14B8A6] transition-colors">
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            <Button variant="outline" className="h-16 rounded-2xl border-white/5 text-white/30 hover:bg-white/5 hover:text-white font-black uppercase tracking-[0.2em] text-[10px] italic">
              <Download size={18} className="mr-2 text-[#14B8A6]" /> SAVE_AS_IMG
            </Button>
            <Button className="h-16 rounded-2xl bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] font-black uppercase tracking-[0.2em] text-[10px] italic shadow-lg">
              <Share2 size={18} className="mr-2" /> VAULT_SYNC
            </Button>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 w-full flex items-center justify-center gap-3">
           <div className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse shadow-[0_0_8px_#14B8A6]" />
           <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em] font-mono whitespace-nowrap italic">BUFFER_TIMEOUT: 30:00</p>
        </div>
      </div>
    </Card>
  );
}
