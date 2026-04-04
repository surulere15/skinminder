import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useOnboardingStore } from "../../../src/stores/onboarding";

const SKIN_TYPES = [
  { id: "normal", label: "Normal", icon: "checkmark-circle", desc: "Balanced, minimal concerns" },
  { id: "dry", label: "Dry", icon: "water", desc: "Tight, flaky, dull" },
  { id: "oily", label: "Oily", icon: "drop", desc: "Shiny, enlarged pores" },
  { id: "combination", label: "Combination", icon: "git-merge", desc: "Oily T-zone, dry cheeks" },
  { id: "sensitive", label: "Sensitive", icon: "alert-circle", desc: "Reactive, redness-prone" },
];

export default function SkinTypeStep() {
  const { skinType, setSkinType, currentStep, setStep } = useOnboardingStore();

  const handleNext = () => {
    if (skinType) {
      setStep(currentStep + 1);
      router.push("/(onboarding)/concerns");
    }
  };

  return (
    <ScrollView className="flex-1 bg-surface">
      <View className="px-6 pt-14 pb-6 flex-1">
        <View className="mb-8">
          <View className="flex-row gap-2 mb-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <View key={i} className={`h-1 flex-1 rounded-full ${i <= currentStep ? "bg-primary-500" : "bg-surface-border"}`} />
            ))}
          </View>
          <Text className="text-white text-2xl font-bold mb-2">What's your skin type?</Text>
          <Text className="text-gray-400">This helps us personalize your analysis and recommendations.</Text>
        </View>

        <View className="gap-3">
          {SKIN_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              className={`p-4 rounded-xl border flex-row items-center gap-4 ${
                skinType === type.id
                  ? "bg-primary-500/10 border-primary-500"
                  : "bg-surface-card border-surface-border"
              }`}
              onPress={() => setSkinType(type.id)}
            >
              <View className={`w-12 h-12 rounded-full items-center justify-center ${
                skinType === type.id ? "bg-primary-500" : "bg-surface-border"
              }`}>
                <Ionicons name={type.icon as any} size={22} color={skinType === type.id ? "#0A0A0A" : "#666"} />
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold">{type.label}</Text>
                <Text className="text-gray-500 text-sm">{type.desc}</Text>
              </View>
              {skinType === type.id && (
                <Ionicons name="checkmark-circle" size={22} color="#a18b6f" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          className={`mt-8 rounded-xl py-4 items-center ${skinType ? "bg-primary-500" : "bg-surface-border"}`}
          onPress={handleNext}
          disabled={!skinType}
        >
          <Text className={`font-semibold text-lg ${skinType ? "text-surface" : "text-gray-600"}`}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
