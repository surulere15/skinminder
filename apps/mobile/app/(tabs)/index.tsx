import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../src/stores/auth";
import { useScanStore } from "../../src/stores/scan";
import { useEffect } from "react";
import { getRelativeTime } from "../../src/lib/utils";

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { scans, routine, dna, refreshAll } = useScanStore();

  useEffect(() => {
    if (user?.id) refreshAll(user.id);
  }, [user?.id]);

  const latestScan = scans[0];

  return (
    <ScrollView className="flex-1 bg-surface">
      <View className="px-6 pt-14 pb-6">
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-gray-400 text-sm">Good morning</Text>
            <Text className="text-white text-2xl font-bold">{user?.full_name || "SkinMinder"}</Text>
          </View>
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-surface-card items-center justify-center"
            onPress={() => router.push("/profile")}
          >
            <Ionicons name="person" size={20} color="#a18b6f" />
          </TouchableOpacity>
        </View>

        {latestScan ? (
          <TouchableOpacity
            className="bg-surface-card rounded-2xl p-5 mb-6 border border-surface-border"
            onPress={() => router.push("/dashboard")}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white font-semibold text-lg">Latest Scan</Text>
              <Text className="text-gray-500 text-xs">{getRelativeTime(latestScan.created_at)}</Text>
            </View>
            <View className="flex-row justify-between">
              <ScoreCircle label="Hydration" score={latestScan.hydration_score} color="#4fc3f7" />
              <ScoreCircle label="Texture" score={latestScan.texture_score} color="#81c784" />
              <ScoreCircle label="Pigment" score={latestScan.pigment_score} color="#ffb74d" />
              <ScoreCircle label="Overall" score={latestScan.overall_score} color="#a18b6f" />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-6 mb-6 items-center"
            style={{ backgroundColor: "#a18b6f" }}
            onPress={() => router.push("/scan")}
          >
            <Ionicons name="camera" size={48} color="#0A0A0A" />
            <Text className="text-surface text-xl font-bold mt-3">Analyze Your Skin</Text>
            <Text className="text-surface/70 text-center mt-1">
              Take a photo to get your personalized skin intelligence report
            </Text>
          </TouchableOpacity>
        )}

        {dna && (
          <View className="bg-surface-card rounded-2xl p-5 mb-6 border border-surface-border">
            <Text className="text-white font-semibold text-lg mb-2">Skin DNA</Text>
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-full bg-primary-500/20 items-center justify-center">
                <Ionicons name="fitness" size={24} color="#a18b6f" />
              </View>
              <View>
                <Text className="text-primary-500 font-semibold">{dna.archetype}</Text>
                <Text className="text-gray-500 text-xs">{dna.vulnerabilities.length} vulnerabilities tracked</Text>
              </View>
            </View>
          </View>
        )}

        {routine && (
          <View className="bg-surface-card rounded-2xl p-5 mb-6 border border-surface-border">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-white font-semibold text-lg">Today's Routine</Text>
              <TouchableOpacity onPress={() => router.push("/routine")}>
                <Text className="text-primary-500 text-sm">View All</Text>
              </TouchableOpacity>
            </View>
            <View className="gap-3">
              <View className="flex-row items-center gap-3">
                <Ionicons name="sunny" size={18} color="#ffb74d" />
                <Text className="text-gray-300">{routine.morning.length} morning steps</Text>
              </View>
              <View className="flex-row items-center gap-3">
                <Ionicons name="moon" size={18} color="#7986cb" />
                <Text className="text-gray-300">{routine.evening.length} evening steps</Text>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity
          className="bg-surface-card rounded-2xl p-5 border border-surface-border"
          onPress={() => router.push("/scan")}
        >
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-primary-500 items-center justify-center">
              <Ionicons name="add" size={20} color="#0A0A0A" />
            </View>
            <Text className="text-white font-semibold">New Skin Analysis</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function ScoreCircle({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <View className="items-center">
      <View className="w-14 h-14 rounded-full items-center justify-center" style={{ backgroundColor: `${color}20` }}>
        <Text className="text-xl font-bold" style={{ color }}>{score}</Text>
      </View>
      <Text className="text-gray-500 text-xs mt-1">{label}</Text>
    </View>
  );
}
