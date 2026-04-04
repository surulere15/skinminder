import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SellerScreen() {
  return (
    <ScrollView className="flex-1 bg-surface">
      <View className="px-6 pt-14 pb-6">
        <Text className="text-white text-2xl font-bold mb-6">Brand Portal</Text>

        <View className="bg-surface-card rounded-2xl p-5 mb-4 border border-surface-border">
          <Text className="text-gray-400 text-sm mb-1">Total Views</Text>
          <Text className="text-3xl font-bold text-white">12,847</Text>
          <Text className="text-green-400 text-xs mt-1">+18% this week</Text>
        </View>

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 bg-surface-card rounded-xl p-4 border border-surface-border">
            <Text className="text-gray-400 text-xs mb-1">AI Matches</Text>
            <Text className="text-xl font-bold text-primary-500">3,291</Text>
          </View>
          <View className="flex-1 bg-surface-card rounded-xl p-4 border border-surface-border">
            <Text className="text-gray-400 text-xs mb-1">Conversions</Text>
            <Text className="text-xl font-bold text-green-400">847</Text>
          </View>
        </View>

        <View className="bg-surface-card rounded-2xl p-5 border border-surface-border">
          <Text className="text-white font-semibold text-lg mb-3">Top Products</Text>
          {[
            { name: "Hydra Boost Serum", matches: 1247, rate: "24%" },
            { name: "Night Repair Cream", matches: 983, rate: "19%" },
            { name: "Vitamin C Toner", matches: 756, rate: "15%" },
          ].map((product, i) => (
            <View
              key={i}
              className="flex-row justify-between items-center py-3 border-b border-surface-border last:border-b-0"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full bg-primary-500/20 items-center justify-center">
                  <Text className="text-primary-500 text-xs font-bold">{i + 1}</Text>
                </View>
                <Text className="text-white">{product.name}</Text>
              </View>
              <View className="items-end">
                <Text className="text-gray-300 text-sm">{product.matches} matches</Text>
                <Text className="text-primary-500 text-xs">{product.rate} conv.</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
