"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_TIERS, useSubscription } from "@/lib/subscription";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const { tier: currentTier, upgrade, isLoading } = useSubscription();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works for your skin journey. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {SUBSCRIPTION_TIERS.map((plan) => {
            const isCurrent = currentTier === plan.id;
            const isPro = plan.id === "pro";

            return (
              <div
                key={plan.id}
                className={cn(
                  "relative rounded-3xl p-8 border-2 transition-all",
                  isPro 
                    ? "border-primary shadow-xl scale-105 bg-primary/5" 
                    : "border-border bg-card"
                )}
              >
                {isPro && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-black">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-black">${plan.price}</span>
                    {plan.price > 0 && <span className="text-muted-foreground ml-2">/month</span>}
                  </div>
                  <p className="mt-2 text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={isCurrent ? "outline" : isPro ? "premium" : "default"}
                  disabled={isCurrent || isLoading}
                  onClick={async () => {
                    if (isCurrent) return;
                    if (plan.id === "enterprise") {
                      router.push("/contact");
                      return;
                    }
                    await upgrade(plan.id as "pro");
                  }}
                >
                  {isCurrent 
                    ? "Current Plan" 
                    : plan.cta
                  }
                </Button>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            All plans include our 30-day satisfaction guarantee. 
            Questions? <a href="/contact" className="text-primary hover:underline">Contact us</a>
          </p>
        </div>
      </div>
    </div>
  );
}