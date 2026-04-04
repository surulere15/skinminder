import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SkinScan, Routine, SkinDna } from "../types";

const CACHE_KEYS = {
  SCANS: "sm_cache_scans",
  ROUTINE: "sm_cache_routine",
  DNA: "sm_cache_dna",
  LAST_SYNC: "sm_cache_last_sync",
};

const SCANS_TTL = 24 * 60 * 60 * 1000; // 24 hours
const ENTITY_TTL = 72 * 60 * 60 * 1000; // 72 hours

export async function cacheScans(scans: SkinScan[]) {
  try {
    await AsyncStorage.setItem(CACHE_KEYS.SCANS, JSON.stringify(scans));
    await AsyncStorage.setItem(CACHE_KEYS.LAST_SYNC, Date.now().toString());
  } catch (e) {
    console.warn("Failed to cache scans:", e);
  }
}

export async function getCachedScans(): Promise<{ data: SkinScan[] | null; isStale: boolean }> {
  try {
    const data = await AsyncStorage.getItem(CACHE_KEYS.SCANS);
    const lastSync = await AsyncStorage.getItem(CACHE_KEYS.LAST_SYNC);

    if (!data || !lastSync) return { data: null, isStale: false };

    const age = Date.now() - parseInt(lastSync, 10);
    const isStale = age > SCANS_TTL;

    if (isStale) {
      return { data: JSON.parse(data), isStale: true };
    }

    return { data: JSON.parse(data), isStale: false };
  } catch {
    return { data: null, isStale: false };
  }
}

export async function cacheRoutine(routine: Routine) {
  try {
    await AsyncStorage.setItem(CACHE_KEYS.ROUTINE, JSON.stringify({
      data: routine,
      cachedAt: Date.now(),
    }));
  } catch (e) {
    console.warn("Failed to cache routine:", e);
  }
}

export async function getCachedRoutine(): Promise<Routine | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.ROUTINE);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const age = Date.now() - (parsed.cachedAt || 0);
    if (age > ENTITY_TTL) {
      await AsyncStorage.removeItem(CACHE_KEYS.ROUTINE);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

export async function cacheDna(dna: SkinDna) {
  try {
    await AsyncStorage.setItem(CACHE_KEYS.DNA, JSON.stringify({
      data: dna,
      cachedAt: Date.now(),
    }));
  } catch (e) {
    console.warn("Failed to cache DNA:", e);
  }
}

export async function getCachedDna(): Promise<SkinDna | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.DNA);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const age = Date.now() - (parsed.cachedAt || 0);
    if (age > ENTITY_TTL) {
      await AsyncStorage.removeItem(CACHE_KEYS.DNA);
      return null;
    }
    return parsed.data;
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
