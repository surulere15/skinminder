import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../src/stores/auth";
import { useScanStore } from "../../src/stores/scan";
import { getRelativeTime } from "../../src/lib/utils";

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const { scans, dna, isLoading, refreshAll } = useScanStore();

  useEffect(() => {
    if (user?.id) refreshAll(user.id);
  }, [user?.id]);

  const averageScore = scans.length
    ? Math.round(scans.reduce((acc, s) => acc + s.overall_score, 0) / scans.length)
    : 0;

  return (
    <ScrollView className="flex-1 bg-surface">
      <View className="px-6 pt-14 pb-6">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-white text-2xl font-bold">Intelligence</Text>
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-surface-card items-center justify-center"
            onPress={() => user?.id && refreshAll(user.id)}
          >
            <Ionicons name="refresh" size={18} color="#a18b6f" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View className="items-center mt-20">
            <Text className="text-gray-500">Loading your data...</Text>
          </View>
        ) : (
          <>
            <View className="bg-surface-card rounded-2xl p-5 mb-4 border border-surface-border">
              <Text className="text-gray-400 text-sm mb-1">Average Score</Text>
              <Text className="text-4xl font-bold text-primary-500">{averageScore}</Text>
              <Text className="text-gray-500 text-xs mt-1">Across {scans.length} scans</Text>
            </View>

            {dna && (
              <View className="bg-surface-card rounded-2xl p-5 mb-4 border border-surface-border">
                <Text className="text-white font-semibold text-lg mb-3">Skin DNA Profile</Text>
                <View className="flex-row items-center gap-3 mb-3">
                  <View className="w-12 h-12 rounded-full bg-primary-500/20 items-center justify-center">
                    <Ionicons name="fitness" size={24} color="#a18b6f" />
                  </View>
                  <View>
                    <Text className="text-primary-500 font-semibold text-lg">{dna.archetype}</Text>
                    <Text className="text-gray-500 text-xs">Generated {getRelativeTime(dna.generated_at)}</Text>
                  </View>
                </View>
                <View className="flex-wrap flex-row gap-2">
                  {dna.vulnerabilities.map((v: string, i: number) => (
                    <View key={i} className="bg-surface-border rounded-full px-3 py-1">
                      <Text className="text-gray-300 text-xs">{v}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <Text className="text-white font-semibold text-lg mb-3">Scan History</Text>
            {scans.length === 0 ? (
              <View className="bg-surface-card rounded-2xl p-8 items-center border border-surface-border">
                <Ionicons name="camera" size={40} color="#666" />
                <Text className="text-gray-500 mt-3">No scans yet</Text>
                <Text className="text-gray-600 text-sm mt-1">Take your first skin analysis</Text>
              </View>
            ) : (
              scans.slice(0, 10).map((scan) => (
                <View
                  key={scan.id}
                  className="bg-surface-card rounded-xl p-4 mb-2 border border-surface-border"
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-gray-500 text-xs">{getRelativeTime(scan.created_at)}</Text>
                    <View className="w-10 h-10 rounded-full bg-primary-500/20 items-center justify-center">
                      <Text className="text-primary-500 font-bold">{scan.overall_score}</Text>
                    </View>
                  </View>
                  <View className="flex-row gap-4">
                    <MiniScore label="H" score={scan.hydration_score} color="#4fc3f7" />
                    <MiniScore label="T" score={scan.texture_score} color="#81c784" />
                    <MiniScore label="P" score={scan.pigment_score} color="#ffb74d" />
                    <MiniScore label="S" score={scan.sensitivity_score} color="#ef5350" />
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

function MiniScore({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <View className="items-center flex-1">
      <Text className="text-xs text-gray-500">{label}</Text>
      <Text className="text-sm font-semibold" style={{ color }}>{score}</Text>
    </View>
  );
}
