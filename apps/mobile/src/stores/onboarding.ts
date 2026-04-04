import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "skinminder_onboarding_data";

interface OnboardingData {
  isComplete: boolean;
  currentStep: number;
  skinType: string | null;
  concerns: string[];
  ageRange: string | null;
  gender: string | null;
  climate: string | null;
}

const defaultState: OnboardingData = {
  isComplete: false,
  currentStep: 0,
  skinType: null,
  concerns: [],
  ageRange: null,
  gender: null,
  climate: null,
};

interface OnboardingActions {
  setStep: (step: number) => void;
  setSkinType: (type: string) => void;
  toggleConcern: (concern: string) => void;
  setAgeRange: (range: string) => void;
  setGender: (gender: string) => void;
  setClimate: (climate: string) => void;
  complete: () => Promise<boolean>;
  reset: () => Promise<void>;
  checkStatus: () => Promise<void>;
}

type OnboardingState = OnboardingData & OnboardingActions;

async function persistState(state: OnboardingData) {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Failed to persist onboarding state:", e);
  }
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...defaultState,

  setStep: (step) => {
    const next = { ...get(), currentStep: step };
    set(next);
    persistState(next);
  },

  setSkinType: (type) => {
    const next = { ...get(), skinType: type };
    set(next);
    persistState(next);
  },

  toggleConcern: (concern) => {
    const concerns = get().concerns.includes(concern)
      ? get().concerns.filter((c) => c !== concern)
      : [...get().concerns, concern];
    const next = { ...get(), concerns };
    set(next);
    persistState(next);
  },

  setAgeRange: (range) => {
    const next = { ...get(), ageRange: range };
    set(next);
    persistState(next);
  },

  setGender: (gender) => {
    const next = { ...get(), gender };
    set(next);
    persistState(next);
  },

  setClimate: (climate) => {
    const next = { ...get(), climate };
    set(next);
    persistState(next);
  },

  complete: async (): Promise<boolean> => {
    const state = get();
    if (!state.skinType || state.concerns.length === 0 || !state.ageRange || !state.climate) {
      return false;
    }
    const next = { ...state, isComplete: true };
    set(next);
    await persistState(next);
    return true;
  },

  reset: async () => {
    set(defaultState);
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
    } catch {
      // ignore
    }
  },

  checkStatus: async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (value) {
        const parsed = JSON.parse(value) as OnboardingData;
        set({ ...defaultState, ...parsed });
      } else {
        set(defaultState);
      }
    } catch {
      set(defaultState);
    }
  },
}));
