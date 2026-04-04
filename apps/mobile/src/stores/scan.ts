import { create } from "zustand";
import type { SkinScan, Routine, SkinDna } from "../types";
import { getRoutine, getScanHistory, getSkinDna } from "../lib/api";
import { getCachedScans, getCachedRoutine, getCachedDna, hydrateOfflineCache, cacheRoutine, cacheDna } from "../lib/offline";

interface ScanState {
  scans: SkinScan[];
  routine: Routine | null;
  dna: SkinDna | null;
  isLoading: boolean;
  isShowingCachedData: boolean;
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
  isShowingCachedData: false,
  error: null,

  loadFromCache: async () => {
    const [{ data: cachedScans }, cachedRoutine, cachedDna] = await Promise.all([
      getCachedScans(),
      getCachedRoutine(),
      getCachedDna(),
    ]);

    set({
      scans: cachedScans || [],
      routine: cachedRoutine,
      dna: cachedDna,
      isShowingCachedData: !!(cachedScans || cachedRoutine || cachedDna),
    });
  },

  fetchScans: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const scans = await getScanHistory(userId);
      set({ scans, isShowingCachedData: false });
      await import("../lib/offline").then(({ cacheScans }) => cacheScans(scans));
    } catch (e: any) {
      set({ error: e.message, isShowingCachedData: true });
      await get().loadFromCache();
    } finally {
      set({ isLoading: false });
    }
  },

  fetchRoutine: async (userId: string) => {
    try {
      const routine = await getRoutine(userId);
      set({ routine, isShowingCachedData: false });
      if (routine) await cacheRoutine(routine);
    } catch {
      const cached = await getCachedRoutine();
      if (cached) set({ routine: cached, isShowingCachedData: true });
    }
  },

  fetchDna: async (userId: string) => {
    try {
      const dna = await getSkinDna(userId);
      set({ dna, isShowingCachedData: false });
      if (dna) await cacheDna(dna);
    } catch {
      const cached = await getCachedDna();
      if (cached) set({ dna: cached, isShowingCachedData: true });
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
    await Promise.all([
      get().fetchScans(userId),
      get().fetchRoutine(userId),
      get().fetchDna(userId),
    ]);
  },
}));
