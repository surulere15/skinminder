import { useState, useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

export function useAppState() {
  const [appState, setAppState] = useState(AppState.currentState);
  const callbackRef = useRef<((state: AppStateStatus) => void) | null>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      setAppState(nextState);
      callbackRef.current?.(nextState);
    });

    return () => subscription.remove();
  }, []);

  return {
    appState,
    isActive: appState === "active",
    isBackground: appState === "background",
    isInactive: appState === "inactive",
    onChange: (callback: (state: AppStateStatus) => void) => {
      callbackRef.current = callback;
    },
  };
}
