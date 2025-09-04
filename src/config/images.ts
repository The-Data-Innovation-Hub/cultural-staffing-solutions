import { isBunnyConfigured, BunnyConfig, getOptimizedImageUrl } from '@/lib/bunny';

// Image configuration with Bunny CDN and fallback URLs
export const IMAGES = {
  // Hero Section
  hero: {
    background: isBunnyConfigured() 
      ? `${BunnyConfig.cdnUrl}/images/hero/healthcare-professionals.jpg`
      : 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1920&h=1080&fit=crop',
  },

  // Features
  features: {
    training: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/features/training.jpg`
      : 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
    
    cultural: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/features/cultural-integration.jpg`
      : 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop',
    
    aiLearning: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/features/ai-learning.jpg`
      : 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=400&h=300&fit=crop',
    
    certified: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/features/certified-programs.jpg`
      : 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop',
    
    support: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/features/expert-support.jpg`
      : 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop',
    
    compliance: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/features/compliance.jpg`
      : 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&h=300&fit=crop',
  },

  // Services
  services: {
    healthcare: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/services/healthcare-training.jpg`
      : 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop',
    
    cultural: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/services/cultural-orientation.jpg`
      : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
    
    recruitment: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/services/recruitment.jpg`
      : 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=800&h=600&fit=crop',
  },

  // Testimonials
  testimonials: {
    maria: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/testimonials/maria-santos.jpg`
      : 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop',
    
    john: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/testimonials/john-kumar.jpg`
      : 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=100&h=100&fit=crop',
    
    sarah: isBunnyConfigured()
      ? `${BunnyConfig.cdnUrl}/images/testimonials/sarah-obrien.jpg`
      : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
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