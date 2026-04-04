import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useAuthStore } from "../../src/stores/auth";
import { useOnboardingStore } from "../../src/stores/onboarding";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { COLORS } from "../../src/constants/theme";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, isLoading } = useAuthStore();

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      const { isComplete } = useOnboardingStore.getState();
      if (!isComplete) {
        router.replace("/(onboarding)/welcome");
      } else {
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-bg">
      <ScrollView contentContainerClassName="flex-grow justify-center px-7" showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(600).springify()} className="items-center mb-12">
          <View className="w-16 h-16 rounded-[20px] items-center justify-center mb-5" style={{ backgroundColor: COLORS.primarySubtle, borderWidth: 1, borderColor: "rgba(201, 169, 110, 0.2)" }}>
            <Ionicons name="sparkles" size={28} color={COLORS.primary} />
          </View>
          <Text className="text-text text-3xl font-bold tracking-tight">SkinMinder</Text>
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
