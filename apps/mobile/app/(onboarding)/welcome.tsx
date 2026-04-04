import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useOnboardingStore } from "../../../src/stores/onboarding";

export default function WelcomeStep() {
  const { currentStep, setStep } = useOnboardingStore();

  return (
    <ScrollView className="flex-1 bg-surface">
      <View className="px-6 pt-14 pb-6 flex-1 justify-center">
        <View className="flex-row gap-2 mb-12">
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={i} className={`h-1 flex-1 rounded-full ${i <= currentStep ? "bg-primary-500" : "bg-surface-border"}`} />
          ))}
        </View>

        <View className="items-center mb-12">
          <View className="w-24 h-24 rounded-full bg-primary-500/20 items-center justify-center mb-6">
            <Ionicons name="sparkles" size={48} color="#a18b6f" />
          </View>
          <Text className="text-white text-3xl font-bold text-center mb-3">Welcome to SkinMinder</Text>
          <Text className="text-gray-400 text-center text-lg leading-6">
            Your AI-powered skincare intelligence. Let's personalize your experience in just a few steps.
          </Text>
        </View>

        <View className="gap-4 mb-8">
          {[
            { icon: "camera", title: "AI Skin Analysis", desc: "Scan your skin with advanced computer vision" },
            { icon: "fitness", title: "Skin DNA Profile", desc: "Track your skin's long-term patterns" },
            { icon: "time", title: "Smart Routines", desc: "Personalized morning & evening protocols" },
          ].map((item, i) => (
            <View key={i} className="flex-row items-center gap-4 bg-surface-card p-4 rounded-xl border border-surface-border">
              <View className="w-10 h-10 rounded-full bg-primary-500/20 items-center justify-center">
                <Ionicons name={item.icon as any} size={20} color="#a18b6f" />
              </View>
              <View>
                <Text className="text-white font-semibold">{item.title}</Text>
                <Text className="text-gray-500 text-sm">{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          className="bg-primary-500 rounded-xl py-4 items-center"
          onPress={() => {
            setStep(1);
            router.push("/(onboarding)/skin-type");
          }}
        >
          <Text className="text-surface font-semibold text-lg">Get Started</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
