import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { supabase } from "../lib/supabase";

let isInitialized = false;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function initNotifications() {
  if (isInitialized) return;
  isInitialized = true;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#c9a96e",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return null;
    }

    try {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      await registerPushToken(token);
      return token;
    } catch (error) {
      console.warn("Push notification setup failed:", error);
    }
  }
}

async function registerPushToken(token: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("push_subscriptions").insert({
      user_id: user.id,
      token,
      platform: Platform.OS,
    });

    if (error) {
      console.warn("Failed to register push token:", error);
    }
  } catch (error) {
    console.warn("Error registering push token:", error);
  }
}

export async function scheduleReminder(title: string, body: string, seconds: number) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data: { type: "routine_reminder" } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds, repeats: false },
  });
}

export async function scheduleDailyRoutine(time: { hour: number; minute: number }) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time for your skincare routine",
      body: "Open SkinMinder to follow your personalized steps.",
      data: { type: "daily_routine" },
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.WEEKLY, hour: time.hour, minute: time.minute, weekday: undefined as any },
  });
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
