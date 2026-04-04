import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function Screen({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <SafeAreaView className={`flex-1 bg-surface ${className}`}>
      <View className="flex-1">{children}</View>
    </SafeAreaView>
  );
}

export function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <View className={`px-6 mb-6 ${className}`}>
      {children}
    </View>
  );
}

export function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <View className="flex-row justify-between items-center mb-3">
      <Text className="text-white font-semibold text-lg">{title}</Text>
      {action}
    </View>
  );
}
