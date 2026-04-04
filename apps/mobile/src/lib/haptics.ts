import * as Haptics from "expo-haptics";

function safeHaptics(fn: () => Promise<void>) {
  try {
    fn().catch(() => {});
  } catch {
    // Haptics not supported on this device — silently ignore
  }
}

export function hapticLight() {
  safeHaptics(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

export function hapticMedium() {
  safeHaptics(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
}

export function hapticHeavy() {
  safeHaptics(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy));
}

export function hapticSuccess() {
  safeHaptics(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
}

export function hapticWarning() {
  safeHaptics(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
}

export function hapticError() {
  safeHaptics(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
}

export function hapticSelection() {
  safeHaptics(() => Haptics.selectionAsync());
}
