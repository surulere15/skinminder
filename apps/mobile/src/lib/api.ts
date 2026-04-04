import { supabase } from "./supabase";
import * as ImageManipulator from "expo-image-manipulator";
import NetInfo from "@react-native-community/netinfo";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://api.skinminder.ai";
const API_TIMEOUT = 30000;
const UPLOAD_TIMEOUT = 60000;

interface NetworkInfo {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: "wifi" | "cellular" | "ethernet" | "none" | "unknown" | null;
}

async function getNetworkInfo(): Promise<NetworkInfo> {
  const state = await NetInfo.fetch();
  return {
    isConnected: state.isConnected ?? false,
    isInternetReachable: state.isInternetReachable,
    type: state.type,
  };
}

interface RNFileObject {
  uri: string;
  name: string;
  type: string;
}

function createTimeoutSignal(timeout: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeout);
  return controller.signal;
}

async function parseError(response: Response): Promise<string> {
  try {
    const body = await response.json();
    return body.error || body.message || body.detail || `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

export async function compressImage(uri: string): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1920 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
}

export async function uploadImage(uri: string, retries = 3): Promise<string> {
  const compressedUri = await compressImage(uri);

  const network = await getNetworkInfo();
  if (network.type === "cellular" && network.isInternetReachable) {
    console.warn("Uploading on cellular network — may be slow and use data.");
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const formData = new FormData();
      const filename = `scan_${Date.now()}.jpg`;

      const file: RNFileObject = {
        uri: compressedUri,
        name: filename,
        type: "image/jpeg",
      };

      formData.append("file", file as any);

      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData,
        signal: createTimeoutSignal(UPLOAD_TIMEOUT),
      });

      if (!response.ok) {
        const message = await parseError(response);
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, 1000 * attempt));
          continue;
        }
        throw new Error(message);
      }

      const data = await response.json();
      return data.url;
    } catch (error: any) {
      if (error.name === "AbortError") {
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, 1000 * attempt));
          continue;
        }
        throw new Error("Upload timed out. Please check your connection and try again.");
      }
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * attempt));
        continue;
      }
      throw error;
    }
  }

  throw new Error("Upload failed after multiple attempts.");
}

export async function analyzeSkin(imageUrl: string, metadata: Record<string, any>, retries = 2): Promise<any> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Session expired. Please sign in again.");
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${API_URL}/api/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          image_url: imageUrl,
          metadata,
        }),
        signal: createTimeoutSignal(API_TIMEOUT),
      });

      if (!response.ok) {
        const message = await parseError(response);
        if (response.status === 401) {
          throw new Error("Session expired. Please sign in again.");
        }
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, 1500 * attempt));
          continue;
        }
        throw new Error(message);
      }

      return response.json();
    } catch (error: any) {
      if (error.name === "AbortError") {
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, 1500 * attempt));
          continue;
        }
        throw new Error("Analysis timed out. The AI is busy — please try again in a moment.");
      }
      if (error.message.includes("Session expired")) throw error;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1500 * attempt));
        continue;
      }
      throw error;
    }
  }

  throw new Error("Analysis failed after multiple attempts.");
}

export async function getRoutine(userId: string) {
  const { data, error } = await supabase
    .from("routine_versions")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error("Failed to load routine. Please try again.");
  }
  return data;
}

export async function getScanHistory(userId: string) {
  const { data, error } = await supabase
    .from("skin_scans")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    throw new Error("Failed to load scan history. Please check your connection.");
  }
  return data;
}

export async function getSkinDna(userId: string) {
  const { data, error } = await supabase
    .from("skin_dna")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error("Failed to load skin DNA profile.");
  }
  return data;
}
