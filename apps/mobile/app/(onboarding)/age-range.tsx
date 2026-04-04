import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useOnboardingStore } from "../../../src/stores/onboarding";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { COLORS } from "../../../src/constants/theme";
import { hapticLight } from "../../../src/lib/haptics";

const AGE_RANGES = ["18-24", "25-34", "35-44", "45-54", "55+"];

export default function AgeRangeStep() {
  const { ageRange, setAgeRange, currentStep } = useOnboardingStore();

  return (
    <ScrollView className="flex-1 bg-bg" showsVerticalScrollIndicator={false}>
      <View className="flex-1 px-7 pt-16 pb-10 justify-center">
        <View className="flex-row gap-1.5 mb-12">
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={i} className={`h-1 flex-1 rounded-full ${i <= currentStep ? "bg-primary" : "bg-border"}`} />
          ))}
        </View>

        <Animated.Text entering={FadeInUp.duration(500).springify()} className="text-text text-3xl font-bold mb-2" style={{ letterSpacing: -0.5 }}>
          Your age range
        </Animated.Text>
        <Animated.Text entering={FadeInUp.delay(100).duration(500).springify()} className="text-text-secondary text-[17px] leading-6 mb-12">
          Skin needs evolve. This helps us calibrate your analysis and recommendations.
        </Animated.Text>

        <View className="gap-3">
          {AGE_RANGES.map((range, i) => {
            const isSelected = ageRange === range;
            return (
              <Animated.View key={range} entering={FadeInDown.delay(200 + i * 80).duration(500).springify()}>
                <TouchableOpacity
                  className="p-6 rounded-[22px] items-center"
                  style={{
                    backgroundColor: isSelected ? COLORS.primarySubtle : COLORS.surfaceCard,
                    borderColor: isSelected ? COLORS.primaryStrong : COLORS.border,
                    borderWidth: 1,
                  }}
                  onPress={() => {
                    hapticLight();
                    setAgeRange(range);
                  }}
                >
                  <Text className="text-[28px] font-bold tracking-tight" style={{ color: isSelected ? COLORS.primary : COLORS.text }}>
                    {range}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <View className="mt-12">
          <TouchableOpacity
            className="rounded-[16px] items-center"
            style={{ height: 56, backgroundColor: ageRange ? COLORS.primary : COLORS.surfaceDisabled }}
            onPress={() => {
              if (ageRange) {
                hapticLight();
                router.push("/(onboarding)/climate");
              }
            }}
            disabled={!ageRange}
          >
            <Text className="font-semibold text-[17px]" style={{ color: ageRange ? COLORS.textInverse : COLORS.textQuaternary }}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
