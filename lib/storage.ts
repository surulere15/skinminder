import { createClient } from './supabase/client';

/**
 * Storage Layer for Skin Scan Data (Client-Safe)
 * 
 * Enforced privacy by using private storage buckets.
 */

const SCANS_BUCKET = 'scans';

/**
 * Uploads an image to the private scans bucket.
 * Used on the client-side for "Try" flow.
 */
export async function uploadScan(file: File, userId?: string): Promise<string> {
  const supabase = createClient();
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId || 'anonymous'}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${fileName}`;

  // Fallback for development if Supabase envs are missing
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn("Supabase not configured. Returning mock storage path.");
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `mock-path/${fileName}`;
  }

  const { data, error } = await supabase.storage
    .from(SCANS_BUCKET)
    .upload(filePath, file);

  if (error) {
    console.error("Storage upload error:", error);
    throw new Error(error.message || "Failed to upload to private storage.");
  }

  return data.path;
}
