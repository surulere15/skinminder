import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useOnboardingStore } from "../../src/stores/onboarding";
import { useAuthStore } from "../../src/stores/auth";
import { supabase } from "../../src/lib/supabase";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { COLORS } from "../../src/constants/theme";
import { hapticLight, hapticSuccess, hapticError } from "../../src/lib/haptics";

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

    const state = useOnboardingStore.getState();
    if (!state.skinType || state.concerns.length === 0 || !state.ageRange) {
      Alert.alert("Incomplete Profile", "Please complete all previous steps before continuing.");
      return;
    }

    try {
      const { error } = await supabase.from("profiles").update({
        skin_type: state.skinType,
        concerns: state.concerns,
        age_range: state.ageRange,
        climate,
      }).eq("id", user.id);

      if (error) throw error;

      hapticSuccess();
      const success = await complete();
      if (success) {
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      hapticError();
      Alert.alert("Save Failed", err.message || "Could not save your profile. Please try again.", [
        { text: "Retry", onPress: handleComplete },
        { text: "Skip", onPress: async () => { await complete(); router.replace("/(tabs)"); } },
      ]);
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
                  className="p-5 rounded-[22px] flex-row items-center gap-4"
                  style={{
                    backgroundColor: isSelected ? COLORS.primarySubtle : COLORS.surfaceCard,
                    borderColor: isSelected ? COLORS.primaryStrong : COLORS.border,
                    borderWidth: 1,
                  }}
                  onPress={() => {
                    hapticLight();
                    setClimate(c.id);
                  }}
                >
                  <View className="w-12 h-12 rounded-[14px] items-center justify-center" style={{ backgroundColor: isSelected ? COLORS.primaryMedium : COLORS.surfaceCard }}>
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
            style={{ height: 56, backgroundColor: climate ? COLORS.primary : COLORS.surfaceDisabled }}
            onPress={handleComplete}
            disabled={!climate}
          >
            <Text className="font-semibold text-[17px]" style={{ color: climate ? COLORS.textInverse : COLORS.textQuaternary }}>
              Start Analyzing
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
