import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/theme";

export function Screen({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flex: 1 }}>{children}</View>
    </SafeAreaView>
  );
}

export function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
      {children}
    </View>
  );
}
