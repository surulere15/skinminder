import "./global.css";
import { Stack, Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, Component, ReactNode } from "react";
import { supabase } from "../src/lib/supabase";
import { useAuthStore } from "../src/stores/auth";
import { useOnboardingStore } from "../src/stores/onboarding";
import { initNotifications } from "../src/services/notifications";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../src/constants/theme";

const INIT_TIMEOUT = 10000;

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={[styles.container, { backgroundColor: COLORS.background }]}>
          <View style={{ paddingHorizontal: 32, alignItems: "center" }}>
            <Text style={{ color: COLORS.text, fontSize: 22, fontWeight: "700", marginBottom: 8 }}>
              Something went wrong
            </Text>
            <Text style={{ color: COLORS.textTertiary, fontSize: 15, textAlign: "center", lineHeight: 22, marginBottom: 24 }}>
              An unexpected error occurred. Please try reloading the app.
            </Text>
            <TouchableOpacity
              style={{ backgroundColor: COLORS.primary, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 14 }}
              onPress={() => {
                this.setState({ hasError: false, error: null });
              }}
            >
              <Text style={{ color: "#000", fontWeight: "600", fontSize: 16 }}>Try Again</Text>
            </TouchableOpacity>
          </View>
          <StatusBar style="light" />
        </View>
      );
    }
    return this.props.children;
  }
}

function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Operation timed out")), ms);
    promise.then(resolve).catch(reject).finally(() => clearTimeout(timer));
  });
}

export default function RootLayout() {
  const { refreshUser } = useAuthStore();
  const { checkStatus, isComplete } = useOnboardingStore();
  const [ready, setReady] = useState(false);
  const [initError, setInitError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await timeout(checkStatus(), INIT_TIMEOUT);
        const { data: { session } } = await timeout(supabase.auth.getSession(), INIT_TIMEOUT);
        if (session) {
          setIsAuthenticated(true);
          await timeout(refreshUser(), INIT_TIMEOUT);
          await initNotifications();
        }
      } catch (e) {
        console.warn("App init timed out or failed:", e);
        setInitError(true);
      }
      setReady(true);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        refreshUser();
        initNotifications();
      } else {
        useOnboardingStore.getState().reset();
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

  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <GestureHandlerRootView style={styles.container}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false, animation: "fade_from_bottom" }} />
          </Stack>
          <StatusBar style="light" />
        </GestureHandlerRootView>
      </ErrorBoundary>
    );
  }

  if (!isComplete) {
    return (
      <ErrorBoundary>
        <GestureHandlerRootView style={styles.container}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(onboarding)" options={{ headerShown: false, animation: "slide_from_right" }} />
          </Stack>
          <StatusBar style="light" />
        </GestureHandlerRootView>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.container}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: "fade" }} />
          <Stack.Screen name="seller" options={{ headerShown: false, presentation: "modal", animation: "slide_from_bottom" }} />
        </Stack>
        <StatusBar style="light" />
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
