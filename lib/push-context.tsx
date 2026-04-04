"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type PushContextType = {
  isSupported: boolean;
  permission: NotificationPermission | null;
  isSubscribed: boolean;
  subscribe: () => Promise<PushSubscription | null>;
  unsubscribe: () => Promise<void>;
};

const PushContext = createContext<PushContextType | null>(null);

export function PushProvider({ children }: { children: ReactNode }) {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      setIsSupported(true);
      setPermission(Notification.permission);
      
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((sub) => {
          setIsSubscribed(!!sub);
        });
      });
    }
  }, []);

  const subscribe = async () => {
    if (!isSupported) return null;
    
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
        ),
      });
      
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });
      
      setIsSubscribed(true);
      return subscription;
    } catch (error) {
      console.error("Push subscription failed:", error);
      return null;
    }
  };

  const unsubscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
      }
      setIsSubscribed(false);
    } catch (error) {
      console.error("Push unsubscription failed:", error);
    }
  };

  return (
    <PushContext.Provider value={{ isSupported, permission, isSubscribed, subscribe, unsubscribe }}>
      {children}
    </PushContext.Provider>
  );
}

export function usePush() {
  const context = useContext(PushContext);
  if (!context) throw new Error("usePush must be used within PushProvider");
  return context;
}

function urlBase64ToUint8Array(base64String: string): BufferSource {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer as ArrayBuffer;
}