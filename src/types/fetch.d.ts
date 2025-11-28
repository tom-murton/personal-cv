
interface ProgressEvent {
  loaded: number;
  total?: number;
}

interface CustomRequestInit extends RequestInit {
  onUploadProgress?: (progressEvent: ProgressEvent) => void;
}

// Extend the fetch method
declare global {
  interface Window {
    customFetch: (input: RequestInfo | URL, init?: CustomRequestInit) => Promise<Response>;
  }
}

export {};
