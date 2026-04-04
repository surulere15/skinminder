import { supabase } from "./supabase";

const API_URL = "https://api.skinminder.ai";

export async function uploadImage(uri: string): Promise<string> {
  const formData = new FormData();
  const filename = `scan_${Date.now()}.jpg`;

  formData.append("file", {
    uri,
    name: filename,
    type: "image/jpeg",
  } as any);

  const response = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.url;
}

export async function analyzeSkin(imageUrl: string, metadata: Record<string, any>) {
  const { data: { session } } = await supabase.auth.getSession();

  const response = await fetch(`${API_URL}/api/scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify({
      image_url: imageUrl,
      metadata,
    }),
  });

  if (!response.ok) {
    throw new Error(`Analysis failed: ${response.statusText}`);
  }

  return response.json();
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

  if (error) throw error;
  return data;
}

export async function getScanHistory(userId: string) {
  const { data, error } = await supabase
    .from("skin_scans")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
}

export async function getSkinDna(userId: string) {
  const { data, error } = await supabase
    .from("skin_dna")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}
