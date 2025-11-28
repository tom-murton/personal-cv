import { useState, useEffect } from 'react';

/**
 * Hook to detect if the user has requested reduced motion in their OS settings
 * Used to respect user preferences for animations
 * @returns {boolean} Whether reduced motion is preferred
 */
function usePrefersReducedMotion(): boolean {
  // Default to false if SSR or if query not supported
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Media query to detect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Update value when preference changes
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };
    
    // Add event listener for changes
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up event listener
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

export default usePrefersReducedMotion; 