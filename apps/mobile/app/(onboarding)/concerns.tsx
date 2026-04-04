import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useOnboardingStore } from "../../../src/stores/onboarding";

const CONCERNS = [
  { id: "acne", label: "Acne & Breakouts", icon: "bug" },
  { id: "aging", label: "Fine Lines & Wrinkles", icon: "hourglass" },
  { id: "pigmentation", label: "Dark Spots", icon: "ellipse" },
  { id: "dryness", label: "Dryness & Dehydration", icon: "water" },
  { id: "oiliness", label: "Excess Oil", icon: "drop" },
  { id: "redness", label: "Redness & Sensitivity", icon: "alert-circle" },
  { id: "pores", label: "Enlarged Pores", icon: "grid" },
  { id: "dullness", label: "Dullness", icon: "sunny" },
  { id: "dark_circles", label: "Dark Circles", icon: "eye" },
  { id: "uneven_texture", label: "Uneven Texture", icon: "swap-horizontal" },
];

export default function ConcernsStep() {
  const { concerns, toggleConcern, currentStep } = useOnboardingStore();

  const handleNext = () => {
    router.push("/(onboarding)/age-range");
  };

  return (
    <ScrollView className="flex-1 bg-surface">
      <View className="px-6 pt-14 pb-6 flex-1">
        <View className="flex-row gap-2 mb-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={i} className={`h-1 flex-1 rounded-full ${i <= currentStep ? "bg-primary-500" : "bg-surface-border"}`} />
          ))}
        </View>
        <Text className="text-white text-2xl font-bold mb-2">What are your concerns?</Text>
        <Text className="text-gray-400 mb-6">Select all that apply. We'll prioritize these in your routine.</Text>

        <View className="flex-row flex-wrap gap-2">
          {CONCERNS.map((concern) => {
            const isSelected = concerns.includes(concern.id);
            return (
              <TouchableOpacity
                key={concern.id}
                className={`px-4 py-3 rounded-full border ${
                  isSelected ? "bg-primary-500 border-primary-500" : "bg-surface-card border-surface-border"
                }`}
                onPress={() => toggleConcern(concern.id)}
              >
                <Text className={`font-medium ${isSelected ? "text-surface" : "text-gray-300"}`}>
                  {concern.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="mt-8">
          <TouchableOpacity
            className="bg-primary-500 rounded-xl py-4 items-center"
            onPress={handleNext}
          >
            <Text className="text-surface font-semibold text-lg">Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
