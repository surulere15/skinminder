import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SkinScan, Routine, SkinDna } from "../types";

const CACHE_KEYS = {
  SCANS: "sm_cache_scans",
  ROUTINE: "sm_cache_routine",
  DNA: "sm_cache_dna",
  LAST_SYNC: "sm_cache_last_sync",
};

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function cacheScans(scans: SkinScan[]) {
  try {
    await AsyncStorage.setItem(CACHE_KEYS.SCANS, JSON.stringify(scans));
    await AsyncStorage.setItem(CACHE_KEYS.LAST_SYNC, Date.now().toString());
  } catch (e) {
    console.warn("Failed to cache scans:", e);
  }
}

export async function getCachedScans(): Promise<SkinScan[] | null> {
  try {
    const data = await AsyncStorage.getItem(CACHE_KEYS.SCANS);
    const lastSync = await AsyncStorage.getItem(CACHE_KEYS.LAST_SYNC);

    if (!data || !lastSync) return null;

    const age = Date.now() - parseInt(lastSync, 10);
    if (age > CACHE_TTL) {
      await AsyncStorage.removeItem(CACHE_KEYS.SCANS);
      return null;
    }

    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function cacheRoutine(routine: Routine) {
  try {
    await AsyncStorage.setItem(CACHE_KEYS.ROUTINE, JSON.stringify(routine));
  } catch (e) {
    console.warn("Failed to cache routine:", e);
  }
}

export async function getCachedRoutine(): Promise<Routine | null> {
  try {
    const data = await AsyncStorage.getItem(CACHE_KEYS.ROUTINE);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function cacheDna(dna: SkinDna) {
  try {
    await AsyncStorage.setItem(CACHE_KEYS.DNA, JSON.stringify(dna));
  } catch (e) {
    console.warn("Failed to cache DNA:", e);
  }
}

export async function getCachedDna(): Promise<SkinDna | null> {
  try {
    const data = await AsyncStorage.getItem(CACHE_KEYS.DNA);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function hydrateOfflineCache(scans: SkinScan[], routine: Routine | null, dna: SkinDna | null) {
  await Promise.all([
    cacheScans(scans),
    routine && cacheRoutine(routine),
    dna && cacheDna(dna),
  ]);
}

export async function clearOfflineCache() {
  await Promise.all(
    Object.values(CACHE_KEYS).map((key) => AsyncStorage.removeItem(key))
  );
}
