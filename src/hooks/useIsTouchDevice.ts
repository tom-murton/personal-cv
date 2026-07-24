import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current device is a touch device
 * Used to adapt hover animations and interactions for touch interfaces
 * @returns {boolean} Whether the current device is a touch device
 */
function useIsTouchDevice(): boolean {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  useEffect(() => {
    const detectTouch = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as Navigator & { msMaxTouchPoints?: number }).msMaxTouchPoints! > 0
      );
    };
    
    setIsTouchDevice(detectTouch());
    
    // No need for a listener as this usually doesn't change during a session
  }, []);
  
  return isTouchDevice;
}

export default useIsTouchDevice;
