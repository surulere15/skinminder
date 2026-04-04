import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useOnboardingStore } from "../../../src/stores/onboarding";
import Animated, { FadeInDown, FadeInUp, FadeIn } from "react-native-reanimated";
import { COLORS } from "../../../src/constants/theme";
import { hapticMedium } from "../../../src/lib/haptics";

export default function WelcomeStep() {
  const { currentStep, setStep } = useOnboardingStore();

  const features = [
    { icon: "scan", title: "AI Skin Analysis", desc: "Claude-powered computer vision that reads your skin at a molecular level." },
    { icon: "fitness", title: "Skin DNA Profile", desc: "Your unique skin archetype tracked across every scan, forever." },
    { icon: "time", title: "Smart Routines", desc: "Morning and evening protocols that adapt to your skin and climate." },
  ];

  return (
    <ScrollView className="flex-1 bg-bg" showsVerticalScrollIndicator={false}>
      <View className="flex-1 px-7 pt-16 pb-10 justify-center">
        <View className="flex-row gap-1.5 mb-16">
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={i} className={`h-1 flex-1 rounded-full ${i <= currentStep ? "bg-primary" : "bg-border"}`} />
          ))}
        </View>

        <Animated.View entering={FadeInUp.delay(100).duration(700).springify()}>
          <View className="w-20 h-20 rounded-[28px] bg-primary-subtle items-center justify-center mb-8" style={{ borderWidth: 1, borderColor: "rgba(201, 169, 110, 0.2)" }}>
            <Ionicons name="sparkles" size={36} color={COLORS.primary} />
          </View>
        </Animated.View>

        <Animated.Text entering={FadeInUp.delay(200).duration(700).springify()} className="text-text text-4xl font-bold mb-3" style={{ letterSpacing: -0.5 }}>
          Welcome to{"\n"}SkinMinder
        </Animated.Text>

        <Animated.Text entering={FadeInUp.delay(300).duration(700).springify()} className="text-text-secondary text-lg leading-7 mb-12">
          Your AI-powered skincare intelligence. Let's personalize your experience.
        </Animated.Text>

        <View className="gap-4 mb-12">
          {features.map((item, i) => (
            <Animated.View
              key={i}
              entering={FadeInDown.delay(400 + i * 100).duration(600).springify()}
              className="flex-row items-start gap-4 bg-surface-card p-5 rounded-[20px]"
              style={{ borderWidth: 1, borderColor: COLORS.border }}
            >
              <View className="w-11 h-11 rounded-[14px] bg-primary-subtle items-center justify-center mt-0.5">
                <Ionicons name={item.icon as any} size={20} color={COLORS.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-text font-semibold text-[17px] mb-1">{item.title}</Text>
                <Text className="text-text-tertiary text-[15px] leading-5">{item.desc}</Text>
              </View>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeIn.delay(800).duration(500)}>
          <TouchableOpacity
            className="bg-primary rounded-[16px] py-4.5 items-center"
            style={{ height: 56 }}
            onPress={() => {
              hapticMedium();
              setStep(1);
              router.push("/(onboarding)/skin-type");
            }}
          >
            <Text className="text-black font-semibold text-[17px]">Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
}
