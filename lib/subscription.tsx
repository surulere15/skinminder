"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type SubscriptionTier = "free" | "pro" | "enterprise";

interface SubscriptionContextType {
  tier: SubscriptionTier;
  isLoading: boolean;
  features: string[];
  upgrade: (tier: SubscriptionTier) => Promise<void>;
  cancel: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

const TIER_FEATURES: Record<SubscriptionTier, string[]> = {
  free: [
    "3 scans per month",
    "Basic skin analysis",
    "Skin twin matching",
    "5 ingredients check per day",
  ],
  pro: [
    "Unlimited scans",
    "Advanced AI analysis",
    "Personalized routines",
    "Unlimited ingredient checks",
    "Progress tracking",
    "Push notifications",
    "Weekly reports",
  ],
  enterprise: [
    "Everything in Pro",
    "Team management",
    "API access",
    "Custom integrations",
    "Priority support",
    "White-label options",
  ],
};

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<SubscriptionTier>("free");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSubscription() {
      try {
        const { data: { user } } = await fetch("/api/auth/me").then(r => r.json());
        if (user) {
          const res = await fetch("/api/subscription");
          if (res.ok) {
            const data = await res.json();
            setTier(data.tier || "free");
          }
        }
      } catch (e) {
        console.warn("Could not load subscription");
      } finally {
        setIsLoading(false);
      }
    }
    loadSubscription();
  }, []);

  const upgrade = async (newTier: SubscriptionTier) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/subscription/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: newTier }),
      });
      if (!res.ok) throw new Error("Upgrade failed");
      setTier(newTier);
    } finally {
      setIsLoading(false);
    }
  };

  const cancel = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/subscription/cancel", { method: "POST" });
      setTier("free");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        isLoading,
        features: TIER_FEATURES[tier],
        upgrade,
        cancel,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error("useSubscription must be used within SubscriptionProvider");
  return context;
}

export const SUBSCRIPTION_TIERS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Get started with basic skin tracking",
    features: TIER_FEATURES.free,
    cta: "Current Plan",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 9.99,
    description: "Unlock your skin's full potential",
    features: TIER_FEATURES.pro,
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 49.99,
    description: "For teams and organizations",
    features: TIER_FEATURES.enterprise,
    cta: "Contact Sales",
    popular: false,
  },
];