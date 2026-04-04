import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useOnboardingStore } from "../../../src/stores/onboarding";
import { useAuthStore } from "../../../src/stores/auth";
import { supabase } from "../../../src/lib/supabase";

const CLIMATES = [
  { id: "tropical", label: "Tropical", icon: "sunny", desc: "Hot & humid year-round" },
  { id: "arid", label: "Arid", icon: "flame", desc: "Hot & dry" },
  { id: "temperate", label: "Temperate", icon: "partly-sunny", desc: "Moderate, seasonal changes" },
  { id: "continental", label: "Continental", icon: "snow", desc: "Cold winters, warm summers" },
  { id: "cold", label: "Cold", icon: "thermometer", desc: "Cold year-round" },
];

export default function ClimateStep() {
  const { climate, setClimate, currentStep, complete } = useOnboardingStore();
  const { user } = useAuthStore();

  const handleComplete = async () => {
    if (!climate || !user) return;

    try {
      await supabase.from("profiles").update({
        skin_type: useOnboardingStore.getState().skinType,
        concerns: useOnboardingStore.getState().concerns,
        age_range: useOnboardingStore.getState().ageRange,
        climate: climate,
      }).eq("id", user.id);

      await complete();
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Failed to save profile:", error);
      await complete();
      router.replace("/(tabs)");
    }
  };

  return (
    <ScrollView className="flex-1 bg-surface">
      <View className="px-6 pt-14 pb-6 flex-1">
        <View className="flex-row gap-2 mb-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={i} className={`h-1 flex-1 rounded-full ${i <= currentStep ? "bg-primary-500" : "bg-surface-border"}`} />
          ))}
        </View>
        <Text className="text-white text-2xl font-bold mb-2">Your climate?</Text>
        <Text className="text-gray-400 mb-8">Weather affects your skin. We'll adjust your routine accordingly.</Text>

        <View className="gap-3">
          {CLIMATES.map((c) => (
            <TouchableOpacity
              key={c.id}
              className={`p-4 rounded-xl border flex-row items-center gap-4 ${
                climate === c.id
                  ? "bg-primary-500/10 border-primary-500"
                  : "bg-surface-card border-surface-border"
              }`}
              onPress={() => setClimate(c.id)}
            >
              <View className={`w-12 h-12 rounded-full items-center justify-center ${
                climate === c.id ? "bg-primary-500" : "bg-surface-border"
              }`}>
                <Ionicons name={c.icon as any} size={22} color={climate === c.id ? "#0A0A0A" : "#666"} />
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold">{c.label}</Text>
                <Text className="text-gray-500 text-sm">{c.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          className={`mt-8 rounded-xl py-4 items-center ${climate ? "bg-primary-500" : "bg-surface-border"}`}
          onPress={handleComplete}
          disabled={!climate}
        >
          <Text className={`font-semibold text-lg ${climate ? "text-surface" : "text-gray-600"}`}>
            Start Analyzing
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
