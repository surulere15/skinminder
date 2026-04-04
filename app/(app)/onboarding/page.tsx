"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight, ArrowLeft, Check, User, Target, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const WEDGE_CONCERNS = [
  'acne', 'dryness', 'oiliness', 'aging', 'dark spots', 'redness', 'texture', 'uneven tone'
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [concern, setConcern] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleComplete = async () => {
    setIsLoading(true);
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
              onClick={() => setConcern(c)}
              className={`p-4 rounded-2xl border-2 transition-all text-sm font-bold capitalize ${
                concern === c ? "border-primary bg-muted/50 shadow-sm" : "border-transparent bg-muted/50"
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
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium">Your goal: Track {concern} progress</p>
            <p className="text-sm text-muted">Weekly scans will show you what's working</p>
          </div>
        </div>
      )
    }
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-8">
        <div className="flex items-center gap-4 px-4 py-4">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / steps.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium">{step}/{steps.length}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-xl">
              <CardContent className="p-10 space-y-8">
                <div className="space-y-2">
                  <h1 className="text-3xl font-black tracking-tight">{currentStep.title}</h1>
                  <p className="text-muted font-medium">{currentStep.description}</p>
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
