import React from "react";
import Layout from "@/components/layout/Layout";
import { ExternalLink } from "lucide-react";
import OptimizedImage from "@/components/ui/OptimizedImage";

const Projects: React.FC = () => {
  return (
    <Layout>
      <main className="container pt-32 pb-16">
        {/* Page Header */}
        <div className="mb-16">
          <h1 className="text-2xl font-bold mb-4">
            <span className="text-accent-teal font-mono mr-2">03.</span>
            Projects
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl">
            A collection of projects I've built independently, from idea to launch.
          </p>
        </div>

        {/* Projects Container */}
        <div className="space-y-24 max-w-4xl">

          {/* LightScout AI Project */}
          <article className="border-l border-accent-teal/30 pl-6 sm:pl-8">
            <div className="mb-6">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-3">
                <h2 className="text-2xl sm:text-3xl font-semibold">
                  LightScout AI
                </h2>
                <a
                  href="https://lightscout.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent-teal hover:text-accent-teal/80 transition-colors"
                >
                  Visit Site
                  <ExternalLink size={18} />
                </a>
              </div>
              <p className="text-muted-foreground text-lg">
                Native iOS photography app
              </p>
            </div>

            {/* The Problem */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-white">
                The Problem
              </h3>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  Photographers spend countless hours researching locations, checking weather conditions,
                  and calculating optimal lighting times. The process involves juggling multiple apps,
                  websites, and tools to plan a single shoot.
                </p>
                <p>
                  I wanted to create a single app that could analyze locations, predict lighting conditions,
                  and provide AI-powered recommendations - making it effortless for photographers to find
                  and plan their perfect shot.
                </p>
              </div>
            </section>

            {/* The Journey */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-white">
                The Journey
              </h3>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  I built LightScout AI entirely on my own over 6 months, investing approximately 130 hours
                  into the project. What made this particularly challenging - and exciting - was that I had
                  no prior coding experience before starting.
                </p>
                <p>
                  Using AI-assisted development tools, I learned Swift and iOS development from scratch,
                  iterating on the product design and user experience as I built. The entire journey was
                  a testament to what's possible when you combine determination with modern AI tooling.
                </p>
                <p className="text-accent-teal/90">
                  <a
                    href="https://www.linkedin.com/pulse/how-i-shipped-ios-app-store-without-writing-single-line-tom-murton-msm9e/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-teal hover:text-accent-teal/80 transition-colors underline"
                  >
                    My article about How PM Skills Let Me Ship a Personal Project to the App Store (Without Writing Code)
                  </a>
                </p>
              </div>
            </section>

            {/* What's Next */}
            <section className="mb-10">
              <h3 className="text-xl font-semibold mb-3 text-white">
                What's Next
              </h3>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  The app is live on the App Store and being used by photographers worldwide. I'm continuing
                  to gather feedback and iterate on features, with plans to expand the AI capabilities and
                  add more location intelligence features.
                </p>
                <p>
                  Future updates will include enhanced weather predictions, community-shared locations,
                  and deeper integration with photography workflows.
                </p>
              </div>
            </section>

            {/* App Screenshots */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-white">
                App Screenshots
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Screenshot 1: Home Screen */}
                <div className="rounded-lg overflow-hidden">
                  <OptimizedImage
                    src="/Screenshot 01.png"
                    alt="LightScout AI home screen showing Discover Perfect Shots with photography style selection cards"
                    width={1432}
                    height={2961}
                    objectFit="cover"
                    loading="lazy"
                    className="rounded-lg"
                  />
                </div>
                {/* Screenshot 2: Landscape Detail Screen */}
                <div className="rounded-lg overflow-hidden">
                  <OptimizedImage
                    src="/Screenshot 07.png"
                    alt="LightScout AI landscape detail screen showing AI-powered location intelligence with vantage points and photographic insights"
                    width={1432}
                    height={2961}
                    objectFit="cover"
                    loading="lazy"
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* App Store Link */}
            <div className="pt-4">
              <a
                href="https://lightscout.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent-teal text-navy font-medium rounded-md transition-all duration-300 hover:bg-accent-teal/90 hover:shadow-lg hover:shadow-accent-teal/20"
              >
                Learn More
                <ExternalLink size={18} />
              </a>
            </div>
          </article>

          {/* Future Projects Placeholder */}
          <div className="text-center py-12 border-t border-border/30">
            <p className="text-muted-foreground">
              More projects coming soon...
            </p>
          </div>

        </div>
      </main>
    </Layout>
  );
};

export default Projects;
