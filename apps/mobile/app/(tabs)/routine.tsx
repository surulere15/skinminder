import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../src/stores/auth";
import { useScanStore } from "../../src/stores/scan";
import Animated, { FadeInDown, FadeInUp, Layout } from "react-native-reanimated";
import { COLORS } from "../../src/constants/theme";
import { hapticLight } from "../../src/lib/haptics";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AmbientBackground } from "../../src/components/ui/DecorativeElements";

export default function RoutineScreen() {
  const { user } = useAuthStore();
  const { routine, fetchRoutine } = useScanStore();
  const [activeTab, setActiveTab] = useState<"morning" | "evening">("morning");

  useEffect(() => {
    if (user?.id) fetchRoutine(user.id);
  }, [user?.id]);

  const steps = activeTab === "morning" ? routine?.morning : routine?.evening;

  const stepIcons: Record<string, any> = {
    cleanser: "water",
    toner: "drop",
    serum: "eyedrop",
    moisturizer: "cloud",
    sunscreen: "sunny",
    treatment: "medkit",
    eye_cream: "eye",
    oil: "flask",
  };

  if (!routine) {
    return (
      <View className="flex-1 bg-bg justify-center items-center px-8">
        <Animated.View entering={FadeInUp.duration(600).springify()} className="w-20 h-20 rounded-[24px] items-center justify-center mb-6" style={{ backgroundColor: COLORS.primarySubtle }}>
          <Ionicons name="time" size={36} color={COLORS.primary} />
        </Animated.View>
        <Animated.Text entering={FadeInUp.delay(100).duration(500)} className="text-text text-2xl font-bold mb-2">No Routine Yet</Animated.Text>
        <Animated.Text entering={FadeInUp.delay(200).duration(500)} className="text-text-tertiary text-center text-[17px] leading-6">Complete a skin analysis to receive your personalized morning and evening routine.</Animated.Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AmbientBackground>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="px-6 pt-16">
        <Text className="text-text text-[28px] font-bold tracking-tight mb-1">Your Routine</Text>
        <Text className="text-text-tertiary text-[15px] mb-6">Version {routine.version}{routine.climate_adjusted ? " • Climate Adjusted" : ""}</Text>

        <View className="flex-row p-1 rounded-[14px] mb-8" style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1 }}>
          {(["morning", "evening"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              className="flex-1 py-3.5 rounded-[14px] items-center flex-row justify-center gap-2"
              style={{ backgroundColor: activeTab === tab ? COLORS.primary : "transparent" }}
              onPress={() => {
                hapticLight();
                setActiveTab(tab);
              }}
            >
              <Ionicons name={tab === "morning" ? "sunny" : "moon"} size={16} color={activeTab === tab ? "#000" : COLORS.textTertiary} />
              <Text className="font-semibold text-[15px]" style={{ color: activeTab === tab ? "#000" : COLORS.textTertiary, textTransform: "capitalize" }}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="gap-3">
          {steps?.map((step, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(index * 80).duration(400).springify()}
              layout={Layout.springify()}
              className="rounded-[22px] p-5 flex-row items-start gap-4"
              style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1 }}
            >
              <View className="w-10 h-10 rounded-[14px] items-center justify-center mt-0.5" style={{ backgroundColor: COLORS.primarySubtle }}>
                <Ionicons name={stepIcons[step.step_type] || "sparkles"} size={18} color={COLORS.primary} />
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-text font-semibold text-[17px]">{step.product_name}</Text>
                  <View className="px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                    <Text className="text-text-quaternary text-[12px] font-medium">Step {step.order}</Text>
                  </View>
                </View>
                <Text className="text-text-tertiary text-[15px] leading-5">{step.instructions}</Text>
                {step.duration_seconds > 0 && (
                  <View className="flex-row items-center gap-1.5 mt-2.5">
                    <Ionicons name="timer" size={13} color={COLORS.textQuaternary} />
                    <Text className="text-text-quaternary text-[13px]">{step.duration_seconds}s wait time</Text>
                  </View>
                )}
              </View>
            </Animated.View>
          ))}
        </View>
        </View>
        </ScrollView>
      </AmbientBackground>
    </GestureHandlerRootView>
  );
}
