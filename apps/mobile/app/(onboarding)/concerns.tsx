import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useOnboardingStore } from "../../src/stores/onboarding";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { COLORS } from "../../src/constants/theme";
import { hapticLight } from "../../src/lib/haptics";

const CONCERNS = [
  { id: "acne", label: "Acne", icon: "bug" },
  { id: "aging", label: "Fine Lines", icon: "hourglass" },
  { id: "pigmentation", label: "Dark Spots", icon: "ellipse" },
  { id: "dryness", label: "Dryness", icon: "water" },
  { id: "oiliness", label: "Excess Oil", icon: "drop" },
  { id: "redness", label: "Redness", icon: "alert-circle" },
  { id: "pores", label: "Large Pores", icon: "grid" },
  { id: "dullness", label: "Dullness", icon: "sunny" },
  { id: "dark_circles", label: "Dark Circles", icon: "eye" },
  { id: "uneven_texture", label: "Texture", icon: "swap-horizontal" },
];

export default function ConcernsStep() {
  const { concerns, toggleConcern, currentStep } = useOnboardingStore();

  return (
    <ScrollView className="flex-1 bg-bg" showsVerticalScrollIndicator={false}>
      <View className="flex-1 px-7 pt-16 pb-10">
        <View className="flex-row gap-1.5 mb-12">
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={i} className={`h-1 flex-1 rounded-full ${i <= currentStep ? "bg-primary" : "bg-border"}`} />
          ))}
        </View>

        <Animated.Text entering={FadeInUp.duration(500).springify()} className="text-text text-3xl font-bold mb-2" style={{ letterSpacing: -0.5 }}>
          Your concerns
        </Animated.Text>
        <Animated.Text entering={FadeInUp.delay(100).duration(500).springify()} className="text-text-secondary text-[17px] leading-6 mb-10">
          Select all that apply. We'll prioritize these in your routine.
        </Animated.Text>

        <View className="flex-row flex-wrap gap-2.5">
          {CONCERNS.map((concern, i) => {
            const isSelected = concerns.includes(concern.id);
            return (
              <Animated.View key={concern.id} entering={FadeInDown.delay(150 + i * 60).duration(400).springify()}>
                <TouchableOpacity
                  className="px-5 py-3.5 rounded-[14px] flex-row items-center gap-2"
                  style={{
                    backgroundColor: isSelected ? COLORS.primarySubtle : COLORS.surfaceCard,
                    borderColor: isSelected ? COLORS.primaryStrong : COLORS.border,
                    borderWidth: 1,
                  }}
                  onPress={() => {
                    hapticLight();
                    toggleConcern(concern.id);
                  }}
                >
                  <Ionicons name={concern.icon as any} size={16} color={isSelected ? COLORS.primary : COLORS.textTertiary} />
                  <Text className="font-medium text-[15px]" style={{ color: isSelected ? COLORS.primary : COLORS.textSecondary }}>
                    {concern.label}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <View className="mt-10">
          <TouchableOpacity
            className="rounded-[16px] items-center"
            style={{ height: 56, backgroundColor: concerns.length > 0 ? COLORS.primary : COLORS.surfaceDisabled }}
            onPress={() => {
              if (concerns.length > 0) {
                hapticLight();
                router.push("/(onboarding)/age-range");
              }
            }}
            disabled={concerns.length === 0}
          >
            <Text className="font-semibold text-[17px]" style={{ color: concerns.length > 0 ? COLORS.textInverse : COLORS.textQuaternary }}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
