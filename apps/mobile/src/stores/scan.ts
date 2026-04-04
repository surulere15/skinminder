import { create } from "zustand";
import type { SkinScan, Routine, SkinDna } from "../types";
import { getRoutine, getScanHistory, getSkinDna } from "../lib/api";

interface ScanState {
  scans: SkinScan[];
  routine: Routine | null;
  dna: SkinDna | null;
  isLoading: boolean;
  error: string | null;
  fetchScans: (userId: string) => Promise<void>;
  fetchRoutine: (userId: string) => Promise<void>;
  fetchDna: (userId: string) => Promise<void>;
  addScan: (scan: SkinScan) => void;
  refreshAll: (userId: string) => Promise<void>;
}

export const useScanStore = create<ScanState>((set, get) => ({
  scans: [],
  routine: null,
  dna: null,
  isLoading: false,
  error: null,

  fetchScans: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const scans = await getScanHistory(userId);
      set({ scans });
    } catch (e: any) {
      set({ error: e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchRoutine: async (userId: string) => {
    try {
      const routine = await getRoutine(userId);
      set({ routine });
    } catch {
      set({ routine: null });
    }
  },

  fetchDna: async (userId: string) => {
    try {
      const dna = await getSkinDna(userId);
      set({ dna });
    } catch {
      set({ dna: null });
    }
  },

  addScan: (scan: SkinScan) => {
    set((state) => ({ scans: [scan, ...state.scans] }));
  },

  refreshAll: async (userId: string) => {
    await Promise.all([
      get().fetchScans(userId),
      get().fetchRoutine(userId),
      get().fetchDna(userId),
    ]);
  },
}));
