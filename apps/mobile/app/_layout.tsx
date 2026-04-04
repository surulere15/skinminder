import "./global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { supabase } from "../src/lib/supabase";
import { useAuthStore } from "../src/stores/auth";
import { useOnboardingStore } from "../src/stores/onboarding";
import { initNotifications } from "../src/services/notifications";
import { hydrateOfflineCache } from "../src/lib/offline";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, View } from "react-native";
import { COLORS } from "../src/constants/theme";

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

  if (!ready) {
    return (
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false, animation: "fade_from_bottom" }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false, animation: "slide_from_right" }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: "fade" }} />
        <Stack.Screen name="scan" options={{ headerShown: false, presentation: "modal", animation: "slide_from_bottom" }} />
      </Stack>
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
