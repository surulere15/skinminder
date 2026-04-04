import { View, Text, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useAuthStore } from "../../src/stores/auth";
import { Ionicons } from "@expo/vector-icons";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, isLoading } = useAuthStore();

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-surface"
    >
      <ScrollView contentContainerClassName="flex-grow justify-center px-8">
        <View className="items-center mb-12">
          <View className="w-20 h-20 rounded-full bg-primary-500 items-center justify-center mb-4">
            <Ionicons name="sparkles" size={36} color="#0A0A0A" />
          </View>
          <Text className="text-3xl font-bold text-white">SkinMinder</Text>
          <Text className="text-surface-border mt-2 text-center">
            Your AI-powered skincare intelligence
          </Text>
        </View>

        <View className="gap-4">
          <View>
            <Text className="text-gray-400 mb-2 text-sm">Email</Text>
            <TextInput
              className="bg-surface-card border border-surface-border rounded-xl px-4 py-4 text-white"
              placeholder="you@example.com"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View>
            <Text className="text-gray-400 mb-2 text-sm">Password</Text>
            <TextInput
              className="bg-surface-card border border-surface-border rounded-xl px-4 py-4 text-white"
              placeholder="••••••••"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            className="bg-primary-500 rounded-xl py-4 items-center mt-4"
            onPress={handleSignIn}
            disabled={isLoading}
          >
            <Text className="text-surface text-lg font-semibold">
              {isLoading ? "Signing in..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity className="items-center mt-4">
              <Text className="text-gray-400">
                Don't have an account?{" "}
                <Text className="text-primary-500 font-semibold">Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
