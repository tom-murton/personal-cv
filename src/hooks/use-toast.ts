
import { useState, useEffect } from "react";

type ToastType = "default" | "destructive" | "success";

type ToastProps = {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastType;
  duration?: number;
  action?: React.ReactElement;
};

export function toast(props: ToastProps) {
  const { title, description, variant = "default", duration = 5000, action } = props;
  
  // Create and dispatch a custom event
  const event = new CustomEvent("toast", {
    detail: {
      title,
      description,
      variant,
      duration,
      action,
    },
  });
  document.dispatchEvent(event);
}

export function useToast() {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const { title, description, variant, duration, action } = (e as CustomEvent).detail;
      const id = Math.random().toString(36).substring(2, 9);
      
      setToasts((prev) => [...prev, { id, title, description, variant, duration, action }]);
      
      // Remove toast after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    };

    document.addEventListener("toast", handleToast);
    
    return () => {
      document.removeEventListener("toast", handleToast);
    };
  }, []);

  return {
    toasts,
    toast,
    dismiss: (id: string) => setToasts((prev) => prev.filter((toast) => toast.id !== id)),
  };
}
