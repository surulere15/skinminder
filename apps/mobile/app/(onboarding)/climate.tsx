import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useOnboardingStore } from "../../../src/stores/onboarding";
import { useAuthStore } from "../../../src/stores/auth";
import { supabase } from "../../../src/lib/supabase";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { COLORS } from "../../../src/constants/theme";
import { hapticLight, hapticSuccess } from "../../../src/lib/haptics";

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
    hapticLight();

    try {
      await supabase.from("profiles").update({
        skin_type: useOnboardingStore.getState().skinType,
        concerns: useOnboardingStore.getState().concerns,
        age_range: useOnboardingStore.getState().ageRange,
        climate,
      }).eq("id", user.id);

      hapticSuccess();
      await complete();
      router.replace("/(tabs)");
    } catch {
      await complete();
      router.replace("/(tabs)");
    }
  };

  return (
    <ScrollView className="flex-1 bg-bg" showsVerticalScrollIndicator={false}>
      <View className="flex-1 px-7 pt-16 pb-10">
        <View className="flex-row gap-1.5 mb-12">
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={i} className={`h-1 flex-1 rounded-full ${i <= currentStep ? "bg-primary" : "bg-border"}`} />
          ))}
        </View>

        <Animated.Text entering={FadeInUp.duration(500).springify()} className="text-text text-3xl font-bold mb-2" style={{ letterSpacing: -0.5 }}>
          Your climate
        </Animated.Text>
        <Animated.Text entering={FadeInUp.delay(100).duration(500).springify()} className="text-text-secondary text-[17px] leading-6 mb-10">
          Weather shapes your skin. We adjust your routine to match your environment.
        </Animated.Text>

        <View className="gap-3">
          {CLIMATES.map((c, i) => {
            const isSelected = climate === c.id;
            return (
              <Animated.View key={c.id} entering={FadeInDown.delay(200 + i * 80).duration(500).springify()}>
                <TouchableOpacity
                  className="p-5 rounded-[18px] flex-row items-center gap-4"
                  style={{
                    backgroundColor: isSelected ? COLORS.primarySubtle : COLORS.surfaceCard,
                    borderColor: isSelected ? "rgba(201, 169, 110, 0.4)" : COLORS.border,
                    borderWidth: 1,
                  }}
                  onPress={() => {
                    hapticLight();
                    setClimate(c.id);
                  }}
                >
                  <View className="w-12 h-12 rounded-[14px] items-center justify-center" style={{ backgroundColor: isSelected ? "rgba(201, 169, 110, 0.2)" : "rgba(255,255,255,0.04)" }}>
                    <Ionicons name={c.icon as any} size={22} color={isSelected ? COLORS.primary : COLORS.textTertiary} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-text font-semibold text-[17px]">{c.label}</Text>
                    <Text className="text-text-tertiary text-[15px] mt-0.5">{c.desc}</Text>
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
            style={{ height: 56, backgroundColor: climate ? COLORS.primary : "rgba(255,255,255,0.06)" }}
            onPress={handleComplete}
            disabled={!climate}
          >
            <Text className="font-semibold text-[17px]" style={{ color: climate ? "#000" : COLORS.textQuaternary }}>
              Start Analyzing
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
