import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useAuthStore } from "../../src/stores/auth";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { COLORS } from "../../src/constants/theme";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, isLoading } = useAuthStore();

  const handleSignUp = async () => {
    try {
      await signUp(email, password, name);
      router.replace("/(onboarding)/welcome");
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
          <Text className="text-text text-3xl font-bold tracking-tight">Create Account</Text>
          <Text className="text-text-tertiary mt-2 text-[17px]">Start your skin intelligence journey</Text>
        </Animated.View>

        <View className="gap-4">
          {[
            { label: "Full Name", value: name, setter: setName, placeholder: "Jane Doe", autoCapitalize: "words" as const, delay: 200 },
            { label: "Email", value: email, setter: setEmail, placeholder: "you@example.com", autoCapitalize: "none" as const, delay: 300, keyboardType: "email-address" as const },
            { label: "Password", value: password, setter: setPassword, placeholder: "••••••••", autoCapitalize: "none" as const, delay: 400, secure: true },
          ].map((field) => (
            <Animated.View key={field.label} entering={FadeInDown.delay(field.delay).duration(500).springify()}>
              <Text className="text-text-tertiary mb-2 text-[15px] font-medium">{field.label}</Text>
              <TextInput
                className="rounded-[14px] px-4 py-4 text-[17px]"
                style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1, color: COLORS.text }}
                placeholder={field.placeholder}
                placeholderTextColor={COLORS.textQuaternary}
                value={field.value}
                onChangeText={field.setter}
                secureTextEntry={field.secure}
                autoCapitalize={field.autoCapitalize}
                keyboardType={field.keyboardType || "default"}
              />
            </Animated.View>
          ))}

          <Animated.View entering={FadeInDown.delay(500).duration(500).springify()}>
            <TouchableOpacity className="rounded-[16px] items-center mt-2" style={{ height: 56, backgroundColor: COLORS.primary }} onPress={handleSignUp} disabled={isLoading}>
              <Text className="text-black text-[17px] font-semibold">{isLoading ? "Creating account..." : "Create Account"}</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600).duration(500).springify()}>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity className="items-center mt-4">
                <Text className="text-text-tertiary text-[15px]">Already have an account? <Text className="text-primary font-semibold">Sign In</Text></Text>
              </TouchableOpacity>
            </Link>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
