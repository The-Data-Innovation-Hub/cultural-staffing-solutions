/**
 * Bunny.net CDN Upload Service
 * Handles uploading files to Bunny.net storage
 */

import axios from 'axios';
import fs from 'fs';

const BUNNY_STORAGE_API_KEY = process.env.BUNNY_STORAGE_API_KEY;
const BUNNY_STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE_NAME;
const BUNNY_STORAGE_URL = process.env.BUNNY_STORAGE_URL || 'https://uk.storage.bunnycdn.com';
const BUNNY_CDN_URL = process.env.BUNNY_CDN_URL;

if (!BUNNY_STORAGE_API_KEY || !BUNNY_STORAGE_ZONE_NAME || !BUNNY_CDN_URL) {
  console.warn('⚠️  Bunny.net credentials not configured. Profile images will be stored locally.');
}

/**
 * Upload a file to Bunny.net storage
 * @param filePath - Local path to the file
 * @param remotePath - Remote path in Bunny storage (e.g., '/profiles/image.jpg')
 * @returns CDN URL of the uploaded file
 */
export async function uploadToBunny(filePath: string, remotePath: string): Promise<string> {
  if (!BUNNY_STORAGE_API_KEY || !BUNNY_STORAGE_ZONE_NAME || !BUNNY_CDN_URL) {
    throw new Error('Bunny.net storage is not configured');
  }

  try {
    // Read file from local filesystem
    const fileBuffer = fs.readFileSync(filePath);

    // Upload to Bunny storage
    const uploadUrl = `${BUNNY_STORAGE_URL}/${BUNNY_STORAGE_ZONE_NAME}${remotePath}`;

    await axios.put(uploadUrl, fileBuffer, {
      headers: {
        'AccessKey': BUNNY_STORAGE_API_KEY,
        'Content-Type': 'application/octet-stream',
      },
    });

    // Return CDN URL
    const cdnUrl = `${BUNNY_CDN_URL}${remotePath}`;
    return cdnUrl;

  } catch (error: any) {
    console.error('Error uploading to Bunny.net:', error.response?.data || error.message);
    throw new Error(`Failed to upload file to Bunny.net: ${error.message}`);
  }
}

/**
 * Delete a file from Bunny.net storage
 * @param remotePath - Remote path in Bunny storage (e.g., '/profiles/image.jpg')
 */
export async function deleteFromBunny(remotePath: string): Promise<void> {
  if (!BUNNY_STORAGE_API_KEY || !BUNNY_STORAGE_ZONE_NAME) {
    return; // Silently skip if not configured
  }

  try {
    const deleteUrl = `${BUNNY_STORAGE_URL}/${BUNNY_STORAGE_ZONE_NAME}${remotePath}`;

    await axios.delete(deleteUrl, {
      headers: {
        'AccessKey': BUNNY_STORAGE_API_KEY,
      },
    });

  } catch (error: any) {
    // Don't throw error on delete failures - just log it
    console.error('Error deleting from Bunny.net:', error.response?.data || error.message);
  }
}

/**
 * Extract remote path from a CDN URL
 * @param cdnUrl - Full CDN URL (e.g., 'https://example.b-cdn.net/profiles/image.jpg')
 * @returns Remote path (e.g., '/profiles/image.jpg')
 */
export function extractRemotePath(cdnUrl: string): string | null {
  if (!BUNNY_CDN_URL) return null;

  if (cdnUrl.startsWith(BUNNY_CDN_URL)) {
    return cdnUrl.substring(BUNNY_CDN_URL.length);
  }

  return null;
}
