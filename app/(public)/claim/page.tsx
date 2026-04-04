"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2, CheckCircle2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ClaimPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"idle" | "verifying" | "ready" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      setStatus("ready"); // In a real app, we'd verify the token first
    } else {
      setStatus("error");
      setError("No token provided");
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-[#060A18] flex items-center justify-center p-6 bg-skin-pearl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#6C7BFF]/10 via-transparent to-transparent" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="p-12 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-3xl shadow-2xl space-y-8 text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-3xl bg-[#6C7BFF]/10 flex items-center justify-center text-[#6C7BFF] border border-[#6C7BFF]/20 shadow-glow shadow-[#6C7BFF]/10">
              <ShieldCheck size={40} />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-outfit font-black text-white uppercase italic tracking-tight">Claim Your Scan</h1>
            <p className="text-white/40 font-bold leading-relaxed">We found your skin intelligence data from the retail station. Create an account to secure it forever.</p>
          </div>

          <div className="space-y-4">
            <Link href={`/signup?claimToken=${token}`}>
              <Button className="w-full h-16 rounded-2xl bg-[#6C7BFF] text-white font-black text-lg shadow-xl shadow-[#6C7BFF]/20 flex items-center justify-center gap-3">
                <UserPlus size={24} /> Create Account
              </Button>
            </Link>
            
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
              Securing scan: {token}
            </p>
          </div>

          <div className="pt-6 border-t border-white/5 space-y-4">
             <div className="flex items-center justify-center gap-4 text-white/30">
               <div className="flex items-center gap-2">
                 <CheckCircle2 size={14} className="text-green-400" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Verified Station</span>
               </div>
               <span className="w-4 h-[1px] bg-white/10" />
               <div className="flex items-center gap-2">
                 <CheckCircle2 size={14} className="text-green-400" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Encrypted Data</span>
               </div>
             </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
