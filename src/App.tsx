import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { lazy, Suspense } from "react";
import PageTransition from "@/components/layout/PageTransition";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

// Lazy load pages for better performance
const Index = lazy(() => import("@/pages/Index"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const InstagramFeed = lazy(() => import("@/pages/InstagramFeed"));

// Page loading component with enhanced skeleton
const PageLoading = () => (
  <div className="container max-w-5xl mx-auto px-4 py-8">
    <LoadingSkeleton.Group>
      {/* Hero section loading skeleton */}
      <div className="space-y-6 py-8">
        <LoadingSkeleton variant="text" height="3rem" width="70%" />
        <LoadingSkeleton variant="text" height="2rem" width="40%" />
        <LoadingSkeleton.Paragraph lines={2} className="mt-8" />
      </div>
      
      {/* Content section loading skeleton */}
      <div className="mt-12 space-y-8">
        <LoadingSkeleton variant="text" height="2rem" width="30%" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingSkeleton.Card />
          <LoadingSkeleton.Card />
          <LoadingSkeleton.Card />
        </div>
      </div>
    </LoadingSkeleton.Group>
  </div>
);

function App() {
  const location = useLocation();
  
  return (
    <div className="App dark">
      <Toaster />
      <PageTransition location={location.pathname}>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/instagram" element={<InstagramFeed />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageTransition>
    </div>
  );
}

export default App;
