import { create } from "zustand";
import type { SkinScan, Routine, SkinDna } from "../types";
import { getRoutine, getScanHistory, getSkinDna } from "../lib/api";
import { getCachedScans, getCachedRoutine, getCachedDna, hydrateOfflineCache } from "../lib/offline";

interface ScanState {
  scans: SkinScan[];
  routine: Routine | null;
  dna: SkinDna | null;
  isLoading: boolean;
  isOffline: boolean;
  error: string | null;
  fetchScans: (userId: string) => Promise<void>;
  fetchRoutine: (userId: string) => Promise<void>;
  fetchDna: (userId: string) => Promise<void>;
  addScan: (scan: SkinScan) => void;
  refreshAll: (userId: string) => Promise<void>;
  loadFromCache: () => Promise<void>;
}

export const useScanStore = create<ScanState>((set, get) => ({
  scans: [],
  routine: null,
  dna: null,
  isLoading: false,
  isOffline: false,
  error: null,

  loadFromCache: async () => {
    const [cachedScans, cachedRoutine, cachedDna] = await Promise.all([
      getCachedScans(),
      getCachedRoutine(),
      getCachedDna(),
    ]);

    set({
      scans: cachedScans || [],
      routine: cachedRoutine,
      dna: cachedDna,
      isOffline: !!(cachedScans || cachedRoutine || cachedDna),
    });
  },

  fetchScans: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const scans = await getScanHistory(userId);
      set({ scans, isOffline: false });
      return scans;
    } catch (e: any) {
      set({ error: e.message, isOffline: true });
      await get().loadFromCache();
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchRoutine: async (userId: string) => {
    try {
      const routine = await getRoutine(userId);
      set({ routine, isOffline: false });
      return routine;
    } catch {
      set({ routine: null });
      const cached = await getCachedRoutine();
      if (cached) set({ routine: cached, isOffline: true });
      return null;
    }
  },

  fetchDna: async (userId: string) => {
    try {
      const dna = await getSkinDna(userId);
      set({ dna, isOffline: false });
      return dna;
    } catch {
      set({ dna: null });
      const cached = await getCachedDna();
      if (cached) set({ dna: cached, isOffline: true });
      return null;
    }
  },

  addScan: (scan: SkinScan) => {
    set((state) => {
      const scans = [scan, ...state.scans];
      hydrateOfflineCache(scans, state.routine, state.dna);
      return { scans };
    });
  },

  refreshAll: async (userId: string) => {
    const [scans, routine, dna] = await Promise.all([
      get().fetchScans(userId),
      get().fetchRoutine(userId),
      get().fetchDna(userId),
    ]);

    if (scans) {
      await hydrateOfflineCache(scans, routine, dna);
    }
  },
}));
