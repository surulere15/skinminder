import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "skinminder_onboarding_complete";

interface OnboardingState {
  isComplete: boolean;
  isLoading: boolean;
  currentStep: number;
  skinType: string | null;
  concerns: string[];
  ageRange: string | null;
  gender: string | null;
  climate: string | null;
  setStep: (step: number) => void;
  setSkinType: (type: string) => void;
  toggleConcern: (concern: string) => void;
  setAgeRange: (range: string) => void;
  setGender: (gender: string) => void;
  setClimate: (climate: string) => void;
  complete: () => Promise<void>;
  reset: () => Promise<void>;
  checkStatus: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  isComplete: false,
  isLoading: false,
  currentStep: 0,
  skinType: null,
  concerns: [],
  ageRange: null,
  gender: null,
  climate: null,

  setStep: (step) => set({ currentStep: step }),

  setSkinType: (type) => set({ skinType: type }),

  toggleConcern: (concern) =>
    set((state) => {
      const concerns = state.concerns.includes(concern)
        ? state.concerns.filter((c) => c !== concern)
        : [...state.concerns, concern];
      return { concerns };
    }),

  setAgeRange: (range) => set({ ageRange: range }),

  setGender: (gender) => set({ gender }),

  setClimate: (climate) => set({ climate }),

  complete: async () => {
    set({ isLoading: true });
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      set({ isComplete: true });
    } finally {
      set({ isLoading: false });
    }
  },

  reset: async () => {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
    set({
      isComplete: false,
      currentStep: 0,
      skinType: null,
      concerns: [],
      ageRange: null,
      gender: null,
      climate: null,
    });
  },

  checkStatus: async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      set({ isComplete: value === "true" });
    } catch {
      set({ isComplete: false });
    }
  },
}));
