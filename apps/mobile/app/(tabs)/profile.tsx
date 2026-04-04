import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../src/stores/auth";
import * as LocalAuthentication from "expo-local-authentication";

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();

  const handleBiometric = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (hasHardware) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access SkinMinder",
      });
      if (!result.success) {
        Alert.alert("Authentication failed");
      }
    }
  };

  const menuItems = [
    { icon: "person-outline" as const, label: "Edit Profile", action: () => {} },
    { icon: "notifications-outline" as const, label: "Notifications", action: () => {} },
    { icon: "shield-checkmark-outline" as const, label: "Privacy & Security", action: handleBiometric },
    { icon: "cloud-upload-outline" as const, label: "Data & Storage", action: () => {} },
    { icon: "help-circle-outline" as const, label: "Help & Support", action: () => {} },
    { icon: "information-circle-outline" as const, label: "About", action: () => {} },
  ];

  return (
    <ScrollView className="flex-1 bg-surface">
      <View className="px-6 pt-14 pb-6">
        <Text className="text-white text-2xl font-bold mb-6">Profile</Text>

        <View className="bg-surface-card rounded-2xl p-5 mb-6 border border-surface-border items-center">
          <View className="w-20 h-20 rounded-full bg-primary-500/20 items-center justify-center mb-3">
            <Ionicons name="person" size={36} color="#a18b6f" />
          </View>
          <Text className="text-white text-xl font-bold">{user?.full_name || "User"}</Text>
          <Text className="text-gray-500 mt-1">{user?.email}</Text>
          {user?.skin_type && (
            <View className="bg-primary-500/20 rounded-full px-4 py-1 mt-3">
              <Text className="text-primary-500 text-sm">{user.skin_type}</Text>
            </View>
          )}
        </View>

        <View className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden mb-6">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center px-5 py-4 border-b border-surface-border last:border-b-0"
              onPress={item.action}
            >
              <Ionicons name={item.icon} size={22} color="#a18b6f" />
              <Text className="text-white ml-4 flex-1">{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          className="bg-surface-card border border-red-500/30 rounded-xl py-4 items-center"
          onPress={() => {
            Alert.alert("Sign Out", "Are you sure?", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Sign Out",
                style: "destructive",
                onPress: signOut,
              },
            ]);
          }}
        >
          <Text className="text-red-400 font-semibold">Sign Out</Text>
        </TouchableOpacity>

        <Text className="text-gray-600 text-center text-xs mt-8">
          SkinMinder v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}
