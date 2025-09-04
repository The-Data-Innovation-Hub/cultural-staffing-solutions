import axios from 'axios';

// Bunny.net configuration from environment variables
const BUNNY_CONFIG = {
  storageApiKey: import.meta.env.VITE_BUNNY_STORAGE_API_KEY || '',
  storageZoneName: import.meta.env.VITE_BUNNY_STORAGE_ZONE_NAME || 'cultural-staffing',
  cdnUrl: import.meta.env.VITE_BUNNY_CDN_URL || 'https://cultural-staffing.b-cdn.net',
  storageUrl: import.meta.env.VITE_BUNNY_STORAGE_URL || 'https://storage.bunnycdn.com',
};

// Check if Bunny.net is configured
export const isBunnyConfigured = () => {
  return BUNNY_CONFIG.storageApiKey && BUNNY_CONFIG.storageApiKey !== 'your-storage-api-key-here';
};

/**
 * Upload a file to Bunny.net Storage
 * @param file - The file to upload
 * @param path - The path in storage (e.g., 'images/profile/user123.jpg')
 * @returns The CDN URL of the uploaded file
 */
export async function uploadToBunny(file: File, path?: string): Promise<string> {
  if (!isBunnyConfigured()) {
    console.warn('Bunny.net is not configured. Using local storage fallback.');
    return URL.createObjectURL(file);
  }

  try {
    const fileName = path || `uploads/${Date.now()}-${file.name}`;
    const uploadUrl = `${BUNNY_CONFIG.storageUrl}/${BUNNY_CONFIG.storageZoneName}/${fileName}`;

    const response = await axios.put(uploadUrl, file, {
      headers: {
        'AccessKey': BUNNY_CONFIG.storageApiKey,
        'Content-Type': file.type,
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    if (response.status === 201 || response.status === 200) {
      return `${BUNNY_CONFIG.cdnUrl}/${fileName}`;
    } else {
      throw new Error(`Upload failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error uploading to Bunny.net:', error);
    throw error;
  }
}

/**
 * Delete a file from Bunny.net Storage
 * @param fileUrl - The CDN URL or file path
 */
export async function deleteFromBunny(fileUrl: string): Promise<void> {
  if (!isBunnyConfigured()) {
    console.warn('Bunny.net is not configured.');
    return;
  }

  try {
    // Extract the file path from the CDN URL
    const filePath = fileUrl.replace(BUNNY_CONFIG.cdnUrl + '/', '');
    const deleteUrl = `${BUNNY_CONFIG.storageUrl}/${BUNNY_CONFIG.storageZoneName}/${filePath}`;

    await axios.delete(deleteUrl, {
      headers: {
        'AccessKey': BUNNY_CONFIG.storageApiKey,
      },
    });
  } catch (error) {
    console.error('Error deleting from Bunny.net:', error);
    throw error;
  }
}

/**
 * List files in a directory on Bunny.net Storage
 * @param directory - The directory path (e.g., 'images/profile/')
 */
export async function listBunnyFiles(directory: string = '/'): Promise<any[]> {
  if (!isBunnyConfigured()) {
    console.warn('Bunny.net is not configured.');
    return [];
  }

  try {
    const listUrl = `${BUNNY_CONFIG.storageUrl}/${BUNNY_CONFIG.storageZoneName}/${directory}/`;
    
    const response = await axios.get(listUrl, {
      headers: {
        'AccessKey': BUNNY_CONFIG.storageApiKey,
        'Accept': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error listing Bunny.net files:', error);
    throw error;
  }
}

/**
 * Generate a unique file path for uploads
 * @param category - The category of file (e.g., 'profile', 'course', 'certificate')
 * @param fileName - The original file name
 * @param userId - Optional user ID for user-specific files
 */
export function generateBunnyPath(
  category: 'profile' | 'course' | 'certificate' | 'assessment' | 'general',
  fileName: string,
  userId?: string
): string {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  if (userId) {
    return `${category}/${userId}/${timestamp}-${sanitizedFileName}`;
  }
  
  return `${category}/${timestamp}-${sanitizedFileName}`;
}

/**
 * Get optimized image URL with transformations
 * @param imageUrl - The original CDN URL
 * @param options - Transformation options
 */
export function getOptimizedImageUrl(
  imageUrl: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  }
): string {
  if (!imageUrl.includes(BUNNY_CONFIG.cdnUrl) || !isBunnyConfigured()) {
    return imageUrl; // Return original URL if not a Bunny CDN URL
  }

  // Bunny.net Image Optimization API
  // Example: https://cdn.example.com/image.jpg?width=300&height=200&quality=85
  const params = new URLSearchParams();
  
  if (options?.width) params.append('width', options.width.toString());
  if (options?.height) params.append('height', options.height.toString());
  if (options?.quality) params.append('quality', options.quality.toString());
  if (options?.format) params.append('format', options.format);

  const queryString = params.toString();
  return queryString ? `${imageUrl}?${queryString}` : imageUrl;
}

/**
 * Upload multiple files to Bunny.net
 * @param files - Array of files to upload
 * @param category - The category for organizing files
 * @returns Array of CDN URLs
 */
export async function uploadMultipleToBunny(
  files: File[],
  category: 'profile' | 'course' | 'certificate' | 'assessment' | 'general'
): Promise<string[]> {
  const uploadPromises = files.map((file) => {
    const path = generateBunnyPath(category, file.name);
    return uploadToBunny(file, path);
  });

  return Promise.all(uploadPromises);
}

/**
 * Check if a file exists on Bunny.net
 * @param filePath - The file path to check
 */
export async function checkFileExists(filePath: string): Promise<boolean> {
  if (!isBunnyConfigured()) {
    return false;
  }

  try {
    const url = `${BUNNY_CONFIG.storageUrl}/${BUNNY_CONFIG.storageZoneName}/${filePath}`;
    
    const response = await axios.head(url, {
      headers: {
        'AccessKey': BUNNY_CONFIG.storageApiKey,
      },
      validateStatus: (status) => status < 500,
    });

    return response.status === 200;
  } catch (error) {
    return false;
  }
}

// Export configuration for use in other components
export const BunnyConfig = {
  cdnUrl: BUNNY_CONFIG.cdnUrl,
  isConfigured: isBunnyConfigured(),
};