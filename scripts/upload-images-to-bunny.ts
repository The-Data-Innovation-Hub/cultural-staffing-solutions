import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

// Load environment variables
config();

const BUNNY_CONFIG = {
  storageApiKey: process.env.VITE_BUNNY_STORAGE_API_KEY || '',
  storageZoneName: process.env.VITE_BUNNY_STORAGE_ZONE_NAME || 'cultural-staffing-solutions',
  storageUrl: process.env.VITE_BUNNY_STORAGE_URL || 'https://uk.storage.bunnycdn.com',
  cdnUrl: process.env.VITE_BUNNY_CDN_URL || 'https://cultural-staffing-solutions.b-cdn.net',
};

// Required images mapping
const REQUIRED_IMAGES = {
  'images/hero/healthcare-professionals.jpg': 'Hero background image',
  'images/features/training.jpg': 'Feature: Comprehensive Training',
  'images/features/cultural-integration.jpg': 'Feature: Cultural Integration',
  'images/features/ai-learning.jpg': 'Feature: AI-Powered Learning',
  'images/features/certified-programs.jpg': 'Feature: Certified Programs',
  'images/features/expert-support.jpg': 'Feature: Expert Support',
  'images/features/compliance.jpg': 'Feature: Compliance Assured',
  'images/services/healthcare-training.jpg': 'Service: Healthcare Professional Training',
  'images/services/cultural-orientation.jpg': 'Service: Cultural Orientation Program',
  'images/services/recruitment.jpg': 'Service: Recruitment & Placement',
  'images/testimonials/maria-santos.jpg': 'Testimonial: Maria Santos avatar',
  'images/testimonials/john-kumar.jpg': 'Testimonial: John Kumar avatar',
  'images/testimonials/sarah-obrien.jpg': 'Testimonial: Sarah O\'Brien avatar',
};

/**
 * Upload a file to Bunny CDN
 */
async function uploadFile(localPath: string, remotePath: string): Promise<string> {
  try {
    if (!fs.existsSync(localPath)) {
      throw new Error(`File not found: ${localPath}`);
    }

    const fileBuffer = fs.readFileSync(localPath);
    const uploadUrl = `${BUNNY_CONFIG.storageUrl}/${BUNNY_CONFIG.storageZoneName}/${remotePath}`;

    console.log(`Uploading ${localPath} to ${remotePath}...`);

    const response = await axios.put(uploadUrl, fileBuffer, {
      headers: {
        'AccessKey': BUNNY_CONFIG.storageApiKey,
        'Content-Type': getContentType(localPath),
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    if (response.status === 201 || response.status === 200) {
      const cdnUrl = `${BUNNY_CONFIG.cdnUrl}/${remotePath}`;
      console.log(`✓ Successfully uploaded to ${cdnUrl}`);
      return cdnUrl;
    } else {
      throw new Error(`Upload failed with status: ${response.status}`);
    }
  } catch (error: any) {
    console.error(`✗ Error uploading ${localPath}:`, error.message);
    throw error;
  }
}

/**
 * Get content type based on file extension
 */
function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  };
  return contentTypes[ext] || 'application/octet-stream';
}

/**
 * Check if file exists on Bunny CDN
 */
async function checkFileExists(remotePath: string): Promise<boolean> {
  try {
    const url = `${BUNNY_CONFIG.storageUrl}/${BUNNY_CONFIG.storageZoneName}/${remotePath}`;
    const response = await axios.head(url, {
      headers: {
        'AccessKey': BUNNY_CONFIG.storageApiKey,
      },
      validateStatus: (status) => status < 500,
    });
    return response.status === 200;
  } catch {
    return false;
  }
}

/**
 * Main upload function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Bunny CDN Image Upload Utility');
  console.log('='.repeat(60));
  console.log('');

  if (!BUNNY_CONFIG.storageApiKey) {
    console.error('Error: VITE_BUNNY_STORAGE_API_KEY is not configured in .env');
    process.exit(1);
  }

  console.log('Configuration:');
  console.log(`Storage Zone: ${BUNNY_CONFIG.storageZoneName}`);
  console.log(`CDN URL: ${BUNNY_CONFIG.cdnUrl}`);
  console.log('');

  console.log('Required Images:');
  console.log('='.repeat(60));
  Object.entries(REQUIRED_IMAGES).forEach(([path, description]) => {
    console.log(`- ${path}`);
    console.log(`  ${description}`);
  });
  console.log('');

  // Check which images already exist
  console.log('Checking existing images on CDN...');
  const existingImages: string[] = [];
  for (const remotePath of Object.keys(REQUIRED_IMAGES)) {
    const exists = await checkFileExists(remotePath);
    if (exists) {
      existingImages.push(remotePath);
      console.log(`✓ ${remotePath} - Already exists`);
    } else {
      console.log(`✗ ${remotePath} - Missing`);
    }
  }
  console.log('');

  if (existingImages.length === Object.keys(REQUIRED_IMAGES).length) {
    console.log('✓ All images are already uploaded!');
  } else {
    console.log(`${Object.keys(REQUIRED_IMAGES).length - existingImages.length} images need to be uploaded.`);
    console.log('');
    console.log('To upload images:');
    console.log('1. Place your images in a local folder');
    console.log('2. Run: ts-node scripts/upload-images-to-bunny.ts <local-folder-path>');
  }

  // If a folder path is provided, upload images
  const localFolder = process.argv[2];
  if (localFolder) {
    console.log('');
    console.log('='.repeat(60));
    console.log(`Uploading images from: ${localFolder}`);
    console.log('='.repeat(60));
    console.log('');

    let uploadedCount = 0;
    for (const [remotePath, description] of Object.entries(REQUIRED_IMAGES)) {
      const fileName = path.basename(remotePath);
      const localPath = path.join(localFolder, fileName);

      if (fs.existsSync(localPath)) {
        try {
          await uploadFile(localPath, remotePath);
          uploadedCount++;
        } catch (error) {
          console.error(`Failed to upload ${localPath}`);
        }
      } else {
        console.log(`⚠ Skipping ${fileName} - File not found in local folder`);
      }
    }

    console.log('');
    console.log('='.repeat(60));
    console.log(`Upload complete! ${uploadedCount} images uploaded.`);
    console.log('='.repeat(60));
  }
}

main().catch(console.error);
