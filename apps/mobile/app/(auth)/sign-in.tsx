import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useAuthStore } from "../../src/stores/auth";
import { useOnboardingStore } from "../../src/stores/onboarding";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { COLORS } from "../../src/constants/theme";
import { hapticMedium, hapticError } from "../../src/lib/haptics";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, isLoading, error, clearError } = useAuthStore();

  const handleSignIn = async () => {
    clearError();

    if (!email.trim()) {
      Alert.alert("Missing Email", "Please enter your email address.");
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    if (!password) {
      Alert.alert("Missing Password", "Please enter your password.");
      return;
    }

    hapticMedium();
    try {
      await signIn(email, password);
      const { isComplete } = useOnboardingStore.getState();
      if (!isComplete) {
        router.replace("/(onboarding)/welcome");
      } else {
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      hapticError();
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-bg">
      <ScrollView contentContainerClassName="flex-grow justify-center px-6" showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(600).springify()} className="items-center mb-12">
          <View className="w-16 h-16 rounded-[20px] items-center justify-center mb-5" style={{ backgroundColor: COLORS.primarySubtle, borderWidth: 1, borderColor: COLORS.primaryMedium }}>
            <Ionicons name="sparkles" size={28} color={COLORS.primary} />
          </View>
          <Text className="text-text text-[28px] font-bold tracking-tight">SkinMinder</Text>
          <Text className="text-text-tertiary mt-2 text-[17px]">Your AI skincare intelligence</Text>
        </Animated.View>

        <View className="gap-4">
          <Animated.View entering={FadeInDown.delay(200).duration(500).springify()}>
            <Text className="text-text-tertiary mb-2 text-[15px] font-medium">Email</Text>
            <TextInput
              className="rounded-[14px] px-4 py-4 text-[17px]"
              style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1, color: COLORS.text }}
              placeholder="you@example.com"
              placeholderTextColor={COLORS.textQuaternary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(500).springify()}>
            <Text className="text-text-tertiary mb-2 text-[15px] font-medium">Password</Text>
            <TextInput
              className="rounded-[14px] px-4 py-4 text-[17px]"
              style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1, color: COLORS.text }}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textQuaternary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </Animated.View>

          {error && (
            <Animated.View entering={FadeInDown.duration(300)} className="px-4 py-3 rounded-[14px]" style={{ backgroundColor: COLORS.errorSubtle, borderWidth: 1, borderColor: "rgba(248, 113, 113, 0.2)" }}>
              <Text className="text-error text-[14px]">{error}</Text>
            </Animated.View>
          )}

          <Animated.View entering={FadeInDown.delay(400).duration(500).springify()}>
            <TouchableOpacity className="rounded-[16px] items-center mt-2" style={{ height: 56, backgroundColor: COLORS.primary }} onPress={handleSignIn} disabled={isLoading}>
              <Text className="text-black text-[17px] font-semibold">{isLoading ? "Signing in..." : "Sign In"}</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500).duration(500).springify()}>
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity className="items-center mt-4">
                <Text className="text-text-tertiary text-[15px]">Don't have an account? <Text className="text-primary font-semibold">Sign Up</Text></Text>
              </TouchableOpacity>
            </Link>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
