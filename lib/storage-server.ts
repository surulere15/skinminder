import { getServiceClient } from './supabase/server';

const SCANS_BUCKET = 'scans';

/**
 * Generates a short-lived signed URL for an image.
 * This is used by the AI pipeline to fetch private images securely.
 * Should be called on the server-side.
 */
export async function getSignedScanUrl(path: string, expiresIn: number = 60): Promise<string> {
  // If it's a mock path, skip Supabase
  if (path.startsWith('mock-path/')) {
    return "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600&auto=format&fit=crop#load-test";
  }

  const supabase = getServiceClient();

  const { data, error } = await supabase.storage
    .from(SCANS_BUCKET)
    .createSignedUrl(path, expiresIn);

  if (error) {
    console.error("Signed URL error:", error);
    throw new Error("Failed to generate secure access token for scan.");
  }

  return data.signedUrl;
}

/**
 * Permanently deletes a scan image from storage.
 * Used to minimize biometric liability after feature extraction.
 */
export async function deleteScan(path: string): Promise<void> {
  if (path.startsWith('mock-path/')) return;

  const supabase = getServiceClient();
  const { error } = await supabase.storage
    .from(SCANS_BUCKET)
    .remove([path]);

  if (error) {
    console.warn(`[Storage] Failed to delete scan at ${path}:`, error.message);
  } else {
    console.log(`[Storage] Successfully purged biometric data at ${path}`);
  }
}
