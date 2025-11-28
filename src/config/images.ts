import { isBunnyConfigured, BunnyConfig, getOptimizedImageUrl } from '@/lib/bunny';

// Image configuration with Bunny CDN and fallback URLs
export const IMAGES = {
  // Hero Section
  hero: {
    background: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/hero/healthcare-professionals.jpg`
      : '/images/hero/healthcare-professionals.jpg',
  },

  // Features
  features: {
    training: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/features/training.jpg`
      : '/images/features/training.jpg',

    cultural: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/features/cultural-integration.jpg`
      : '/images/features/cultural-integration.jpg',

    aiLearning: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/features/ai-learning.jpg`
      : '/images/features/ai-learning.jpg',

    certified: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/features/certified-programs.jpg`
      : '/images/features/certified-programs.jpg',

    support: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/features/expert-support.jpg`
      : '/images/features/expert-support.jpg',

    compliance: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/features/compliance.jpg`
      : '/images/features/compliance.jpg',
  },

  // Services
  services: {
    healthcare: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/services/healthcare-training.jpg`
      : '/images/services/healthcare-training.jpg',

    cultural: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/services/cultural-orientation.jpg`
      : '/images/services/cultural-orientation.jpg',

    recruitment: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/services/recruitment.jpg`
      : '/images/services/recruitment.jpg',

    csmart: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/services/csmart.jpg`
      : '/images/services/csmart.jpg',

    clinifyAi: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/services/clinify-ai.jpg`
      : '/images/services/clinify-ai.jpg',

    elearning: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/services/elearning.jpg`
      : '/images/services/elearning.jpg',
  },

  // Testimonials
  testimonials: {
    maria: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/testimonials/maria-santos.jpg`
      : '/images/testimonials/maria-santos.jpg',

    john: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/testimonials/john-kumar.jpg`
      : '/images/testimonials/john-kumar.jpg',

    sarah: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/testimonials/sarah-obrien.jpg`
      : '/images/testimonials/sarah-obrien.jpg',
  },

  // Default placeholders
  placeholders: {
    avatar: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/placeholders/avatar.svg`
      : '/placeholder-avatar.svg',
    
    course: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/placeholders/course.jpg`
      : '/placeholder-course.jpg',
    
    certificate: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/placeholders/certificate.jpg`
      : '/placeholder-certificate.jpg',
  },

  // Logos
  logos: {
    csmart: '/images/logos/csmart-logo.svg',
    clinifyAi: '/images/logos/clinify-ai-logo.svg',
    culturalStaffing: '/cultural-staffing-logo.png',
  },
};

/**
 * Get an optimized image URL with Bunny CDN transformations
 * Falls back to original URL if Bunny is not configured
 */
export function getImage(
  path: keyof typeof IMAGES | string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  }
): string {
  // If it's a direct path string
  if (typeof path === 'string' && !IMAGES[path as keyof typeof IMAGES]) {
    return isBunnyConfigured() ? getOptimizedImageUrl(path, options) : path;
  }

  // Get the image URL from the configuration
  const pathParts = path.split('.');
  let imageUrl: any = IMAGES;
  
  for (const part of pathParts) {
    imageUrl = imageUrl[part];
    if (!imageUrl) break;
  }

  if (typeof imageUrl !== 'string') {
    console.warn(`Image path ${path} not found in configuration`);
    return '';
  }

  // Apply optimizations if using Bunny CDN
  return isBunnyConfigured() ? getOptimizedImageUrl(imageUrl, options) : imageUrl;
}

/**
 * Preload images for better performance
 */
export function preloadImages(images: string[]) {
  if (typeof window === 'undefined') return;

  images.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

/**
 * Get responsive image srcset for different screen sizes
 */
export function getResponsiveImageSet(
  path: string,
  sizes: { width: number; suffix?: string }[]
): string {
  if (!isBunnyConfigured()) return path;

  return sizes
    .map(size => {
      const url = getOptimizedImageUrl(path, { width: size.width, quality: 85 });
      return size.suffix ? `${url} ${size.suffix}` : url;
    })
    .join(', ');
}