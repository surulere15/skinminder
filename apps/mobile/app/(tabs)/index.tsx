import { View, Text, TouchableOpacity, RefreshControl, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../src/stores/auth";
import { useScanStore } from "../../src/stores/scan";
import { useConnectivity } from "../../src/hooks/useConnectivity";
import { useEffect, useState, useCallback } from "react";
import Animated, { FadeInDown, FadeInUp, FadeIn } from "react-native-reanimated";
import { COLORS, SHADOWS } from "../../src/constants/theme";
import { hapticMedium } from "../../src/lib/haptics";
import { FullScreenSkeleton } from "../../src/components/ui/Skeleton";
import { AmbientBackground } from "../../src/components/ui/DecorativeElements";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { scans, routine, dna, refreshAll, loadFromCache, isLoading } = useScanStore();
  const { isOnline } = useConnectivity();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      if (isOnline) refreshAll(user.id);
      else loadFromCache();
    }
  }, [user?.id]);

  const onRefresh = useCallback(async () => {
    if (!user?.id || !isOnline) return;
    setRefreshing(true);
    hapticMedium();
    await refreshAll(user.id);
    setRefreshing(false);
  }, [user?.id, isConnected]);

  const latestScan = scans[0];
  const greeting = getGreeting();

  if (isLoading && scans.length === 0) {
    return <FullScreenSkeleton />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AmbientBackground>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
              progressBackgroundColor={COLORS.surfaceCard}
            />
          }
      >
        <View className="px-6 pt-16">
          <Animated.View entering={FadeInDown.duration(500).springify()} className="flex-row justify-between items-center mb-8">
            <View>
              <Text className="text-text-tertiary text-[15px]">{greeting}</Text>
              <Text className="text-text text-[28px] font-bold tracking-tight">{user?.full_name?.split(" ")[0] || "SkinMinder"}</Text>
            </View>
            <TouchableOpacity
              className="w-11 h-11 rounded-[14px] items-center justify-center"
              style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1 }}
              onPress={() => router.push("/profile")}
            >
              <Ionicons name="person" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </Animated.View>

          {!isOnline && (
            <Animated.View entering={FadeIn.duration(300)} className="flex-row items-center gap-2 px-4 py-3 rounded-[14px] mb-6" style={{ backgroundColor: COLORS.warningSubtle, borderWidth: 1, borderColor: "rgba(251, 191, 36, 0.2)" }}>
              <Ionicons name="wifi-off" size={14} color={COLORS.warning} />
              <Text className="text-warning text-[13px] font-medium">Offline — showing cached data</Text>
            </Animated.View>
          )}

          {latestScan ? (
            <Animated.View entering={FadeInDown.delay(100).duration(600).springify()}>
              <TouchableOpacity
                className="rounded-[22px] p-6 mb-5"
                style={{ backgroundColor: "rgba(201, 169, 110, 0.06)", borderColor: "rgba(201, 169, 110, 0.15)", borderWidth: 1, ...SHADOWS.card }}
                onPress={() => {
                  hapticMedium();
                  router.push("/dashboard");
                }}
              >
                <View className="flex-row justify-between items-center mb-5">
                  <Text className="text-text font-semibold text-[17px]">Latest Analysis</Text>
                  <View className="flex-row items-center gap-1.5">
                    <Ionicons name="time" size={12} color={COLORS.textQuaternary} />
                    <Text className="text-text-quaternary text-[12px]">{formatRelative(latestScan.created_at)}</Text>
                  </View>
                </View>

                <View className="flex-row justify-between">
                  <MiniRing label="Hydration" score={latestScan.hydration_score} color={COLORS.scores.hydration} />
                  <MiniRing label="Texture" score={latestScan.texture_score} color={COLORS.scores.texture} />
                  <MiniRing label="Pigment" score={latestScan.pigment_score} color={COLORS.scores.pigment} />
                  <MiniRing label="Overall" score={latestScan.overall_score} color={COLORS.primary} />
                </View>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <Animated.View entering={FadeInDown.delay(100).duration(600).springify()}>
              <TouchableOpacity
                className="rounded-[22px] p-8 items-center mb-5"
                style={{ backgroundColor: "rgba(201, 169, 110, 0.08)", borderColor: "rgba(201, 169, 110, 0.2)", borderWidth: 1 }}
                onPress={() => {
                  hapticMedium();
                  router.push("/scan");
                }}
              >
                <View className="w-16 h-16 rounded-[20px] items-center justify-center mb-4" style={{ backgroundColor: "rgba(201, 169, 110, 0.15)" }}>
                  <Ionicons name="camera" size={32} color={COLORS.primary} />
                </View>
                <Text className="text-text text-[20px] font-bold mb-1.5">Analyze Your Skin</Text>
                <Text className="text-text-tertiary text-[15px] text-center leading-5">Take a photo for your personalized AI skin intelligence report</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {dna && (
            <Animated.View entering={FadeInDown.delay(200).duration(600).springify()}>
              <View className="rounded-[22px] p-6 mb-5" style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1 }}>
                <View className="flex-row items-center gap-4 mb-4">
                  <View className="w-12 h-12 rounded-[16px] items-center justify-center" style={{ backgroundColor: COLORS.primarySubtle }}>
                    <Ionicons name="fitness" size={22} color={COLORS.primary} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-text font-semibold text-[17px]">Skin DNA</Text>
                    <Text className="text-primary text-[15px] font-medium">{dna.archetype}</Text>
                  </View>
                  <View className="px-3 py-1.5 rounded-full" style={{ backgroundColor: COLORS.primarySubtle }}>
                    <Text className="text-primary text-[12px] font-semibold">{dna.vulnerabilities?.length ?? 0}</Text>
                  </View>
                </View>
                <View className="flex-row flex-wrap gap-2">
                {dna.vulnerabilities?.slice(0, 4).map((v: string, i: number) => (
                  <View key={i} className="px-3 py-1.5 rounded-full" style={{ backgroundColor: COLORS.surfaceCard }}>
                    <Text className="text-text-tertiary text-[12px]">{v}</Text>
                  </View>
                ))}
                {(dna.vulnerabilities?.length ?? 0) > 4 && (
                  <View className="px-3 py-1.5 rounded-full" style={{ backgroundColor: COLORS.surfaceCard }}>
                    <Text className="text-text-quaternary text-[12px]">+{(dna.vulnerabilities?.length ?? 0) - 4}</Text>
                  </View>
                )}
                </View>
              </View>
            </Animated.View>
          )}

          {routine && (
            <Animated.View entering={FadeInDown.delay(300).duration(600).springify()}>
              <View className="rounded-[22px] p-6 mb-5" style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1 }}>
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-text font-semibold text-[17px]">Today's Routine</Text>
                  <TouchableOpacity onPress={() => router.push("/routine")}>
                    <Text className="text-primary text-[15px] font-medium">View All</Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-row gap-4">
                  <View className="flex-1 p-4 rounded-[16px]" style={{ backgroundColor: "rgba(251, 191, 36, 0.06)" }}>
                    <View className="flex-row items-center gap-2 mb-2">
                      <Ionicons name="sunny" size={16} color={COLORS.warning} />
                      <Text className="text-text-secondary text-[13px] font-medium">Morning</Text>
                    </View>
                    <Text className="text-text text-[24px] font-bold">{routine.morning?.length ?? 0}</Text>
                    <Text className="text-text-quaternary text-[12px] mt-0.5">steps</Text>
                  </View>
                  <View className="flex-1 p-4 rounded-[16px]" style={{ backgroundColor: "rgba(96, 165, 250, 0.06)" }}>
                    <View className="flex-row items-center gap-2 mb-2">
                      <Ionicons name="moon" size={16} color={COLORS.info} />
                      <Text className="text-text-secondary text-[13px] font-medium">Evening</Text>
                    </View>
                    <Text className="text-text text-[24px] font-bold">{routine.evening?.length ?? 0}</Text>
                    <Text className="text-text-quaternary text-[12px] mt-0.5">steps</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          )}

          <Animated.View entering={FadeInDown.delay(400).duration(600).springify()}>
            <TouchableOpacity
              className="rounded-[22px] p-5 flex-row items-center gap-4"
              style={{ backgroundColor: COLORS.primary, ...SHADOWS.glow }}
              onPress={() => {
                hapticMedium();
                router.push("/scan");
              }}
            >
              <View className="w-11 h-11 rounded-[14px] items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.15)" }}>
                <Ionicons name="add" size={22} color="#000" />
              </View>
              <Text className="text-black font-semibold text-[17px]">New Skin Analysis</Text>
              <Ionicons name="chevron-forward" size={18} color="rgba(0,0,0,0.4)" style={{ marginLeft: "auto" }} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </AmbientBackground>
  );
}

function MiniRing({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <View className="items-center">
      <View className="w-[56px] h-[56px] rounded-full items-center justify-center" style={{ backgroundColor: `${color}12` }}>
        <Text className="text-[20px] font-bold" style={{ color }}>{score}</Text>
      </View>
      <Text className="text-text-quaternary text-[11px] mt-2">{label}</Text>
    </View>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatRelative(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
