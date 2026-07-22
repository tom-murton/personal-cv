import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { lazy, Suspense } from "react";
import PageTransition from "@/components/layout/PageTransition";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { PortfolioContentProvider } from "@/content/PortfolioContentProvider";

// Lazy load pages for better performance
const Index = lazy(() => import("@/pages/Index"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const InstagramFeed = lazy(() => import("@/pages/InstagramFeed"));
const Projects = lazy(() => import("@/pages/Projects"));
const ShipAGame = lazy(() => import("@/pages/ShipAGame"));
const BenchmarkGame = lazy(() => import("@/pages/BenchmarkGame"));
const Writing = lazy(() => import("@/pages/Writing"));
const Article = lazy(() => import("@/pages/Article"));
const Talks = lazy(() => import("@/pages/Talks"));
const Cv = lazy(() => import("@/pages/Cv"));
const Admin = lazy(() => import("@/pages/Admin"));
const DesignSampleIndex = lazy(() => import("@/pages/designs/DesignSamples").then((module) => ({ default: module.DesignSampleIndex })));
const LivingWorkbench = lazy(() => import("@/pages/designs/DesignSamples").then((module) => ({ default: module.LivingWorkbench })));
const BuildersLog = lazy(() => import("@/pages/designs/DesignSamples").then((module) => ({ default: module.BuildersLog })));
const PersonalMagazine = lazy(() => import("@/pages/designs/DesignSamples").then((module) => ({ default: module.PersonalMagazine })));
const ProjectGallery = lazy(() => import("@/pages/designs/DesignSamples").then((module) => ({ default: module.ProjectGallery })));
const MakerIndex = lazy(() => import("@/pages/designs/DesignSamples").then((module) => ({ default: module.MakerIndex })));
const ProjectUniverse = lazy(() => import("@/pages/designs/DesignSamples").then((module) => ({ default: module.ProjectUniverse })));
const KineticReel = lazy(() => import("@/pages/designs/DesignSamples").then((module) => ({ default: module.KineticReel })));
const MakersDesk = lazy(() => import("@/pages/designs/DesignSamples").then((module) => ({ default: module.MakersDesk })));
const ClaudeAurora = lazy(() => import("@/pages/designs/DesignSamples").then((module) => ({ default: module.ClaudeAurora })));
const ClaudeKinetic = lazy(() => import("@/pages/designs/DesignSamples").then((module) => ({ default: module.ClaudeKinetic })));
const ClaudeTerminal = lazy(() => import("@/pages/designs/DesignSamples").then((module) => ({ default: module.ClaudeTerminal })));
const ClaudeAfterglow = lazy(() => import("@/pages/designs/DesignSamples").then((module) => ({ default: module.ClaudeAfterglow })));
const ClaudeWorkbench = lazy(() => import("@/pages/designs/DesignSamples").then((module) => ({ default: module.ClaudeWorkbench })));
const ClaudeJournal = lazy(() => import("@/pages/designs/DesignSamples").then((module) => ({ default: module.ClaudeJournal })));
const ClaudeIndex = lazy(() => import("@/pages/designs/DesignSamples").then((module) => ({ default: module.ClaudeIndex })));
const ClaudePlayground = lazy(() => import("@/pages/designs/DesignSamples").then((module) => ({ default: module.ClaudePlayground })));
const ClaudePoster = lazy(() => import("@/pages/designs/DesignSamples").then((module) => ({ default: module.ClaudePoster })));

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
    <PortfolioContentProvider>
      <div className="App dark">
        <Toaster />
        <PageTransition location={location.pathname}>
          <Suspense fallback={<PageLoading />}>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/ship-a-game" element={<ShipAGame />} />
            <Route path="/projects/ship-a-game/:game" element={<BenchmarkGame />} />
            <Route path="/writing" element={<Writing />} />
            <Route path="/writing/:slug" element={<Article />} />
            <Route path="/talks" element={<Talks />} />
            <Route path="/cv" element={<Cv />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/instagram" element={<InstagramFeed />} />
            <Route path="/designs" element={<DesignSampleIndex />} />
            <Route path="/designs/workbench" element={<LivingWorkbench />} />
            <Route path="/designs/log" element={<BuildersLog />} />
            <Route path="/designs/magazine" element={<PersonalMagazine />} />
            <Route path="/designs/gallery" element={<ProjectGallery />} />
            <Route path="/designs/index" element={<MakerIndex />} />
            <Route path="/designs/universe" element={<ProjectUniverse />} />
            <Route path="/designs/reel" element={<KineticReel />} />
            <Route path="/designs/desk" element={<MakersDesk />} />
            <Route path="/designs/claude-aurora" element={<ClaudeAurora />} />
            <Route path="/designs/claude-kinetic" element={<ClaudeKinetic />} />
            <Route path="/designs/claude-terminal" element={<ClaudeTerminal />} />
            <Route path="/designs/claude-afterglow" element={<ClaudeAfterglow />} />
            <Route path="/designs/claude-workbench" element={<ClaudeWorkbench />} />
            <Route path="/designs/claude-journal" element={<ClaudeJournal />} />
            <Route path="/designs/claude-index" element={<ClaudeIndex />} />
            <Route path="/designs/claude-playground" element={<ClaudePlayground />} />
            <Route path="/designs/claude-poster" element={<ClaudePoster />} />
            <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </div>
    </PortfolioContentProvider>
  );
}

export default App;
