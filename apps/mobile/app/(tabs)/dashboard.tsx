import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../src/stores/auth";
import { useScanStore } from "../../src/stores/scan";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { COLORS } from "../../src/constants/theme";
import { FullScreenSkeleton } from "../../src/components/ui/Skeleton";
import { hapticMedium } from "../../src/lib/haptics";
import { AmbientBackground } from "../../src/components/ui/DecorativeElements";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const { scans, dna, isLoading, refreshAll } = useScanStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) refreshAll(user.id);
  }, [user?.id]);

  const onRefresh = useCallback(async () => {
    if (!user?.id) return;
    setRefreshing(true);
    hapticMedium();
    await refreshAll(user.id);
    setRefreshing(false);
  }, [user?.id]);

  const validScans = scans.filter((s) => s.overall_score != null);
  const avgScore = validScans.length ? Math.round(validScans.reduce((a, s) => a + s.overall_score!, 0) / validScans.length) : 0;
  const latestScan = scans[0];

  if (isLoading && scans.length === 0) {
    return <FullScreenSkeleton />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AmbientBackground>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} colors={[COLORS.primary]} progressBackgroundColor={COLORS.surfaceCard} />
          }
        >
          <View className="px-6 pt-16">
        <Animated.View entering={FadeInDown.duration(500).springify()} className="flex-row justify-between items-center mb-8">
          <Text className="text-text text-[28px] font-bold tracking-tight">Intelligence</Text>
          <TouchableOpacity
            className="w-11 h-11 rounded-[14px] items-center justify-center"
            style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1 }}
            onPress={() => user?.id && refreshAll(user.id)}
          >
            <Ionicons name="refresh" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </Animated.View>

        {isLoading ? (
          <View className="items-center mt-20">
            <View className="w-12 h-12 rounded-full items-center justify-center mb-4" style={{ backgroundColor: COLORS.primarySubtle }}>
              <Ionicons name="hourglass" size={22} color={COLORS.primary} />
            </View>
            <Text className="text-text-tertiary text-[15px]">Loading your intelligence...</Text>
          </View>
        ) : (
          <>
            <Animated.View entering={FadeInDown.delay(100).duration(600).springify()} className="rounded-[22px] p-6 mb-5" style={{ backgroundColor: "rgba(201, 169, 110, 0.06)", borderColor: "rgba(201, 169, 110, 0.15)", borderWidth: 1 }}>
              <Text className="text-text-tertiary text-[13px] uppercase tracking-wider mb-1">Average Score</Text>
              <Text className="text-[48px] font-bold text-primary tracking-tight">{avgScore}</Text>
              <Text className="text-text-quaternary text-[13px] mt-1">Across {scans.length} scans</Text>
            </Animated.View>

            {latestScan && (
              <Animated.View entering={FadeInDown.delay(200).duration(600).springify()} className="rounded-[22px] p-6 mb-5" style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1 }}>
                <Text className="text-text font-semibold text-[17px] mb-5">Latest Breakdown</Text>
                <View className="flex-row justify-between">
                  <ScorePill label="Hydration" score={latestScan.hydration_score} color={COLORS.scores.hydration} />
                  <ScorePill label="Texture" score={latestScan.texture_score} color={COLORS.scores.texture} />
                  <ScorePill label="Pigment" score={latestScan.pigment_score} color={COLORS.scores.pigment} />
                </View>
                <View className="flex-row justify-between mt-3">
                  <ScorePill label="Pores" score={latestScan.pore_score} color={COLORS.scores.pores} />
                  <ScorePill label="Sensitivity" score={latestScan.sensitivity_score} color={COLORS.scores.sensitivity} />
                  <ScorePill label="Firmness" score={latestScan.firmness_score} color={COLORS.scores.firmness} />
                </View>
              </Animated.View>
            )}

            {dna && (
              <Animated.View entering={FadeInDown.delay(300).duration(600).springify()} className="rounded-[22px] p-6 mb-5" style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1 }}>
                <Text className="text-text font-semibold text-[17px] mb-4">Skin DNA Profile</Text>
                <View className="flex-row items-center gap-4 mb-4">
                  <View className="w-14 h-14 rounded-[22px] items-center justify-center" style={{ backgroundColor: COLORS.primarySubtle }}>
                    <Ionicons name="fitness" size={26} color={COLORS.primary} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-primary text-[18px] font-bold">{dna.archetype}</Text>
                    <Text className="text-text-quaternary text-[13px] mt-0.5">Generated {formatRelative(dna.generated_at)}</Text>
                  </View>
                </View>
                <View className="flex-row flex-wrap gap-2">
                {dna.vulnerabilities?.map((v: string, i: number) => (
                  <View key={i} className="px-3.5 py-2 rounded-full" style={{ backgroundColor: COLORS.surfaceCard }}>
                    <Text className="text-text-tertiary text-[13px]">{v}</Text>
                  </View>
                ))}
                </View>
              </Animated.View>
            )}

            <Text className="text-text font-semibold text-[17px] mb-3">Scan History</Text>
            {scans.length === 0 ? (
              <Animated.View entering={FadeInUp.delay(400).duration(500)} className="rounded-[22px] p-10 items-center" style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1 }}>
                <Ionicons name="camera" size={40} color={COLORS.textQuaternary} />
                <Text className="text-text-tertiary mt-3 text-[17px]">No scans yet</Text>
                <Text className="text-text-quaternary text-[15px] mt-1">Take your first skin analysis</Text>
              </Animated.View>
            ) : (
              scans.slice(0, 10).map((scan, i) => (
                <Animated.View key={scan.id} entering={FadeInDown.delay(100 * Math.min(i, 5)).duration(400)} className="rounded-[22px] p-5 mb-2.5" style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1 }}>
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-text-quaternary text-[13px]">{formatRelative(scan.created_at)}</Text>
                    <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: COLORS.primarySubtle }}>
                      <Text className="text-primary font-bold text-[15px]">{scan.overall_score}</Text>
                    </View>
                  </View>
                  <View className="flex-row gap-3">
                    <HistScore label="H" score={scan.hydration_score} color={COLORS.scores.hydration} />
                    <HistScore label="T" score={scan.texture_score} color={COLORS.scores.texture} />
                    <HistScore label="P" score={scan.pigment_score} color={COLORS.scores.pigment} />
                    <HistScore label="S" score={scan.sensitivity_score} color={COLORS.scores.sensitivity} />
                  </View>
                </Animated.View>
              ))
            )}
          </>
        )}
        </View>
        </ScrollView>
      </AmbientBackground>
    </GestureHandlerRootView>
  );
}

function ScorePill({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <View className="items-center flex-1">
      <View className="w-12 h-12 rounded-full items-center justify-center mb-1.5" style={{ backgroundColor: `${color}12` }}>
        <Text className="text-[16px] font-bold" style={{ color }}>{score}</Text>
      </View>
      <Text className="text-text-quaternary text-[11px]">{label}</Text>
    </View>
  );
}

function HistScore({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <View className="items-center flex-1">
      <Text className="text-[11px] text-text-quaternary mb-0.5">{label}</Text>
      <Text className="text-[14px] font-semibold" style={{ color }}>{score}</Text>
    </View>
  );
}

function formatRelative(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
