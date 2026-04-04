import { Redirect } from "expo-router";
import { useAuthStore } from "../../src/stores/auth";
import { useOnboardingStore } from "../../src/stores/onboarding";
import { useEffect } from "react";
import { supabase } from "../../src/lib/supabase";

export default function OnboardingLayout() {
  const { isAuthenticated } = useAuthStore();
  const { checkStatus, isComplete } = useOnboardingStore();

  useEffect(() => {
    checkStatus();
  }, []);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (isComplete) {
    return <Redirect href="/(tabs)" />;
  }

  return null;
}
