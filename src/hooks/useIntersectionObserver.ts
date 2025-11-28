import { useState, useEffect, useRef, RefObject } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

/**
 * Custom hook that observes when an element enters the viewport
 * @param {Object} options - Intersection observer options
 * @param {number} options.threshold - The percentage of the element that needs to be visible to trigger (0-1)
 * @param {string} options.rootMargin - Margin around the root element
 * @param {boolean} options.freezeOnceVisible - Whether to stop observing once the element is visible
 * @returns {[RefObject<HTMLElement>, boolean]} - A tuple with the ref to attach and whether the element is visible
 */
export const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = '0px',
  freezeOnceVisible = true
}: UseIntersectionObserverProps = {}): [RefObject<HTMLElement>, boolean] => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const frozen = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Skip if already frozen
    if (frozen.current && isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state when element enters viewport
        const isElementVisible = entry.isIntersecting;
        setIsVisible(isElementVisible);

        // If freezeOnceVisible is true and element is visible, unobserve
        if (freezeOnceVisible && isElementVisible) {
          frozen.current = true;
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold, rootMargin, freezeOnceVisible]);

  return [ref, isVisible];
};

export default useIntersectionObserver; 