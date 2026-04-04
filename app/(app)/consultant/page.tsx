"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Sparkles, 
  Send, 
  User, 
  Bot, 
  Loader2, 
  Zap, 
  Info,
  ChevronRight,
  MessageSquare,
  BadgeCheck
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useProfile, useScanHistory } from "@/hooks";

export default function ConsultantPage() {
  const { profile } = useProfile();
  const { scans } = useScanHistory();

  const [messages, setMessages] = useState<any[]>([
    { role: "assistant", content: "Hello! I'm your SkinMinder intelligence consultant. I have analyzed your unified biological profile and current scan history. How can I optimize your protocols today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/consultant", {
        method: "POST",
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: { 
            profile: profile || null,
            latestScan: scans?.[0] || null
          }
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.message || data }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble syncing with the neural nodes. Please retry your inquiry in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col p-4 md:p-8 lg:p-12 space-y-8 max-w-6xl mx-auto bg-skin-pearl">
      {/* Header */}
      <header className="flex items-center justify-between flex-shrink-0 border-b border-skin-border/10 pb-8">
        <div className="space-y-3 text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-skin-muted/5 text-skin-dark text-[10px] font-black uppercase tracking-widest border border-skin-border/10 shadow-sm">
            <MessageSquare size={14} className="text-skin-violet" /> Neural Intelligence Concierge
          </div>
          <h1 className="text-4xl font-outfit font-black tracking-tight text-skin-dark">AI Consultant</h1>
        </div>
        <div className="hidden sm:flex -space-x-4">
           {[1,2,3].map(i => (
             <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-skin-violet/10 flex items-center justify-center text-[10px] font-black text-skin-violet shadow-lg relative">
                AI
                {i === 1 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-skin-glow rounded-full border-2 border-white" />}
             </div>
           ))}
        </div>
      </header>

      {/* Chat Window */}
      <Card className="flex-1 flex flex-col border-none shadow-[0_45px_100px_rgba(0,0,0,0.12)] bg-white rounded-[4rem] overflow-hidden relative border border-skin-border/10">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 scroll-smooth bg-gradient-to-b from-white to-skin-muted/5"
        >
          <AnimatePresence initial={false}>
            {messages.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex gap-6 max-w-[90%] md:max-w-[85%] text-left",
                  m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-xl border-white shrink-0",
                  m.role === "user" ? "bg-skin-violet text-white" : "bg-white border-2 border-skin-border/10 text-skin-violet"
                )}>
                  {m.role === "user" ? <User size={24} /> : <Sparkles size={22} className="text-skin-gold" />}
                </div>
                <div className="space-y-4 w-full">
                  <div className={cn(
                    "p-8 rounded-[3rem] text-lg font-medium leading-relaxed shadow-xl w-full border transition-all duration-300",
                    m.role === "user" 
                      ? "bg-skin-violet text-white rounded-tr-none border-skin-violet/10 shadow-skin-violet/10" 
                      : "bg-white rounded-tl-none text-skin-dark border-skin-border/5 shadow-black/5"
                  )}>
                    {m.role === "assistant" && typeof m.content === 'object' 
                      ? m.content.message || m.content.reply 
                      : String(m.content)}
                  </div>
                  
                  {/* Actionable Tags from AI */}
                  {m.role === "assistant" && typeof m.content === 'object' && m.content.suggestedActions && (
                    <div className="flex flex-wrap gap-3 pl-4">
                      {m.content.suggestedActions.map((action: string, i: number) => (
                        <div key={i} className="px-5 py-2 rounded-2xl bg-skin-glow/10 text-skin-glow text-[10px] font-black uppercase tracking-widest border border-skin-glow/20 flex items-center gap-2 shadow-sm">
                          <BadgeCheck size={14} /> {action}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* AI Suggested Follow Up Prompts */}
                  {m.role === "assistant" && typeof m.content === 'object' && idx === messages.length - 1 && (
                     <div className="flex flex-col gap-3 pt-4 pl-4">
                       {(m.content.followUpQuestions || m.content.suggestedFollowUps || []).map((q: string, i: number) => (
                         <button
                           key={i}
                           onClick={() => setInput(q)}
                           className="text-left px-6 py-4 rounded-3xl bg-skin-muted/5 hover:bg-white text-sm font-bold text-skin-muted hover:text-skin-violet transition-all border border-transparent hover:border-skin-border/10 shadow-sm hover:shadow-xl"
                         >
                           <span className="text-skin-violet mr-3 opacity-40 leading-none">↳</span> {q}
                         </button>
                       ))}
                     </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6 items-center text-skin-muted text-left">
               <div className="w-12 h-12 rounded-2xl bg-white border border-skin-border/10 flex items-center justify-center shadow-lg">
                  <Loader2 size={24} className="animate-spin text-skin-violet" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Sequencing Response Intelligence...</p>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-8 md:p-12 border-t border-skin-border/10 bg-white/90 backdrop-blur-xl">
          <form onSubmit={handleSendMessage} className="relative group">
            <Input 
              placeholder="Ask about molecules, routine offsets, or biological dermal concerns..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-20 pl-10 pr-20 rounded-[2.5rem] border-2 border-skin-border/5 focus-visible:ring-skin-violet/10 text-xl font-medium shadow-inner bg-white/50 transition-all placeholder:text-skin-muted/30"
            />
            <Button 
               type="submit" 
               size="icon" 
               className="absolute right-3 top-3 h-14 w-14 rounded-[1.5rem] shadow-2xl shadow-skin-violet/30 group-focus-within:scale-105 active:scale-95 transition-all"
               disabled={!input.trim() || isLoading}
               variant="premium"
            >
              <Send size={24} />
            </Button>
          </form>
          {/* Static fallbacks if no dynamic ones are present */}
          {(!messages[messages.length - 1]?.content?.followUpQuestions && !messages[messages.length - 1]?.content?.suggestedFollowUps) && (
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
               {["Are my current molecules safe?", "Explain my skin DNA markers", "Why is my hydration score low?"].map(q => (
                 <button 
                   key={q}
                   onClick={() => setInput(q)}
                   className="px-6 py-2.5 rounded-full bg-skin-muted/5 hover:bg-white text-[9px] font-black uppercase tracking-widest transition-all text-skin-muted hover:text-skin-violet border border-transparent hover:border-skin-border/10 shadow-sm"
                 >
                   {q}
                 </button>
               ))}
            </div>
          )}
        </div>
      </Card>

      {/* Quick Access Sidebar */}
      <div className="grid sm:grid-cols-2 gap-8 flex-shrink-0">
          <div className="flex items-center gap-6 p-8 rounded-[3rem] bg-white border border-skin-border/5 group cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all shadow-xl shadow-black-[2%] text-left">
             <div className="w-16 h-16 rounded-2xl bg-skin-violet/5 flex items-center justify-center text-skin-violet border border-skin-violet/10">
                <Zap size={32} className="fill-skin-violet/20" />
             </div>
             <div className="flex-1">
                <h4 className="font-outfit font-black text-xl leading-tight text-skin-dark">Protocol Sync</h4>
                <p className="text-xs font-bold text-skin-muted opacity-80 uppercase tracking-widest mt-1">Update routine from chat</p>
             </div>
             <ChevronRight className="opacity-20 group-hover:translate-x-2 group-hover:opacity-100 transition-all text-skin-violet" />
          </div>
          <div className="flex items-center gap-6 p-8 rounded-[3rem] bg-white border border-skin-border/5 group cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all shadow-xl shadow-black-[2%] text-left">
             <div className="w-16 h-16 rounded-2xl bg-skin-gold/5 flex items-center justify-center text-skin-gold border border-skin-gold/10">
                <Info size={32} />
             </div>
             <div className="flex-1">
                <h4 className="font-outfit font-black text-xl leading-tight text-skin-dark">Safety Shield</h4>
                <p className="text-xs font-bold text-skin-muted opacity-80 uppercase tracking-widest mt-1">Verify Molecular Interactions</p>
             </div>
             <ChevronRight className="opacity-20 group-hover:translate-x-2 group-hover:opacity-100 transition-all text-skin-violet" />
          </div>
      </div>
    </div>
  );
}
