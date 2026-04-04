import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { COLORS } from "../src/constants/theme";
import { hapticLight } from "../src/lib/haptics";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AmbientBackground } from "../src/components/ui/DecorativeElements";

export default function SellerScreen() {
  const stats = [
    { label: "Total Views", value: "12,847", trend: 18, icon: "eye" },
    { label: "AI Matches", value: "3,291", trend: 12, icon: "sparkles" },
    { label: "Conversions", value: "847", trend: 24, icon: "cart" },
    { label: "Revenue", value: "$24.8K", trend: 31, icon: "cash" },
  ];

  const topProducts = [
    { rank: 1, name: "Hydra Boost Serum", matches: 1247, rate: "24%", revenue: "$8.2K" },
    { rank: 2, name: "Night Repair Cream", matches: 983, rate: "19%", revenue: "$6.1K" },
    { rank: 3, name: "Vitamin C Toner", matches: 756, rate: "15%", revenue: "$4.3K" },
    { rank: 4, name: "Retinol Eye Cream", matches: 542, rate: "11%", revenue: "$3.2K" },
    { rank: 5, name: "SPF 50 Daily", matches: 421, rate: "9%", revenue: "$2.8K" },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AmbientBackground>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="px-6 pt-16">
        <Animated.View entering={FadeInDown.duration(500).springify()} className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-text-tertiary text-[15px]">Brand Portal</Text>
            <Text className="text-text text-[28px] font-bold tracking-tight">Analytics</Text>
          </View>
          <TouchableOpacity
            className="w-11 h-11 rounded-[14px] items-center justify-center"
            style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1 }}
            onPress={() => hapticLight()}
          >
            <Ionicons name="add" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </Animated.View>

        <View className="flex-row gap-3 mb-5">
          {stats.slice(0, 2).map((stat, i) => (
            <Animated.View key={stat.label} entering={FadeInDown.delay(100 + i * 100).duration(500).springify()} className="flex-1 rounded-[18px] p-5" style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1 }}>
              <View className="flex-row items-center gap-2 mb-3">
                <View className="w-8 h-8 rounded-[10px] items-center justify-center" style={{ backgroundColor: COLORS.primarySubtle }}>
                  <Ionicons name={stat.icon as any} size={16} color={COLORS.primary} />
                </View>
                <Text className="text-text-tertiary text-[12px] uppercase tracking-wider">{stat.label}</Text>
              </View>
              <Text className="text-text text-[24px] font-bold tracking-tight">{stat.value}</Text>
              <View className="flex-row items-center gap-1 mt-1">
                <Ionicons name="trending-up" size={12} color={COLORS.success} />
                <Text className="text-success text-[12px] font-semibold">+{stat.trend}%</Text>
                <Text className="text-text-quaternary text-[11px] ml-1">this week</Text>
              </View>
            </Animated.View>
          ))}
        </View>

        <View className="flex-row gap-3 mb-6">
          {stats.slice(2, 4).map((stat, i) => (
            <Animated.View key={stat.label} entering={FadeInDown.delay(300 + i * 100).duration(500).springify()} className="flex-1 rounded-[18px] p-5" style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1 }}>
              <View className="flex-row items-center gap-2 mb-3">
                <View className="w-8 h-8 rounded-[10px] items-center justify-center" style={{ backgroundColor: COLORS.primarySubtle }}>
                  <Ionicons name={stat.icon as any} size={16} color={COLORS.primary} />
                </View>
                <Text className="text-text-tertiary text-[12px] uppercase tracking-wider">{stat.label}</Text>
              </View>
              <Text className="text-text text-[24px] font-bold tracking-tight">{stat.value}</Text>
              <View className="flex-row items-center gap-1 mt-1">
                <Ionicons name="trending-up" size={12} color={COLORS.success} />
                <Text className="text-success text-[12px] font-semibold">+{stat.trend}%</Text>
                <Text className="text-text-quaternary text-[11px] ml-1">this week</Text>
              </View>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInDown.delay(500).duration(500).springify()} className="rounded-[22px] p-6 mb-5" style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1 }}>
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-text font-semibold text-[17px]">Top Products</Text>
            <TouchableOpacity onPress={() => hapticLight()}>
              <Text className="text-primary text-[15px] font-medium">See All</Text>
            </TouchableOpacity>
          </View>

          <View className="gap-3">
            {topProducts.map((product, i) => (
              <Animated.View
                key={product.rank}
                entering={FadeInDown.delay(600 + i * 80).duration(400).springify()}
                className="flex-row items-center py-3"
                style={{ borderBottomWidth: i < topProducts.length - 1 ? 1 : 0, borderBottomColor: COLORS.border }}
              >
                <View className="w-8 h-8 rounded-full items-center justify-center mr-4" style={{ backgroundColor: i === 0 ? "rgba(201, 169, 110, 0.2)" : "rgba(255,255,255,0.04)" }}>
                  <Text className="text-[13px] font-bold" style={{ color: i === 0 ? COLORS.primary : COLORS.textTertiary }}>{product.rank}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-text font-medium text-[15px]">{product.name}</Text>
                  <Text className="text-text-quaternary text-[13px] mt-0.5">{product.matches} AI matches</Text>
                </View>
                <View className="items-end">
                  <Text className="text-primary text-[15px] font-semibold">{product.rate}</Text>
                  <Text className="text-text-quaternary text-[12px] mt-0.5">{product.revenue}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(1000).duration(500).springify()} className="rounded-[22px] p-6" style={{ backgroundColor: "rgba(201, 169, 110, 0.06)", borderColor: "rgba(201, 169, 110, 0.15)", borderWidth: 1 }}>
          <View className="flex-row items-center gap-4 mb-4">
            <View className="w-12 h-12 rounded-[16px] items-center justify-center" style={{ backgroundColor: COLORS.primarySubtle }}>
              <Ionicons name="bulb" size={22} color={COLORS.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-text font-semibold text-[17px]">AI Insight</Text>
              <Text className="text-text-tertiary text-[15px] mt-0.5">Your products match 3x better with users who have dry skin concerns.</Text>
            </View>
          </View>
          <TouchableOpacity className="py-3 rounded-[12px] items-center" style={{ backgroundColor: COLORS.primary }}>
            <Text className="text-black font-semibold text-[15px]">View Full Report</Text>
          </TouchableOpacity>
        </Animated.View>
        </View>
        </ScrollView>
      </AmbientBackground>
    </GestureHandlerRootView>
  );
}
