import "./global.css";
import { Stack, Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { supabase } from "../src/lib/supabase";
import { useAuthStore } from "../src/stores/auth";
import { useOnboardingStore } from "../src/stores/onboarding";
import { initNotifications } from "../src/services/notifications";
import { hydrateOfflineCache } from "../src/lib/offline";

export default function RootLayout() {
  const { refreshUser, isAuthenticated } = useAuthStore();
  const { checkStatus, isComplete } = useOnboardingStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await checkStatus();

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await refreshUser();
        await initNotifications();
      }

      setReady(true);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        refreshUser();
        initNotifications();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!ready) return null;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="scan" options={{ headerShown: false, presentation: "modal" }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
