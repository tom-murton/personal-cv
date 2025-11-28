/**
 * Utility functions for optimizing image loading and handling
 */

/**
 * Creates a responsive image URL based on target width
 * Supports various image hosting services with appropriate parameters
 */
export const getResponsiveImageUrl = (
  imageUrl: string,
  width: number = 800
): string => {
  if (!imageUrl) return '';
  
  // If it's a local asset, return as-is
  if (imageUrl.startsWith('/') || imageUrl.startsWith('./')) {
    return imageUrl;
  }
  
  // Handle Unsplash images
  if (imageUrl.includes('unsplash.com')) {
    // Width, quality, and auto format for optimization
    return `${imageUrl}?w=${width}&q=80&auto=format`;
  }
  
  // Handle Cloudinary images
  if (imageUrl.includes('cloudinary.com')) {
    // Extract the base URL without existing transformations
    const baseUrl = imageUrl.split('/upload/')[0] + '/upload/';
    const imagePath = imageUrl.split('/upload/')[1];
    // Apply width, quality, and format optimization
    return `${baseUrl}w_${width},q_auto,f_auto/${imagePath}`;
  }
  
  // Handle LinkedIn images by leaving them as is
  if (imageUrl.includes('linkedin.com')) {
    return imageUrl;
  }
  
  // Default case
  return imageUrl;
};

/**
 * Generates a tiny blurred placeholder image for lazy loading
 * Can be used as the initial src until the full image loads
 */
export const generatePlaceholderImage = (width: number = 16, height: number = 9): string => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3C/svg%3E`;
};

/**
 * Preloads critical images for faster display
 * Should be used sparingly only for the most important above-the-fold images
 */
export const preloadCriticalImage = (imageUrl: string): void => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageUrl;
    document.head.appendChild(link);
  }
};

/**
 * Returns appropriate image loading strategy based on importance
 */
export const getImageLoadingStrategy = (isImportant: boolean): "eager" | "lazy" => {
  return isImportant ? "eager" : "lazy";
};

/**
 * Calculates the best image dimensions based on container size
 * to avoid loading unnecessarily large images
 */
export const calculateOptimalImageDimensions = (
  containerWidth: number,
  aspectRatio: number = 16/9
): { width: number, height: number } => {
  // Use standard breakpoints to determine optimal size
  let optimalWidth: number;
  
  if (containerWidth <= 640) {
    optimalWidth = 640; // sm breakpoint
  } else if (containerWidth <= 768) {
    optimalWidth = 768; // md breakpoint
  } else if (containerWidth <= 1024) {
    optimalWidth = 1024; // lg breakpoint
  } else if (containerWidth <= 1280) {
    optimalWidth = 1280; // xl breakpoint
  } else {
    optimalWidth = 1536; // 2xl breakpoint
  }
  
  // Calculate height based on aspect ratio
  const optimalHeight = Math.round(optimalWidth / aspectRatio);
  
  return { width: optimalWidth, height: optimalHeight };
}; 