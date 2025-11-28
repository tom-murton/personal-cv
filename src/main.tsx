import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { initCoreWebVitalsMonitoring } from './utils/performance'

// Initialize performance monitoring in development
if (process.env.NODE_ENV === 'development') {
  initCoreWebVitalsMonitoring();
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
