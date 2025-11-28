/**
 * Performance monitoring and optimization utilities
 */

/**
 * Measures and logs component render time
 * Usage: const endMeasure = measureRenderTime('ComponentName');
 * Then call endMeasure() in a useEffect cleanup function
 */
export const measureRenderTime = (componentName: string): () => void => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName} rendered in ${Math.round(endTime - startTime)}ms`);
    }
  };
};

/**
 * Creates an intersection observer that monitors when elements enter viewport
 * Used to only render expensive components when they become visible
 */
export const createViewportObserver = (
  callback: (isIntersecting: boolean) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '300px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver((entries) => {
    callback(entries[0].isIntersecting);
  }, defaultOptions);
};

/**
 * Tracks and reports largest contentful paint (LCP) metric
 * Important for Core Web Vitals
 */
export const reportLCP = (): void => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    // Only log in development
    const isLogging = process.env.NODE_ENV === 'development';
    
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        if (isLogging) {
          const lcpTime = Math.round(lastEntry.startTime);
          console.log(`[Core Web Vitals] LCP: ${lcpTime}ms`);
          
          if (lcpTime < 2500) {
            console.log('%c[Core Web Vitals] LCP Good: < 2.5s', 'color: green');
          } else if (lcpTime < 4000) {
            console.log('%c[Core Web Vitals] LCP Needs Improvement: 2.5s - 4s', 'color: orange');
          } else {
            console.log('%c[Core Web Vitals] LCP Poor: > 4s', 'color: red');
          }
        }
      });
      
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.error('LCP monitoring error:', e);
    }
  }
};

/**
 * Interface for PerformanceEventTiming which extends PerformanceEntry
 * with properties needed for FID measurement
 */
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
  processingEnd: number;
  duration: number;
  startTime: number;
}

/**
 * Tracks and reports first input delay (FID) metric
 * Important for Core Web Vitals
 */
export const reportFID = (): void => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    // Only log in development
    const isLogging = process.env.NODE_ENV === 'development';
    
    try {
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const firstInput = entries[0] as PerformanceEventTiming;
        
        if (isLogging && firstInput) {
          const inputDelay = Math.round(firstInput.processingStart - firstInput.startTime);
          console.log(`[Core Web Vitals] FID: ${inputDelay}ms`);
          
          if (inputDelay < 100) {
            console.log('%c[Core Web Vitals] FID Good: < 100ms', 'color: green');
          } else if (inputDelay < 300) {
            console.log('%c[Core Web Vitals] FID Needs Improvement: 100ms - 300ms', 'color: orange');
          } else {
            console.log('%c[Core Web Vitals] FID Poor: > 300ms', 'color: red');
          }
        }
      });
      
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.error('FID monitoring error:', e);
    }
  }
};

/**
 * Tracks and reports cumulative layout shift (CLS) metric
 * Important for Core Web Vitals
 */
export const reportCLS = (): void => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    // Only log in development
    const isLogging = process.env.NODE_ENV === 'development';
    let clsValue = 0;
    let clsEntries: PerformanceEntry[] = [];
    
    try {
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            clsEntries.push(entry);
          }
        });
        
        if (isLogging) {
          console.log(`[Core Web Vitals] Current CLS: ${clsValue.toFixed(3)}`);
          
          if (clsValue < 0.1) {
            console.log('%c[Core Web Vitals] CLS Good: < 0.1', 'color: green');
          } else if (clsValue < 0.25) {
            console.log('%c[Core Web Vitals] CLS Needs Improvement: 0.1 - 0.25', 'color: orange');
          } else {
            console.log('%c[Core Web Vitals] CLS Poor: > 0.25', 'color: red');
          }
        }
      });
      
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.error('CLS monitoring error:', e);
    }
  }
};

/**
 * Initializes all Core Web Vitals monitoring
 * Call this function in your app's entrypoint
 */
export const initCoreWebVitalsMonitoring = (): void => {
  if (process.env.NODE_ENV === 'development') {
    reportLCP();
    reportFID();
    reportCLS();
  }
}; 