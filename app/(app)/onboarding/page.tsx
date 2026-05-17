"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight, ArrowLeft, Check, User, Target, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { trackOnboardingEvent } from "@/lib/analytics";

const WEDGE_CONCERNS = [
  'acne', 'dryness', 'oiliness', 'aging', 'dark spots', 'redness', 'texture', 'uneven tone'
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [concern, setConcern] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    trackOnboardingEvent('onboarding_started');
  }, []);

  const handleNext = () => {
    trackOnboardingEvent('onboarding_step_completed', { step_number: step });
    setStep((s) => s + 1);
  };
  const handleBack = () => setStep((s) => s - 1);

  const handleComplete = async () => {
    setIsLoading(true);
    trackOnboardingEvent('onboarding_completed', { 
      step_number: step,
      completion_percentage: 100 
    });
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await supabase.from("profiles").upsert({
        id: user.id,
        primary_concern: concern,
      });
    }
    
    router.push("/dashboard");
  };

  const steps = [
    {
      id: 1,
      title: "What's your main skin concern?",
      description: "This helps us personalize your tracking. You can always change it later.",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {WEDGE_CONCERNS.map((c) => (
            <button
              key={c}
              onClick={() => {
                setConcern(c);
                trackOnboardingEvent('onboarding_step_completed', { 
                  step: 'concern_selection',
                  step_number: 1 
                });
              }}
              className={`p-4 rounded-2xl border-2 transition-all text-sm font-bold capitalize ${
                concern === c ? "border-[#c9a96e] bg-[#c9a96e]/10 text-[#c9a96e] shadow-sm" : "border-white/5 bg-white/[0.02] text-white/40"
              }`}
            >
              {concern === c && <Check size={16} className="inline mr-2" />}
              {c}
            </button>
          ))}
        </div>
      )
    },
    {
      id: 2,
      title: "Ready to start tracking",
      description: "Scan once a week to see your skin improve over time.",
      content: (
        <div className="space-y-6 text-center py-8">
          <div className="w-20 h-20 rounded-full bg-[#c9a96e]/10 flex items-center justify-center mx-auto border border-[#c9a96e]/20">
            <Sparkles className="w-10 h-10 text-[#c9a96e]" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-bold text-white">Your goal: Track {concern} progress</p>
            <p className="text-sm text-white/40">Weekly scans will show you what's working</p>
          </div>
        </div>
      )
    }
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-[#c9a96e]/10 blur-3xl opacity-50" />
        <div className="absolute right-[-8%] top-[10%] h-[360px] w-[360px] rounded-full bg-white/[0.03] blur-3xl opacity-50" />
      </div>

      <div className="max-w-2xl w-full space-y-8 relative z-10">
        <div className="flex items-center gap-4 px-4 py-4">
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#c9a96e]"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / steps.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-bold text-white/50">{step}/{steps.length}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="border border-white/10 shadow-2xl bg-white/[0.03] backdrop-blur-2xl">
              <CardContent className="p-10 space-y-8">
                <div className="space-y-2 text-center sm:text-left">
                  <h1 className="text-3xl font-black tracking-tight text-white">{currentStep.title}</h1>
                  <p className="text-white/50 font-medium">{currentStep.description}</p>
                </div>

                <div className="min-h-[200px]">
                  {currentStep.content}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={step === 1}
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  
                  {step < steps.length ? (
                    <Button 
                      onClick={handleNext} 
                      disabled={step === 1 ? !concern : false}
                    >
                      Continue <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleComplete} 
                      disabled={isLoading}
                    >
                      Get Started
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
