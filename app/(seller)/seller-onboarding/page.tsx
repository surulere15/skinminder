"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  ChevronRight,
  CheckCircle2,
  Package,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Brand Profile", description: "Tell us about your brand." },
  { id: 2, title: "Product Catalog", description: "Add your first products." },
  { id: 3, title: "AI Matching", description: "Configure recommendation preferences." },
];

export default function SellerOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <header className="space-y-2 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 text-content-primary text-[10px] font-black uppercase tracking-widest">
          <Store size={12} /> Seller Setup
        </div>
        <h1 className="text-4xl font-outfit font-black tracking-tight">Welcome to SkinMinder</h1>
        <p className="text-content-muted font-medium text-lg">
          Set up your seller account in 3 simple steps.
        </p>
      </header>

      {/* Progress */}
      <div className="flex items-center justify-center gap-4">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.id}>
            <button
              onClick={() => setCurrentStep(step.id)}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-all",
                currentStep >= step.id
                  ? "bg-primary text-content-glass shadow-lg shadow-primary/30"
                  : "bg-muted text-content-muted"
              )}
            >
              {currentStep > step.id ? <CheckCircle2 size={20} /> : step.id}
            </button>
            {i < STEPS.length - 1 && (
              <div className={cn("w-16 h-1 rounded-full", currentStep > step.id ? "bg-primary" : "bg-muted")} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <Card className="border-none bg-white shadow-xl shadow-black/5 rounded-[3rem]">
        <CardContent className="p-10 space-y-8">
          <div className="space-y-2">
            <Badge variant="secondary" className="text-[8px]">Step {currentStep} of {STEPS.length}</Badge>
            <h2 className="text-2xl font-outfit font-black tracking-tight">{STEPS[currentStep - 1].title}</h2>
            <p className="text-content-muted font-medium">{STEPS[currentStep - 1].description}</p>
          </div>

          {currentStep === 1 && (
            <div className="space-y-4">
              <Input placeholder="Brand Name" className="h-14 rounded-2xl border-2 text-base" />
              <Input placeholder="Website URL" className="h-14 rounded-2xl border-2 text-base" />
              <Input placeholder="Contact Email" className="h-14 rounded-2xl border-2 text-base" />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="p-8 rounded-[2rem] border-2 border-dashed border-muted text-center space-y-4">
                <Package size={48} className="mx-auto text-content-secondary" />
                <p className="text-content-muted font-medium">Drag and drop your product CSV or add products manually.</p>
                <Button variant="outline" className="rounded-2xl">Add Product Manually</Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="p-8 rounded-[2rem] bg-muted/50 border border-muted/50 space-y-4 text-center">
                <Sparkles size={48} className="mx-auto text-content-secondary" />
                <h3 className="text-xl font-outfit font-black">AI Matching Ready</h3>
                <p className="text-content-muted font-medium max-w-md mx-auto">
                  Our AI will automatically match your products to users based on their skin profile, concerns, and ingredient compatibility.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="rounded-2xl px-8 h-12 font-bold"
            >
              Back
            </Button>
            <Button
              variant="premium"
              onClick={() => setCurrentStep(Math.min(STEPS.length, currentStep + 1))}
              className="rounded-2xl px-8 h-12 font-bold"
            >
              {currentStep === STEPS.length ? "Complete Setup" : "Continue"} <ChevronRight className="ml-1" size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
