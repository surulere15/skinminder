import { createHash } from 'crypto';

/**
 * Perception & Security Hashing
 * 
 * Used to detect duplicate scans and bot-driven spam submissions.
 */
export function generateFaceHash(pixelData: Uint8ClampedArray): string {
    // We hash the raw pixel data of the face region
    // A SHA-256 hash provides a unique fingerprint for that specific capture
    const hash = createHash('sha256');
    hash.update(Buffer.from(pixelData));
    return hash.digest('hex');
}
