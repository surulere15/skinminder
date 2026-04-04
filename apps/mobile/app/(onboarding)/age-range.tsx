import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useOnboardingStore } from "../../../src/stores/onboarding";

const AGE_RANGES = [
  { id: "18-24", label: "18-24" },
  { id: "25-34", label: "25-34" },
  { id: "35-44", label: "35-44" },
  { id: "45-54", label: "45-54" },
  { id: "55+", label: "55+" },
];

export default function AgeRangeStep() {
  const { ageRange, setAgeRange, currentStep } = useOnboardingStore();

  const handleNext = () => {
    if (ageRange) {
      router.push("/(onboarding)/climate");
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
        <Text className="text-white text-2xl font-bold mb-2">Your age range?</Text>
        <Text className="text-gray-400 mb-8">Skin needs change over time. This helps us calibrate your analysis.</Text>

        <View className="gap-3">
          {AGE_RANGES.map((range) => (
            <TouchableOpacity
              key={range.id}
              className={`p-5 rounded-xl border items-center ${
                ageRange === range.id
                  ? "bg-primary-500/10 border-primary-500"
                  : "bg-surface-card border-surface-border"
              }`}
              onPress={() => setAgeRange(range.id)}
            >
              <Text className={`text-xl font-semibold ${ageRange === range.id ? "text-primary-500" : "text-white"}`}>
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          className={`mt-8 rounded-xl py-4 items-center ${ageRange ? "bg-primary-500" : "bg-surface-border"}`}
          onPress={handleNext}
          disabled={!ageRange}
        >
          <Text className={`font-semibold text-lg ${ageRange ? "text-surface" : "text-gray-600"}`}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
