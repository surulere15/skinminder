import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../src/stores/auth";
import * as LocalAuthentication from "expo-local-authentication";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS } from "../../src/constants/theme";
import { hapticLight } from "../../src/lib/haptics";

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();

  const handleBiometric = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (hasHardware) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access SkinMinder",
      });
      if (!result.success) Alert.alert("Authentication failed");
    }
  };

  const menuItems = [
    { icon: "person-outline", label: "Edit Profile", sub: "Name, photo, preferences" },
    { icon: "notifications-outline", label: "Notifications", sub: "Push, email, reminders" },
    { icon: "shield-checkmark-outline", label: "Privacy & Security", sub: "Biometric, data, permissions" },
    { icon: "cloud-upload-outline", label: "Data & Storage", sub: "Cache, exports, backups" },
    { icon: "help-circle-outline", label: "Help & Support", sub: "FAQ, contact, feedback" },
    { icon: "information-circle-outline", label: "About", sub: "Version, licenses, terms" },
  ];

  return (
    <ScrollView className="flex-1 bg-bg" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="px-6 pt-16">
        <Text className="text-text text-[28px] font-bold tracking-tight mb-8">Profile</Text>

        <Animated.View entering={FadeInDown.duration(500).springify()} className="rounded-[22px] p-6 items-center mb-6" style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1 }}>
          <View className="w-20 h-20 rounded-[24px] items-center justify-center mb-4" style={{ backgroundColor: COLORS.primarySubtle }}>
            <Ionicons name="person" size={36} color={COLORS.primary} />
          </View>
          <Text className="text-text text-[20px] font-bold">{user?.full_name || "User"}</Text>
          <Text className="text-text-tertiary text-[15px] mt-1">{user?.email}</Text>
          {user?.skin_type && (
            <View className="px-4 py-1.5 rounded-full mt-3" style={{ backgroundColor: COLORS.primarySubtle }}>
              <Text className="text-primary text-[13px] font-semibold capitalize">{user.skin_type}</Text>
            </View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(500).springify()} className="rounded-[22px] overflow-hidden mb-6" style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1 }}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center px-5 py-4"
              style={{ borderBottomWidth: index < menuItems.length - 1 ? 1 : 0, borderBottomColor: COLORS.border }}
              onPress={() => {
                hapticLight();
              }}
            >
              <View className="w-9 h-9 rounded-[12px] items-center justify-center mr-4" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                <Ionicons name={item.icon as any} size={18} color={COLORS.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-text text-[17px]">{item.label}</Text>
                <Text className="text-text-quaternary text-[13px] mt-0.5">{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textQuaternary} />
            </TouchableOpacity>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500).springify()}>
          <TouchableOpacity
            className="py-4 rounded-[16px] items-center"
            style={{ backgroundColor: COLORS.errorSubtle, borderColor: "rgba(248, 113, 113, 0.1)", borderWidth: 1 }}
            onPress={() => {
              Alert.alert("Sign Out", "Are you sure?", [
                { text: "Cancel", style: "cancel" },
                { text: "Sign Out", style: "destructive", onPress: signOut },
              ]);
            }}
          >
            <Text className="text-error font-semibold text-[17px]">Sign Out</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text className="text-text-quaternary text-center text-[13px] mt-10">SkinMinder v1.0.0</Text>
      </View>
    </ScrollView>
  );
}
