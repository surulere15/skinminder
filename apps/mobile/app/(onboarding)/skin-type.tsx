import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useOnboardingStore } from "../../../src/stores/onboarding";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { COLORS } from "../../../src/constants/theme";
import { hapticLight } from "../../../src/lib/haptics";

const SKIN_TYPES = [
  { id: "normal", label: "Normal", icon: "checkmark-circle", desc: "Balanced, minimal concerns" },
  { id: "dry", label: "Dry", icon: "water", desc: "Tight, flaky, or dull" },
  { id: "oily", label: "Oily", icon: "drop", desc: "Shiny, enlarged pores" },
  { id: "combination", label: "Combination", icon: "git-merge", desc: "Oily T-zone, dry cheeks" },
  { id: "sensitive", label: "Sensitive", icon: "alert-circle", desc: "Reactive, redness-prone" },
];

export default function SkinTypeStep() {
  const { skinType, setSkinType, currentStep } = useOnboardingStore();

  return (
    <ScrollView className="flex-1 bg-bg" showsVerticalScrollIndicator={false}>
      <View className="flex-1 px-7 pt-16 pb-10">
        <View className="flex-row gap-1.5 mb-12">
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={i} className={`h-1 flex-1 rounded-full ${i <= currentStep ? "bg-primary" : "bg-border"}`} />
          ))}
        </View>

        <Animated.Text entering={FadeInUp.duration(500).springify()} className="text-text text-3xl font-bold mb-2" style={{ letterSpacing: -0.5 }}>
          Your skin type
        </Animated.Text>
        <Animated.Text entering={FadeInUp.delay(100).duration(500).springify()} className="text-text-secondary text-[17px] leading-6 mb-10">
          This calibrates our AI analysis engine for your unique skin.
        </Animated.Text>

        <View className="gap-3">
          {SKIN_TYPES.map((type, i) => {
            const isSelected = skinType === type.id;
            return (
              <Animated.View key={type.id} entering={FadeInDown.delay(200 + i * 80).duration(500).springify()}>
                <TouchableOpacity
                  className="p-5 rounded-[18px] flex-row items-center gap-4"
                  style={{
                    backgroundColor: isSelected ? COLORS.primarySubtle : COLORS.surfaceCard,
                    borderColor: isSelected ? "rgba(201, 169, 110, 0.4)" : COLORS.border,
                    borderWidth: 1,
                  }}
                  onPress={() => {
                    hapticLight();
                    setSkinType(type.id);
                  }}
                >
                  <View className="w-12 h-12 rounded-[14px] items-center justify-center" style={{ backgroundColor: isSelected ? "rgba(201, 169, 110, 0.2)" : "rgba(255,255,255,0.04)" }}>
                    <Ionicons name={type.icon as any} size={22} color={isSelected ? COLORS.primary : COLORS.textTertiary} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-text font-semibold text-[17px]">{type.label}</Text>
                    <Text className="text-text-tertiary text-[15px] mt-0.5">{type.desc}</Text>
                  </View>
                  {isSelected && <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <View className="mt-10">
          <TouchableOpacity
            className="rounded-[16px] items-center"
            style={{
              height: 56,
              backgroundColor: skinType ? COLORS.primary : "rgba(255,255,255,0.06)",
            }}
            onPress={() => {
              if (skinType) {
                hapticLight();
                router.push("/(onboarding)/concerns");
              }
            }}
            disabled={!skinType}
          >
            <Text className="font-semibold text-[17px]" style={{ color: skinType ? "#000" : COLORS.textQuaternary }}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
