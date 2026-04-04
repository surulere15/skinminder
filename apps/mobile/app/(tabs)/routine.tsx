import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../src/stores/auth";
import { useScanStore } from "../../src/stores/scan";

export default function RoutineScreen() {
  const { user } = useAuthStore();
  const { routine, fetchRoutine } = useScanStore();
  const [activeTab, setActiveTab] = useState<"morning" | "evening">("morning");

  useEffect(() => {
    if (user?.id) fetchRoutine(user.id);
  }, [user?.id]);

  const steps = activeTab === "morning" ? routine?.morning : routine?.evening;

  const stepIcons: Record<string, string> = {
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
      <View className="flex-1 bg-surface justify-center items-center px-8">
        <Ionicons name="time" size={64} color="#a18b6f" />
        <Text className="text-white text-xl font-bold mt-6">No Routine Yet</Text>
        <Text className="text-gray-400 text-center mt-2">
          Complete a skin analysis to receive your personalized morning and evening routine.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-surface">
      <View className="px-6 pt-14 pb-6">
        <Text className="text-white text-2xl font-bold mb-2">Your Routine</Text>
        <Text className="text-gray-400 mb-6">
          Version {routine.version} {routine.climate_adjusted ? "• Climate Adjusted" : ""}
        </Text>

        <View className="flex-row bg-surface-card rounded-xl p-1 mb-6 border border-surface-border">
          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg items-center ${activeTab === "morning" ? "bg-primary-500" : ""}`}
            onPress={() => setActiveTab("morning")}
          >
            <Ionicons name="sunny" size={18} color={activeTab === "morning" ? "#0A0A0A" : "#666"} />
            <Text className={`mt-1 font-semibold ${activeTab === "morning" ? "text-surface" : "text-gray-500"}`}>
              Morning
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg items-center ${activeTab === "evening" ? "bg-primary-500" : ""}`}
            onPress={() => setActiveTab("evening")}
          >
            <Ionicons name="moon" size={18} color={activeTab === "evening" ? "#0A0A0A" : "#666"} />
            <Text className={`mt-1 font-semibold ${activeTab === "evening" ? "text-surface" : "text-gray-500"}`}>
              Evening
            </Text>
          </TouchableOpacity>
        </View>

        <View className="gap-4">
          {steps?.map((step, index) => (
            <View
              key={index}
              className="bg-surface-card rounded-xl p-4 border border-surface-border flex-row items-start gap-4"
            >
              <View className="w-8 h-8 rounded-full bg-primary-500/20 items-center justify-center mt-0.5">
                <Ionicons
                  name={(stepIcons[step.step_type] || "sparkles") as any}
                  size={16}
                  color="#a18b6f"
                />
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between items-center">
                  <Text className="text-white font-semibold">{step.product_name}</Text>
                  <Text className="text-gray-500 text-xs">Step {step.order}</Text>
                </View>
                <Text className="text-gray-400 text-sm mt-1">{step.instructions}</Text>
                {step.duration_seconds > 0 && (
                  <View className="flex-row items-center gap-1 mt-2">
                    <Ionicons name="timer" size={12} color="#666" />
                    <Text className="text-gray-500 text-xs">{step.duration_seconds}s</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
