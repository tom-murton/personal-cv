import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getResponsiveImageUrl, generatePlaceholderImage } from "@/utils/imageUtils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
  loading = "lazy",
  priority = false,
  objectFit = "cover"
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(generatePlaceholderImage());
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Use the IntersectionObserver API for more efficient lazy loading
  useEffect(() => {
    if (!src) return;
    
    // If image is high priority or loading is eager, load immediately
    if (priority || loading === "eager") {
      const optimizedSrc = getResponsiveImageUrl(src, width || 800);
      setImageSrc(optimizedSrc);
      return;
    }
    
    // Otherwise use intersection observer for true lazy loading
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const optimizedSrc = getResponsiveImageUrl(src, width || 800);
        setImageSrc(optimizedSrc);
        // Disconnect once we've started loading the image
        observer.disconnect();
      }
    }, {
      rootMargin: "200px", // Start loading when within 200px of viewport
      threshold: 0.01
    });
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [src, width, priority, loading]);
  
  // Handle image load success
  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  
  // Handle image load error
  const handleImageError = () => {
    setHasError(true);
    // Replace with a generic fallback image if available
    setImageSrc('/placeholder-image.png');
  };
  
  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      style={{ 
        aspectRatio: width && height ? `${width}/${height}` : 'auto',
      }}
    >
      {/* Placeholder/loading state */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-muted/20 animate-pulse" />
      )}
      
      {/* Image with animation when loaded */}
      <motion.img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`w-full h-full object-${objectFit} transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Error state fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20 text-muted-foreground">
          <span className="text-sm">Image failed to load</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage; 