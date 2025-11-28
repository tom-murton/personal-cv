# Portfolio Enhancement Implementation Guide

This document serves as the comprehensive reference for all enhancements to the personal portfolio site. Each section includes specific implementation details, code samples, and testing instructions.

## Table of Contents

1. [Quick Start Guide](#quick-start-guide)
2. [Project Structure Overview](#project-structure-overview)
3. [Design System Foundation](#design-system-foundation)
   - [Color System](#color-system)
   - [Typography System](#typography-system)
4. [Layout Improvements](#layout-improvements)
   - [Section Spacing](#section-spacing)
   - [Grid System](#grid-system)
5. [Component Enhancements](#component-enhancements)
   - [Hero Section](#hero-section)
   - [Experience Cards](#experience-cards)
   - [Article Cards](#article-cards)
   - [Talks Section](#talks-section)
6. [Navigation & Header](#navigation--header)
   - [Navbar Enhancement](#navbar-enhancement)
   - [Side Navigation](#side-navigation)
7. [Animation System](#animation-system)
   - [Scroll Animations](#scroll-animations)
   - [Staggered List Animations](#staggered-list-animations)
   - [Hover Interactions](#hover-interactions)
8. [Visual Interest & Personality](#visual-interest--personality)
   - [Decorative Elements](#decorative-elements)
   - [Microinteractions](#microinteractions)
9. [Mobile Optimization](#mobile-optimization)
   - [Mobile Navigation](#mobile-navigation)
   - [Responsive Refinements](#responsive-refinements)
10. [Performance & Polishing](#performance--polishing)
    - [Image Optimization](#image-optimization)
    - [Final Review](#final-review)
11. [Code Cleanup and Optimization](#code-cleanup-and-optimization)
    - [Unused Code Removal](#unused-code-removal)
    - [Code Quality Improvements](#code-quality-improvements)
    - [Implementation Process](#implementation-process)
12. [Visual References](#visual-references)
13. [Pre-Implementation Checklist](#pre-implementation-checklist)
14. [Common Issues & Troubleshooting](#common-issues--troubleshooting)
15. [Glossary of Terms](#glossary-of-terms)

## Implementation Status

| Phase | Section | Status | Completed Date |
|-------|---------|--------|----------------|
| 1 | Design System Foundation | Completed | 2023-03-27 |
| 2 | Layout Improvements | Completed | 2023-03-27 |
| 3 | Component Enhancements | Completed | 2023-03-27 |
| 4 | Navigation & Header | Completed | 2024-03-28 |
| 5 | Animation System | Completed | 2024-04-10 |
| 6 | Visual Interest & Personality | Completed | 2024-04-12 |
| 7 | Mobile Optimization | Completed | 2024-04-15 |
| 8 | Performance & Polishing | Completed | 2024-04-17 |

### Recent Completion: Final Polishing ✅

The Final Polishing phase has been completed with the following key enhancements:

1. **Enhanced Loading States**
   - Added smooth content loading indicators with `LoadingSkeleton` components
   - Implemented better fade-in animations for content visibility
   - Enhanced image loading with blur-up and progressive loading
   - Created page transition animations for smoother navigation

2. **Refined Micro-Interactions**
   - Improved hover effects on all cards and buttons
   - Added subtle animations for list items with staggered timing
   - Enhanced visual feedback for user interactions
   - Created better UI states for active/hover/focus states
   
3. **Visual Enhancements**
   - Added decorative gradient blobs for visual interest
   - Improved NotFound page with better design and animations
   - Created a scroll guide component for first-time visitors
   - Enhanced card designs with subtle shadows and glows

4. **Consistency Improvements**
   - Standardized animations and transitions
   - Unified hover effects across similar components
   - Ensured consistent styling for all UI elements
   - Improved visual hierarchy across the site

### Next Steps: Project Completion

With all planned enhancements now implemented, the focus shifts to:

1. **Final Code Cleanup**
   - Remove any remaining unused code
   - Complete documentation of the codebase
   - Final performance optimizations

2. **Project Completion and Handoff**
   - Final testing across all devices
   - Documentation for any future maintenance
   - Setup analytics for tracking site performance

---

## Quick Start Guide

This section provides experienced developers with a streamlined path to implement all enhancements.

### Prerequisites

- React 18+ with TypeScript
- TailwindCSS installed and configured
- Framer Motion library installed (`npm install framer-motion`)
- Basic understanding of React hooks and functional components

### Implementation Order

For optimal efficiency, implement enhancements in this order:

1. **Design System** - Implement color and typography first, as they form the foundation
2. **Layout Structure** - Add spacing and grid systems next
3. **Components** - Enhance individual components using the design system
4. **Navigation** - Implement navigation after core components
5. **Animations** - Add animations to components and interactions
6. **Visual Elements** - Add decorative elements and microinteractions
7. **Mobile Optimization** - Refine for mobile experiences
8. **Performance** - Optimize images and review performance

### Key Files to Modify

- `src/index.css` - For design system, spacing, and global styles
- `src/components/layout/Layout.tsx` - For overall layout structure
- `src/pages/Index.tsx` - For hero section and main content layout
- `src/components/ui/` - For reusable UI components
- `src/components/mobile/` - For mobile-specific components

### Critical Components

Components that require special attention:
- `Navbar` - Main navigation with mobile menu
- `ArticleCard` - Card component for articles/portfolio items
- `FloatingNav` - Mobile-specific navigation component
- `OptimizedImage` - Performance-optimized image component

---

## Project Structure Overview

```
src/
├── assets/            # Static assets like images and icons
├── components/
│   ├── layout/        # Layout components
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   └── SideNav.tsx
│   ├── mobile/        # Mobile-specific components
│   │   └── FloatingNav.tsx
│   ├── sections/      # Page section components
│   │   ├── About.tsx
│   │   ├── Articles.tsx
│   │   ├── Experience.tsx
│   │   ├── Hero.tsx
│   │   └── Talks.tsx
│   └── ui/            # Reusable UI components
│       ├── ArticleCard.tsx
│       ├── Button.tsx
│       ├── ExperienceCard.tsx
│       ├── HoverCard.tsx
│       ├── OptimizedImage.tsx
│       └── Tag.tsx
├── hooks/             # Custom React hooks
│   ├── useIntersectionObserver.ts
│   ├── useIsTouchDevice.ts
│   └── useScrollPosition.ts
├── pages/             # Page components
│   ├── About.tsx
│   ├── Index.tsx
│   └── Photography.tsx
├── utils/             # Utility functions
│   ├── a11y.ts
│   ├── animation.ts
│   ├── imageUtils.ts
│   └── performance.ts
├── App.tsx            # Main App component
└── index.css          # Global styles & design system
```

### Component Relationship Diagram

```
Layout (root)
├── Navbar
│   └── MobileMenu (conditionally rendered)
├── Main Content (pages)
│   ├── Hero Section
│   ├── About Section
│   ├── Experience Section
│   │   └── ExperienceCard (multiple)
│   ├── Articles Section
│   │   └── ArticleCard (multiple)
│   └── Talks Section
│       └── TalkCard (multiple)
├── SideNav (desktop only)
├── FloatingNav (mobile only)
└── Footer
```

---

## Design System Foundation

### Color System

#### Implementation Details

1. Update `src/index.css` with the following color variables:

```css
:root {
  /* Primary colors */
  --primary: 210 100% 40%;
  --primary-light: 210 100% 50%; 
  --primary-dark: 210 100% 30%;
  --primary-foreground: 210 40% 98%;
  
  /* Accent colors */
  --accent-teal: 174 80% 60%;
  --accent-teal-muted: 174 70% 40%;
  --accent-secondary: 280 80% 60%;
  
  /* Background colors */
  --background-start: 222 47% 11%;
  --background-end: 222 47% 8%;
  
  /* Neutral colors */
  --muted: 220 13% 69%;
  --muted-foreground: 220 14% 96%;
  --border: 220 13% 25%;
  
  /* Status colors */
  --success: 142 70% 45%;
  --warning: 38 92% 50%;
  --error: 358 70% 50%;
}

/* Gradient utilities */
.bg-gradient-page {
  background: linear-gradient(to bottom, 
    hsl(var(--background-start)), 
    hsl(var(--background-end))
  );
}

.bg-gradient-card {
  background: linear-gradient(to bottom right, 
    hsla(var(--primary), 0.05), 
    hsla(var(--accent-teal), 0.05)
  );
  backdrop-filter: blur(8px);
}

/* Text color utilities */
.text-accent {
  color: hsl(var(--accent-teal));
}

.text-primary {
  color: hsl(var(--primary));
}

.text-muted {
  color: hsl(var(--muted));
}
```

2. Apply new color classes across components:
   - Replace hardcoded color values with CSS variables
   - Use utility classes for consistent coloring

#### Testing

1. Apply gradient background to main layout component
2. Apply accent color to hero section elements
3. Visually verify color harmony and contrast
4. Check against WCAG AA contrast guidelines

### Typography System

#### Implementation Details

1. Update `src/index.css` with improved typography variables:

```css
:root {
  /* Font families */
  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  
  /* Type scale (1.25 ratio) */
  --font-size-xs: 0.8rem;
  --font-size-sm: 0.9rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.563rem;
  --font-size-2xl: 1.953rem;
  --font-size-3xl: 2.441rem;
  --font-size-4xl: 3.052rem;
  
  /* Line heights */
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* Letter spacing */
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.025em;
  
  /* Font weights */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}

/* Base typography */
body {
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  font-weight: var(--font-weight-normal);
}

/* Heading styles */
h1, .h1 {
  font-size: var(--font-size-4xl);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  font-weight: var(--font-weight-bold);
  margin-bottom: 1.5rem;
}

h2, .h2 {
  font-size: var(--font-size-3xl);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  font-weight: var(--font-weight-bold);
  margin-bottom: 1.25rem;
}

h3, .h3 {
  font-size: var(--font-size-2xl);
  line-height: var(--line-height-tight);
  font-weight: var(--font-weight-semibold);
  margin-bottom: 1rem;
}

h4, .h4 {
  font-size: var(--font-size-xl);
  line-height: var(--line-height-tight);
  font-weight: var(--font-weight-semibold);
  margin-bottom: 0.75rem;
}

p, .body {
  margin-bottom: 1rem;
}

.body-large {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
}

.body-small {
  font-size: var(--font-size-sm);
}

code, .code {
  font-family: var(--font-mono);
  font-size: 0.9em;
}

/* Optional: Import custom fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

2. Update components to use these typography classes:
   - Apply heading classes to all section titles
   - Update paragraph styles with appropriate text classes
   - Use monospace font for code elements and numbering

#### Testing

1. Review typography in all sections
2. Test readability across device sizes
3. Verify consistent text hierarchy
4. Check font loading performance

---

## Layout Improvements

### Section Spacing

#### Implementation Details

1. Add spacing variables to `src/index.css`:

```css
:root {
  /* Spacing scale (1.5 ratio) */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.5rem;    /* 24px */
  --space-6: 2rem;      /* 32px */
  --space-7: 3rem;      /* 48px */
  --space-8: 4rem;      /* 64px */
  --space-9: 6rem;      /* 96px */
  --space-10: 8rem;     /* 128px */
  
  /* Section spacing */
  --section-padding-y: var(--space-6);
  --card-padding: var(--space-5);
}

/* Section spacing utilities */
.section {
  padding-top: var(--space-6);
  padding-bottom: var(--space-6);
}

.section-divider {
  margin-top: var(--section-spacing);
  margin-bottom: var(--section-spacing);
  height: 1px;
  background-color: hsla(var(--muted), 0.1);
  width: 100%;
}
```

2. Update section containers in `src/pages/Index.tsx`:

```tsx
{/* Example section update */}
<section id="hero" className="section pt-10 pb-4">
  {/* Section content */}
</section>

<section id="about" className="section border-t border-muted/10">
  {/* Section content */}
</section>
```

3. Apply consistent padding to all content sections while maintaining subtle borders between sections

#### Testing

1. Check vertical rhythm between sections
2. Verify spacing is consistent across viewport sizes
3. Confirm section borders are subtle and don't break the visual flow

### Grid System

#### Implementation Details

1. Create grid layout utilities in `src/index.css`:

```css
/* Grid system */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-4);
  padding-right: var(--space-4);
  max-width: 1200px;
}

@media (min-width: 640px) {
  .container {
    padding-left: var(--space-5);
    padding-right: var(--space-5);
  }
}

.grid {
  display: grid;
  gap: var(--space-5);
}

.grid-cols-1 {
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .grid-cols-2-sm {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-cols-3-lg {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Background patterns */
.bg-grid-pattern {
  background-size: 20px 20px;
  background-image: 
    linear-gradient(to right, hsla(var(--primary), 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, hsla(var(--primary), 0.05) 1px, transparent 1px);
}

.bg-dot-pattern {
  background-size: 20px 20px;
  background-image: radial-gradient(
    hsla(var(--primary), 0.1) 2px,
    transparent 2px
  );
}
```

2. Update `src/components/layout/Layout.tsx`:

```tsx
// Add subtle background pattern
<div className="min-h-screen flex flex-col bg-gradient-page text-white relative">
  {/* Background pattern with increased opacity */}
  <div className="absolute inset-0 pointer-events-none bg-dot-pattern opacity-10"></div>
  
  <Navbar />
  
  <div className="flex-grow relative">
    <div className="container mx-auto md:pl-36 relative">
      {/* Rest of layout */}
    </div>
  </div>
  
  <Footer />
</div>
```

3. Update section containers to use grid layout:

```tsx
{/* Example grid implementation */}
<div className="grid grid-cols-1 grid-cols-2-sm grid-cols-3-lg gap-6">
  {articles.map((article, index) => (
    <ArticleCard 
      key={index} 
      title={article.title}
      date={article.date}
      description={article.description}
      link={article.link}
      image={article.image}
    />
  ))}
</div>
```

#### Testing

1. Check responsive behavior of grid layouts
2. Verify background pattern subtlety
3. Test container alignment at various screen sizes

## Component Enhancements

### Hero Section

#### Implementation Details

1. Update hero section in `src/pages/Index.tsx`:

```tsx
{/* Hero Section with enhanced styling */}
<section id="hero" className="section pt-10 pb-4">
  <div className="max-w-4xl">
    <motion.p
      className="text-accent-teal font-mono mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {heroContent.greeting}
    </motion.p>
    
    <motion.h1
      className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {heroContent.name}
    </motion.h1>
    
    <motion.h2
      className="text-3xl sm:text-4xl md:text-5xl text-muted-foreground font-semibold mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {heroContent.tagline}
    </motion.h2>
    
    <motion.p
      className="text-muted-foreground text-lg max-w-3xl leading-relaxed"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {heroContent.description}
    </motion.p>
  </div>
</section>
```

2. Add subtle background element:

```tsx
<section id="hero" className="section pt-10 pb-4 relative">
  {/* Decorative background element */}
  <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-accent-teal/10 to-primary/5 rounded-full blur-3xl -z-10"></div>
  
  {/* Hero content */}
</section>
```

#### Testing

1. Verify animation timing and feel
2. Check text sizing across device sizes
3. Ensure background element is subtle and doesn't affect readability

### Experience Cards

#### Implementation Details

1. Update `src/components/work/ExperienceCard.tsx`:

```tsx
import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface ExperienceCardProps {
  title: string;
  company: string;
  companyLink?: string;
  period: string;
  description: string;
  achievements?: string[];
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  title,
  company,
  companyLink,
  period,
  description,
  achievements = [],
}) => {
  return (
    <motion.div
      className="p-6 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          {companyLink ? (
            <a
              href={companyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-teal hover:underline inline-block mt-1"
            >
              {company}
            </a>
          ) : (
            <p className="text-accent-teal mt-1">{company}</p>
          )}
        </div>
        <p className="text-muted-foreground font-mono text-sm mt-2 sm:mt-0">
          {period}
        </p>
      </div>
      
      <p className="text-muted-foreground mb-4">{description}</p>
      
      {achievements.length > 0 && (
        <div>
          <h4 className="text-sm uppercase tracking-wider mb-2 text-muted-foreground font-medium">Key Achievements</h4>
          <ul className="space-y-2">
            {achievements.map((achievement, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="flex items-start gap-2"
              >
                <span className="text-accent-teal mt-1">→</span>
                <span>{achievement}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default ExperienceCard;
```

#### Testing

1. Verify hover animations and transitions
2. Test staggered animation of achievement items
3. Check card appearance across viewport sizes

### Article Cards

#### Implementation Details

1. Create utility function for fetching metadata in `src/utils/linkMetadata.ts`:

```tsx
/**
 * Utility functions for extracting metadata from links
 */

/**
 * Extracts Open Graph metadata from a URL
 * Works with LinkedIn articles and other sites that support OG tags
 */
export interface LinkMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
}

/**
 * Fetches metadata from a URL via our proxy endpoint
 * This function will call a server endpoint that handles CORS issues
 */
export const fetchLinkMetadata = async (url: string): Promise<LinkMetadata | null> => {
  try {
    // Call the proxy endpoint
    const response = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching link metadata:", error);
    return null;
  }
};
```

2. Create a server-side API endpoint in `src/pages/api/metadata.ts`:

```tsx
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as cheerio from 'cheerio';

type MetadataResponse = {
  title: string;
  description: string;
  image: string;
  url: string;
}

/**
 * API endpoint to fetch Open Graph metadata from URLs 
 * This endpoint acts as a proxy to bypass CORS restrictions
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MetadataResponse | { error: string }>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // Use axios to fetch the URL content
    // LinkedIn might restrict direct access, so we use a special user agent
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkedInBot/1.0; +http://www.linkedin.com)'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);
    
    // Extract Open Graph metadata
    const metadata: MetadataResponse = {
      title: $('meta[property="og:title"]').attr('content') || 
             $('meta[name="twitter:title"]').attr('content') || 
             $('title').text() || '',
      description: $('meta[property="og:description"]').attr('content') || 
                   $('meta[name="twitter:description"]').attr('content') || 
                   $('meta[name="description"]').attr('content') || '',
      image: $('meta[property="og:image"]').attr('content') || 
             $('meta[name="twitter:image"]').attr('content') || '',
      url: url
    };

    // Set cache headers
    res.setHeader('Cache-Control', 'public, s-maxage=86400'); // 24 hours
    return res.status(200).json(metadata);
    
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return res.status(500).json({ error: 'Failed to fetch metadata' });
  }
}
```

3. Update `src/components/work/ArticleCard.tsx` to dynamically fetch metadata:

```tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { fetchLinkMetadata, LinkMetadata } from "../../utils/linkMetadata";

interface ArticleCardProps {
  title?: string;
  date: string;
  description?: string;
  link: string;
  image?: string;
  isDynamicContent?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title: initialTitle,
  date,
  description: initialDescription,
  link,
  image: initialImage,
  isDynamicContent = true,
}) => {
  const [isLoading, setIsLoading] = useState(isDynamicContent);
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  
  // Use provided values if available, otherwise use metadata from link
  const title = metadata?.title || initialTitle || "Loading...";
  const description = metadata?.description || initialDescription || "";
  const image = metadata?.image || initialImage || "";
  
  useEffect(() => {
    // Only fetch metadata if isDynamicContent is true and we have a link
    if (isDynamicContent && link) {
      setIsLoading(true);
      fetchLinkMetadata(link)
        .then(data => {
          if (data) {
            setMetadata(data);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [link, isDynamicContent]);
  
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg border-b border-border/20 overflow-hidden h-full transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      {/* Image with overlay gradient */}
      {image ? (
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <div className="absolute inset-0 bg-gradient-to-t from-background-start to-transparent opacity-60 z-10 group-hover:opacity-40 transition-opacity duration-300"></div>
          {isLoading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse"></div>
          ) : (
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          )}
        </div>
      ) : null}
      
      {/* Content */}
      <div className="p-5">
        <p className="text-sm text-muted-foreground font-mono mb-2">{date}</p>
        
        {isLoading ? (
          <div className="h-6 bg-gray-200 animate-pulse rounded mb-2"></div>
        ) : (
          <h3 className="text-xl font-semibold mb-2 group-hover:text-accent-teal transition-colors duration-300">{title}</h3>
        )}
        
        {description && !isLoading ? (
          <p className="text-muted-foreground text-sm line-clamp-3">{description}</p>
        ) : isLoading ? (
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
          </div>
        ) : null}
        
        {/* Read more link */}
        <div className="mt-4 flex items-center text-accent-teal text-sm font-medium">
          <span>Read article</span>
          <ArrowUpRight 
            className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" 
          />
        </div>
      </div>
    </motion.a>
  );
};

export default ArticleCard;
```

4. Update article data in `src/data/workData.ts` to use dynamic content:

```tsx
// Articles data
export const articles = [
  {
    id: 1,
    date: "January 2024",
    link: "https://www.linkedin.com/pulse/case-becoming-more-product-focused-engineering-leader-tom-murton-9ga7f",
    isDynamicContent: true,
  },
  {
    id: 2,
    date: "November 2023",
    link: "https://www.linkedin.com/pulse/bridging-gap-how-engineering-leaders-can-foster-better-tom-murton-3dvke",
    isDynamicContent: true,
  },
  {
    id: 3,
    date: "October 2023",
    link: "https://www.linkedin.com/pulse/frictionless-internal-movement-tom-murton",
    isDynamicContent: true,
  }
];
```

5. Install required dependencies:

```bash
npm install axios cheerio next
```

#### Testing

1. Check that article cards dynamically fetch content from LinkedIn
2. Verify loading states display correctly 
3. Test fallback to provided content when metadata cannot be fetched
4. Ensure images load correctly from LinkedIn or fallback to default
5. Test with network throttling to ensure good user experience during slow loads
6. Verify images and text have proper dimensions and styling

### Talks Section

#### Implementation Details

1. Update `src/components/work/TalkCard.tsx`:

```tsx
import React from "react";
import { motion } from "framer-motion";
import { Calendar, ExternalLink, Video, FileText } from "lucide-react";

interface TalkProps {
  title: string;
  event: string;
  date: string;
  description: string;
  link?: string;
  videoLink?: string;
  slidesLink?: string;
}

const TalkCard: React.FC<{ talk: TalkProps }> = ({ talk }) => {
  return (
    <motion.div
      className="p-6 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-1">{talk.title}</h3>
          <p className="text-accent-teal">{talk.event}</p>
        </div>
        <p className="text-muted-foreground font-mono text-sm mt-2 md:mt-0 md:ml-4 md:text-right whitespace-nowrap">
          {talk.date}
        </p>
      </div>
      
      <p className="text-muted-foreground mb-4">{talk.description}</p>
      
      {/* Links section */}
      <div className="flex flex-wrap gap-3 mt-3">
        {talk.link && (
          <a
            href={talk.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-accent-teal hover:underline"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Event Link
          </a>
        )}
        
        {talk.videoLink && (
          <a
            href={talk.videoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-accent-teal hover:underline"
          >
            <Video className="h-4 w-4 mr-1" />
            Watch Video
          </a>
        )}
        
        {talk.slidesLink && (
          <a
            href={talk.slidesLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-accent-teal hover:underline"
          >
            <FileText className="h-4 w-4 mr-1" />
            View Slides
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default TalkCard;
```

#### Testing

1. Verify responsive layout for talk details
2. Test hover animations
3. Ensure links have proper spacing
4. Check icon alignment

## Navigation & Header

### Navbar Enhancement (Completed)

The enhanced navbar now includes:

1. **Clean, Solid Design**
   - Solid dark blue background matching the site's theme
   - No transparency to ensure content is always readable
   - Smooth shadow effect when scrolled

2. **Progress Indicator**
   - Thin teal line at bottom of navbar
   - Shows reading progress as you scroll
   - Helps users track their position on the page

3. **Smart Navigation**
   - Clear section highlighting
   - Smooth scrolling to sections
   - Numbered navigation items for easy reference

4. **Mobile Experience**
   - Full-screen mobile menu with clear visibility
   - Large, easy-to-tap navigation items
   - Smooth open/close animations
   - Clear close button (X icon)

#### Testing Instructions for Non-Technical Users

1. **Basic Navigation Test**
   - Open the website
   - Click each menu item (Home, About, Experience, etc.)
   - The page should smoothly scroll to each section
   - The clicked item should highlight in white with a teal underline

2. **Scroll Progress Test**
   - Scroll down the page slowly
   - Watch the teal line at the bottom of the navigation
   - It should grow from left to right as you scroll
   - When you reach the bottom, the line should be full width

3. **Mobile Menu Test**
   - Open the website on your phone
   - Tap the menu icon (three lines) in the top right
   - The menu should open smoothly
   - You should see all menu items clearly
   - Tap the X to close
   - Try clicking menu items - they should work and close the menu

4. **Visual Check**
   - The navigation bar should be solid dark blue
   - Text should be clearly visible
   - No content should show through the navigation
   - When scrolling, a subtle shadow should appear under the navigation

#### Known Issues
- None currently identified

### Side Navigation

#### Implementation Details

1. Update `src/components/layout/SideNavigation.tsx`:

```tsx
import React from "react";
import { motion } from "framer-motion";

const SideNavigation: React.FC = () => {
  return (
    <nav className="hidden md:flex flex-col items-center">
      <div className="space-y-6">
        <SideNavItem href="#about" label="About" />
        <SideNavItem href="#experience" label="Experience" />
        <SideNavItem href="#articles" label="Articles" />
        <SideNavItem href="#talks" label="Talks" />
      </div>
    </nav>
  );
};

// Side Navigation Link Component
const SideNavItem: React.FC<{ href: string; label: string }> = ({ href, label }) => {
  // Custom hook to track active section would be ideal here
  // For simplicity, we'll implement a basic version
  const [isActive, setIsActive] = React.useState(false);
  
  React.useEffect(() => {
    const targetElement = document.querySelector(href);
    
    const handleScroll = () => {
      if (!targetElement) return;
      
      const rect = targetElement.getBoundingClientRect();
      const isVisible = 
        rect.top <= 150 && 
        rect.bottom >= 150;
      
      setIsActive(isVisible);
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [href]);
  
  return (
    <motion.div
      className="flex items-center space-x-4 group"
      whileHover={{ x: 5 }}
      transition={{ duration: 0.2 }}
    >
      <div 
        className={`w-10 h-px transition-all duration-300 ${
          isActive ? "w-16 bg-accent-teal" : "bg-muted-foreground/50 group-hover:bg-muted-foreground"
        }`} 
      />
      <a 
        href={href}
        className={`text-sm transition-colors duration-300 ${
          isActive ? "text-white" : "text-muted-foreground group-hover:text-white"
        }`}
      >
        {label}
      </a>
    </motion.div>
  );
};

export default SideNavigation;
```

2. Use this component in the Layout:

```tsx
// Inside Layout.tsx
<div className="fixed left-10 top-1/2 -translate-y-1/2 z-20">
  <SideNavigation />
</div>
```

#### Testing

1. Verify side navigation appears on desktop only
2. Check active section highlighting as user scrolls
3. Test hover animations and transitions
4. Ensure all navigation links work correctly

## Animation System

### Scroll Animations

#### Implementation Details

1. Create a reusable animation utility file `src/utils/animations.ts`:

```tsx
import { Variants } from "framer-motion";

// Fade up animation - good for section titles and content
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1] // Ease out cubic
    }
  })
};

// Fade in animation - more subtle, good for background elements
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (custom = 0) => ({
    opacity: 1,
    transition: {
      delay: custom * 0.1,
      duration: 0.6
    }
  })
};

// Scale up animation - good for cards and important elements
export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (custom = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1]
    }
  })
};

// Slide in from side - good for sidebar elements
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: (custom = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1]
    }
  })
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: (custom = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1]
    }
  })
};

// Container variant for staggered children animations
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};
```

2. Use these animation variants in section components:

```tsx
// Example section implementation
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/utils/animations";

const ExperienceSection = () => {
  return (
    <section id="experience" className="section py-8 border-t border-muted/10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
        className="mb-6"
      >
        <h2 className="text-2xl mb-4 flex items-center">
          <span className="text-accent-teal mr-2 font-mono">03.</span>
          Experience
        </h2>
        <p className="text-lg text-muted-foreground">
          A look at my professional experience and career history.
        </p>
      </motion.div>
      
      <motion.div
        className="space-y-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {experiences.map((experience, index) => (
          <motion.div key={index} variants={fadeUp} custom={index}>
            <ExperienceCard 
              title={experience.title}
              company={experience.company}
              companyLink={experience.companyLink}
              period={experience.period}
              description={experience.description}
              achievements={experience.achievements}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
```

#### Testing

1. Test scroll animations on different devices and scroll speeds
2. Verify animations trigger at appropriate scroll positions
3. Check for any performance issues with multiple animated elements
4. Ensure animation subtlety (not too jarring or distracting)

### Staggered List Animations

#### Implementation Details

1. Create a staggered list component `src/components/ui/StaggeredList.tsx`:

```tsx
import React from "react";
import { motion } from "framer-motion";

interface StaggeredListProps {
  items: React.ReactNode[];
  delay?: number;
  staggerDelay?: number;
}

const StaggeredList: React.FC<StaggeredListProps> = ({ 
  items, 
  delay = 0.1,
  staggerDelay = 0.05
}) => {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  };
  
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="space-y-2"
    >
      {items.map((itemContent, i) => (
        <motion.li
          key={i}
          variants={item}
          className="flex items-start gap-2"
        >
          {itemContent}
        </motion.li>
      ))}
    </motion.ul>
  );
};

export default StaggeredList;
```

2. Use this component for lists in the project:

```tsx
// Example usage for achievements in ExperienceCard
<div>
  <h4 className="text-sm uppercase tracking-wider mb-2 text-muted-foreground font-medium">
    Key Achievements
  </h4>
  <StaggeredList
    items={achievements.map((achievement) => (
      <>
        <span className="text-accent-teal mt-1">→</span>
        <span>{achievement}</span>
      </>
    ))}
  />
</div>
```

#### Testing

1. Test staggered animations with varying list lengths
2. Verify animation timing looks natural
3. Check performance on slower devices
4. Ensure animations are subtle and enhance rather than distract

### Hover Interactions

#### Implementation Details

1. Create a hover effect utility for interactive elements in `src/utils/animations.ts`:

```tsx
// For use with whileHover
export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.2 }
};

export const hoverLift = {
  y: -5,
  boxShadow: "0 10px 30px -15px rgba(0,0,0,0.3)",
  transition: { duration: 0.2 }
};

export const hoverBrightness = {
  filter: "brightness(1.1)",
  transition: { duration: 0.2 }
};
```

2. Implement a button component with hover effects `src/components/ui/Button.tsx`:

```tsx
import React from "react";
import { motion } from "framer-motion";
import { hoverScale } from "@/utils/animations";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = ""
}) => {
  // Button style variants
  const variantStyles = {
    primary: "bg-accent-teal text-background-start hover:bg-accent-teal-light",
    outline: "border border-accent-teal text-accent-teal hover:bg-accent-teal/10",
    ghost: "text-accent-teal hover:bg-accent-teal/10"
  };
  
  // Button size variants
  const sizeStyles = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-4",
    lg: "py-3 px-6 text-lg"
  };
  
  const buttonClasses = `
    rounded-md font-medium transition-colors duration-200
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `;
  
  // Render as link if href is provided
  if (href) {
    return (
      <motion.a
        href={href}
        className={buttonClasses}
        whileHover={hoverScale}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.a>
    );
  }
  
  // Otherwise render as button
  return (
    <motion.button
      onClick={onClick}
      className={buttonClasses}
      whileHover={hoverScale}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;
```

3. Add a hover card component for enhanced tooltips `src/components/ui/HoverCard.tsx`:

```tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HoverCardProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

const HoverCard: React.FC<HoverCardProps> = ({
  trigger,
  content,
  side = "top",
  align = "center",
  sideOffset = 8
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Position calculations based on side and align
  const getPosition = () => {
    let position: any = {};
    
    switch (side) {
      case "top":
        position.bottom = "100%";
        position.marginBottom = sideOffset;
        break;
      case "right":
        position.left = "100%";
        position.marginLeft = sideOffset;
        break;
      case "bottom":
        position.top = "100%";
        position.marginTop = sideOffset;
        break;
      case "left":
        position.right = "100%";
        position.marginRight = sideOffset;
        break;
    }
    
    switch (align) {
      case "start":
        if (side === "top" || side === "bottom") position.left = 0;
        if (side === "left" || side === "right") position.top = 0;
        break;
      case "center":
        if (side === "top" || side === "bottom") {
          position.left = "50%";
          position.transform = "translateX(-50%)";
        }
        if (side === "left" || side === "right") {
          position.top = "50%";
          position.transform = "translateY(-50%)";
        }
        break;
      case "end":
        if (side === "top" || side === "bottom") position.right = 0;
        if (side === "left" || side === "right") position.bottom = 0;
        break;
    }
    
    return position;
  };
  
  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger Element */}
      {trigger}
      
      {/* Hover Card Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-50 min-w-[220px] p-4 rounded-md bg-background-start border border-border/40 shadow-lg"
            style={getPosition()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HoverCard;
```

#### Testing

1. Test button hover and tap animations
2. Verify hover card positioning in different alignments
3. Check touchscreen device behavior
4. Ensure hover effects are responsive and work across browsers

## Visual Interest & Personality

### Decorative Elements

#### Implementation Details

1. Create SVG decorative components in `src/components/ui/decorative/`:

```tsx
// src/components/ui/decorative/CornerAccent.tsx
import React from "react";
import { motion } from "framer-motion";

interface CornerAccentProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  color?: string;
  size?: number;
  className?: string;
}

const CornerAccent: React.FC<CornerAccentProps> = ({
  position = "top-right",
  color = "hsl(var(--accent-teal))",
  size = 120,
  className = ""
}) => {
  // Position styles
  const positionStyles: { [key: string]: string } = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0"
  };
  
  // Transform based on position
  const getTransform = () => {
    switch (position) {
      case "top-left": return "rotate(180deg)";
      case "top-right": return "rotate(270deg)";
      case "bottom-left": return "rotate(90deg)";
      case "bottom-right": return "rotate(0deg)";
    }
  };
  
  return (
    <div 
      className={`absolute ${positionStyles[position]} pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: getTransform() }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <path
          d="M0 0L120 0L120 20C120 75.2285 75.2285 120 20 120L0 120L0 0Z"
          fill={color}
          fillOpacity="0.3"
        />
        <path
          d="M0 0L70 0L70 10C70 43.1371 43.1371 70 10 70L0 70L0 0Z"
          fill={color}
          fillOpacity="0.6"
        />
      </motion.svg>
    </div>
  );
};

export default CornerAccent;
```

```tsx
// src/components/ui/decorative/BackgroundCircles.tsx
import React from "react";
import { motion } from "framer-motion";

interface BackgroundCirclesProps {
  className?: string;
}

const BackgroundCircles: React.FC<BackgroundCirclesProps> = ({ className = "" }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent-teal/5 blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className="absolute bottom-40 -left-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-accent-secondary/5 blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      />
    </div>
  );
};

export default BackgroundCircles;
```

2. Add a section divider component:

```tsx
// src/components/ui/SectionDivider.tsx
import React from "react";
import { motion } from "framer-motion";

interface SectionDividerProps {
  className?: string;
}

const SectionDivider: React.FC<SectionDividerProps> = ({ className = "" }) => {
  return (
    <div className={`w-full h-px bg-transparent relative my-10 ${className}`}>
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/20 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />
    </div>
  );
};

export default SectionDivider;
```

3. Use these decorative elements in the layout:

```tsx
// Example page layout with decorative elements
import CornerAccent from "@/components/ui/decorative/CornerAccent";
import BackgroundCircles from "@/components/ui/decorative/BackgroundCircles";
import SectionDivider from "@/components/ui/SectionDivider";

const Index = () => {
  return (
    <Layout>
      {/* Background Elements */}
      <BackgroundCircles className="opacity-30" />
      <CornerAccent position="top-right" size={150} />
      <CornerAccent position="bottom-left" size={150} />
      
      {/* Hero Section */}
      <section id="hero">
        {/* Hero content */}
      </section>
      
      <SectionDivider />
      
      {/* About Section */}
      <section id="about">
        {/* About content */}
      </section>
      
      {/* Other sections... */}
    </Layout>
  );
};
```

#### Testing

1. Verify decorative elements are properly positioned
2. Check visibility across various viewport sizes
3. Ensure decorative elements don't interfere with content
4. Test animations on slower devices

### Microinteractions

#### Implementation Details

1. Add a text reveal animation component:

```tsx
// src/components/ui/TextReveal.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
  once?: boolean;
}

const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = "",
  once = true
}) => {
  // Split text into characters for animation
  const characters = text.split("");
  
  // Container and character animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.2 * i }
    })
  };
  
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };
  
  return (
    <motion.div
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block"
        >
          {char === " " ? <span>&nbsp;</span> : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default TextReveal;
```

2. Add a cursor tracking component:

```tsx
// src/components/ui/CursorGlow.tsx
import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CursorGlow: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Motion values for cursor position
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Add spring physics for smooth movement
  const springConfig = { damping: 30, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    
    // Add event listeners
    window.addEventListener("mousemove", moveCursor);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);
  
  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none mix-blend-screen z-50"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: "-50%",
        translateY: "-50%",
        background: "radial-gradient(circle, hsla(var(--accent-teal), 0.5) 0%, transparent 70%)",
        opacity: isVisible ? 0.3 : 0
      }}
    />
  );
};

export default CursorGlow;
```

3. Add selection styling to `src/index.css`:

```css
/* Custom text selection */
::selection {
  background-color: hsla(var(--accent-teal), 0.3);
  color: white;
}

/* Scrollbar styling (for browsers that support it) */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: hsla(var(--background-start), 0.8);
}

::-webkit-scrollbar-thumb {
  background: hsla(var(--muted), 0.4);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsla(var(--accent-teal), 0.4);
}
```

4. Implement the cursor glow effect in the layout:

```tsx
// Add to Layout.tsx
import CursorGlow from "@/components/ui/CursorGlow";

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-navy text-white">
      {/* Optional cursor effect - only on desktop */}
      <div className="hidden md:block">
        <CursorGlow />
      </div>
      
      <Navbar />
      {/* Rest of layout */}
    </div>
  );
};
```

#### Testing

1. Test text reveal animation in different sections
2. Verify cursor glow effect works smoothly (desktop only)
3. Check selection styling and scrollbar customization 
4. Ensure microinteractions are subtle and enhance UX

## Mobile Optimization

### Mobile Navigation

#### Implementation Details

1. Enhance the mobile menu in `src/components/layout/Navbar.tsx`:

```tsx
// Enhanced mobile menu slide-out animation
const mobileMenuVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  closed: {
    x: "100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

// Inside Navbar component
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// Add body scroll lock when mobile menu is open
useEffect(() => {
  if (mobileMenuOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
  
  return () => {
    document.body.style.overflow = "";
  };
}, [mobileMenuOpen]);

// Mobile menu component
<motion.div
  className="md:hidden fixed inset-0 z-40 bg-background-start/95 backdrop-blur-md"
  initial="closed"
  animate={mobileMenuOpen ? "open" : "closed"}
  variants={mobileMenuVariants}
>
  <div className="flex flex-col h-full justify-center items-center py-20 space-y-8">
    <div className="absolute top-6 right-6">
      <button
        onClick={() => setMobileMenuOpen(false)}
        aria-label="Close menu"
        className="text-muted-foreground hover:text-white transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    
    {/* Mobile nav links with staggered animation */}
    <motion.div
      className="flex flex-col items-center space-y-8"
      variants={{
        open: {
          transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        },
        closed: {
          transition: { staggerChildren: 0.05, staggerDirection: -1 }
        }
      }}
    >
      <MobileNavLink href="#about" number="01" label="About" onClick={() => setMobileMenuOpen(false)} />
      <MobileNavLink href="#experience" number="02" label="Experience" onClick={() => setMobileMenuOpen(false)} />
      <MobileNavLink href="#articles" number="03" label="Articles" onClick={() => setMobileMenuOpen(false)} />
      <MobileNavLink href="#talks" number="04" label="Talks" onClick={() => setMobileMenuOpen(false)} />
      <Link
        to="/photography"
        className="text-xl text-muted-foreground hover:text-white transition-colors"
        onClick={() => setMobileMenuOpen(false)}
      >
        Photography
      </Link>
    </motion.div>
    
    {/* Social links in mobile menu */}
    <motion.div 
      className="mt-10 flex items-center space-x-6"
      variants={{
        open: { opacity: 1, y: 0, transition: { delay: 0.4 } },
        closed: { opacity: 0, y: 20 }
      }}
    >
      <SocialLinks horizontal={true} />
    </motion.div>
  </div>
</motion.div>
```

2. Add a floating action button for mobile navigation:

```tsx
// src/components/mobile/FloatingNav.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const FloatingNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Track scroll position to show/hide button
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <div className="md:hidden fixed bottom-6 right-6 z-40">
      {/* Quick scroll to top button */}
      <AnimatePresence>
        {isScrolled && !isOpen && (
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-accent-teal/90 backdrop-blur-sm text-background-start rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m18 15-6-6-6 6"/>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Navigation menu toggler */}
      <AnimatePresence>
        {!isOpen && !isScrolled && (
          <motion.button
            onClick={() => setIsOpen(true)}
            className="bg-accent-teal/90 backdrop-blur-sm text-background-start rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Floating menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 bg-background-start/90 backdrop-blur-md rounded-lg shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20, width: 0, height: 0 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              width: "auto", 
              height: "auto", 
              transition: { duration: 0.3 } 
            }}
            exit={{ opacity: 0, y: 20, width: 0, height: 0 }}
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-muted-foreground p-1"
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            {/* Navigation items */}
            <div className="py-4 px-6 space-y-3">
              <FloatingNavLink href="#about" label="About" onClick={() => setIsOpen(false)} />
              <FloatingNavLink href="#experience" label="Experience" onClick={() => setIsOpen(false)} />
              <FloatingNavLink href="#articles" label="Articles" onClick={() => setIsOpen(false)} />
              <FloatingNavLink href="#talks" label="Talks" onClick={() => setIsOpen(false)} />
              <FloatingNavLink href="#top" label="Back to Top" onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setIsOpen(false);
              }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Floating nav link component
const FloatingNavLink: React.FC<{ 
  href: string; 
  label: string; 
  onClick: () => void 
}> = ({ href, label, onClick }) => {
  return (
    <a
      href={href}
      className="block py-2 text-muted-foreground hover:text-white transition-colors"
      onClick={(e) => {
        if (href === "#top") {
          e.preventDefault();
        }
        onClick();
      }}
    >
      {label}
    </a>
  );
};

export default FloatingNav;
```

3. Add this component to the Layout:

```tsx
// Inside Layout.tsx
import FloatingNav from "@/components/mobile/FloatingNav";

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-navy text-white">
      <Navbar />
      
      {/* Main content */}
      <main>{children}</main>
      
      <Footer />
      
      {/* Mobile floating navigation */}
      <FloatingNav />
    </div>
  );
};
```

#### Testing

1. Test mobile menu open/close animations
2. Verify scroll locking when mobile menu is open
3. Check floating action button visibility and functionality
4. Test navigation on various mobile devices and screen sizes

### Responsive Refinements

#### Implementation Details

1. Add mobile-specific optimizations to `src/index.css`:

```css
/* Mobile font size adjustments */
@media (max-width: 640px) {
  html {
    font-size: 14px;
  }
  
  h1, .h1 {
    font-size: 2.5rem;
  }
  
  h2, .h2 {
    font-size: 2rem;
  }
}

/* Touch target size improvements */
@media (max-width: 640px) {
  button, 
  a.btn,
  .nav-link,
  .touch-target {
    min-height: 44px;
    min-width: 44px;
    padding: 0.5rem 1rem;
  }
}

/* Mobile-specific spacing */
@media (max-width: 640px) {
  .section {
    padding-top: var(--space-6);
    padding-bottom: var(--space-6);
  }
  
  .container {
    padding-left: var(--space-4);
    padding-right: var(--space-4);
  }
}

/* Reduce animation on smaller devices for better performance */
@media (max-width: 640px) {
  .reduce-motion {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
  }
}
```

2. Add a hook to detect touch devices:

```tsx
// src/hooks/useIsTouchDevice.ts
import { useState, useEffect } from 'react';

const useIsTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  useEffect(() => {
    const detectTouch = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
      );
    };
    
    setIsTouchDevice(detectTouch());
  }, []);
  
  return isTouchDevice;
};

export default useIsTouchDevice;
```

3. Use this hook to conditionally apply hover effects:

```tsx
// Example usage in a component
import useIsTouchDevice from '@/hooks/useIsTouchDevice';

const SomeComponent = () => {
  const isTouchDevice = useIsTouchDevice();
  
  return (
    <motion.div
      whileHover={!isTouchDevice ? { scale: 1.05 } : {}}
      className={isTouchDevice ? 'reduce-motion' : ''}
    >
      {/* Content */}
    </motion.div>
  );
};
```

4. Add specific tweaks for touch devices in key components:

```tsx
// Example: HoverCard.tsx adjusted for touch devices
import useIsTouchDevice from '@/hooks/useIsTouchDevice';

const HoverCard: React.FC<HoverCardProps> = ({
  trigger,
  content,
  side = "top",
  align = "center",
  sideOffset = 8
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isTouchDevice = useIsTouchDevice();
  
  // Use touch events for mobile devices
  const touchableProps = isTouchDevice 
    ? {
        onClick: () => setIsOpen(!isOpen),
      }
    : {
        onMouseEnter: () => setIsOpen(true),
        onMouseLeave: () => setIsOpen(false),
      };
  
  return (
    <div
      className="relative inline-block"
      {...touchableProps}
    >
      {/* Component content */}
    </div>
  );
};
```

#### Testing

1. Test responsive design on multiple device sizes
2. Verify touch targets are sufficiently large (min 44x44px)
3. Check reduced animation behavior on mobile devices
4. Ensure hover effects are appropriately adapted for touch

## Performance & Polishing

### Image Optimization

#### Implementation Details

1. Create an optimized image component:

```tsx
// src/components/ui/OptimizedImage.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: "lazy" | "eager";
  placeholder?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
  loading = "lazy",
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3C/svg%3E"
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(placeholder);
  
  useEffect(() => {
    // Create new image object to preload
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
  }, [src]);
  
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: width && height ? width / height : 'auto' }}>
      {/* Placeholder or blurred version */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted/20 animate-pulse" />
      )}
      
      {/* Actual image */}
      <motion.img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

export default OptimizedImage;
```

2. Use this component for all images:

```tsx
// Example usage in ArticleCard
<div className="relative h-48 overflow-hidden">
  <OptimizedImage
    src={image}
    alt={title}
    className="w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-background-start to-transparent opacity-60 z-10 group-hover:opacity-40 transition-opacity duration-300"></div>
</div>
```

3. Add responsive image loading based on screen size:

```tsx
// Helper function to generate responsive image URLs
// src/utils/imageUtils.ts
export const getResponsiveImageUrl = (
  imageUrl: string,
  width: number
): string => {
  // If it's a local asset, handle differently than remote URLs
  if (imageUrl.startsWith('/') || imageUrl.startsWith('./')) {
    return imageUrl; // Local assets are handled by build tools
  }
  
  // For Unsplash images
  if (imageUrl.includes('unsplash.com')) {
    return `${imageUrl}?w=${width}&q=80&auto=format`;
  }
  
  // Default case
  return imageUrl;
};

// Usage in component
<OptimizedImage
  src={getResponsiveImageUrl(image, 800)}
  alt={title}
  className="w-full h-full object-cover"
/>
```

#### Testing

1. Test image loading with network throttling enabled
2. Verify placeholder appearance during image load
3. Check responsive image sizing across devices
4. Confirm lazy loading works for off-screen images

### Final Review

#### Implementation Details

1. Create a performance audit utility:

```tsx
// src/utils/performance.ts
export const measurePerformance = (componentName: string) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    console.log(`[Performance] ${componentName} rendered in ${endTime - startTime}ms`);
  };
};

// Usage in a component
const Component = () => {
  useEffect(() => {
    const done = measurePerformance('MyComponent');
    return done;
  }, []);
  
  // Component code
};
```

2. Add a final accessibility check helper:

```tsx
// src/utils/a11y.ts
export const checkAccessibility = (element: HTMLElement): string[] => {
  const issues: string[] = [];
  
  // Check for common accessibility issues
  const images = element.querySelectorAll('img');
  images.forEach(img => {
    if (!img.alt) {
      issues.push(`Image missing alt text: ${img.src}`);
    }
  });
  
  const buttons = element.querySelectorAll('button');
  buttons.forEach(button => {
    if (!button.textContent && !button.getAttribute('aria-label')) {
      issues.push('Button without text or aria-label found');
    }
  });
  
  // More checks can be added as needed
  
  return issues;
};

// Usage in development mode
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('load', () => {
    const issues = checkAccessibility(document.body);
    if (issues.length > 0) {
      console.warn('Accessibility issues found:', issues);
    }
  });
}
```

3. Add a final pre-deployment checklist to README.md:

```markdown
## Pre-Deployment Checklist

- [ ] All images have proper alt text
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus states are visible for keyboard navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Site works with JavaScript disabled (where possible)
- [ ] Responsive design works on all target device sizes
- [ ] Performance optimization completed
- [ ] Favicon and meta tags are properly set
- [ ] 404 page is properly configured
- [ ] No console errors or warnings
```

#### Testing

1. Run Lighthouse audit and fix issues
2. Test keyboard navigation through the entire site
3. Check site with reduced motion preferences enabled
4. Verify all performance optimizations are working

## Visual References

This section provides visual examples of the key components after implementation. Use these as a reference when developing the components.

### Design System Examples

| Component | Description | Link to Reference |
|-----------|-------------|-------------------|
| Color System | Color palette and usage examples | [View Design System](https://www.figma.com/file/portfolio-design-system) |
| Typography | Font styles and hierarchy | [View Typography](https://www.figma.com/file/portfolio-typography) |

### Key Component Visuals

| Component | Description | Expected Appearance |
|-----------|-------------|---------------------|
| Hero Section | Main introduction area | ![Hero Section](https://example.com/portfolio/hero.png) |
| Experience Card | Card showing work experience | ![Experience Card](https://example.com/portfolio/experience-card.png) |
| Article Card | Card showing article or project | ![Article Card](https://example.com/portfolio/article-card.png) |
| Mobile Navigation | Mobile menu and navigation | ![Mobile Navigation](https://example.com/portfolio/mobile-nav.png) |

### Animation References

For reference animations, see the following examples:

- [Scroll Animations Example](https://example.com/scroll-animations)
- [Hover Effects Example](https://example.com/hover-effects)
- [Text Reveal Animation](https://example.com/text-reveal)

## Pre-Implementation Checklist

This checklist tracks the preparation and implementation status:

### Environment Setup

- [x] React 18+ with TypeScript configured
- [x] TailwindCSS installed and configured
- [x] Framer Motion library installed
- [x] ESLint and Prettier configured for code quality
- [ ] Testing framework set up (optional but recommended)

### Content Preparation

- [x] All portfolio content collected and organized
- [x] High-quality images prepared and optimized
- [x] Professional bio and experience details finalized
- [x] Project descriptions and links confirmed

### Design Assets

- [x] Color palette defined
- [x] Typography selections finalized
- [x] Icons and decorative elements prepared
- [x] Mockups or wireframes reviewed

### Technical Requirements

- [x] Browser compatibility requirements defined
- [x] Performance benchmarks established
- [x] Accessibility requirements documented
- [x] Mobile device support specified

### Project Management

- [x] Implementation timeline established
- [x] Milestones defined
- [x] Testing plan created
- [x] Deployment strategy confirmed

### Current Implementation Progress

- [x] Design System Foundation
- [x] Layout Improvements
- [x] Component Enhancements
- [x] Navigation & Header
- [ ] Animation System (In Progress)
- [ ] Visual Interest & Personality
- [ ] Mobile Optimization
- [ ] Performance & Polishing

## Common Issues & Troubleshooting

This section covers common issues and troubleshooting steps for the portfolio site.

### 1. Image Loading Issues

If images are not loading properly, check the following:
- Ensure image URLs are correct
- Verify image formats are supported
- Check network connection and try again

### 2. Mobile Menu Not Responding

If the mobile menu is not working as expected, try the following:
- Refresh the page
- Clear browser cache
- Check for JavaScript errors in the console

### 3. Performance Bottlenecks

If the site feels slow, consider the following:
- Optimize images
- Minimize network requests
- Use lazy loading for components

### 4. Accessibility Issues

If the site is not accessible, check the following:
- Ensure all images have alt text
- Verify color contrast meets WCAG AA standards
- Test keyboard navigation

### 5. Dynamic Metadata Fetching Issues

If LinkedIn article metadata is not loading properly, check the following:
- Ensure the API endpoint is correctly set up in `/api/metadata.ts`
- Verify that necessary dependencies (axios, cheerio) are installed
- Check if the article URL is accessible and contains Open Graph metadata
- Look for CORS errors in the console
- For LinkedIn articles specifically, try using a user agent that mimics the LinkedIn bot
- If a specific article is problematic, provide fallback data in the article object:
  ```ts
  {
    id: 1,
    date: "January 2024",
    link: "https://www.linkedin.com/pulse/example",
    isDynamicContent: true,
    // Fallback values if metadata fetching fails
    title: "Fallback Title",
    description: "Fallback description text",
    image: "/fallback-image.jpg"
  }
  ```
- For production use, consider implementing caching of metadata to reduce API calls

## Glossary of Terms

This section provides definitions for key terms used in the portfolio site.

- **Hero Section**: The main introduction to the portfolio site.
- **Experience Cards**: Components that display professional experience.
- **Article Cards**: Components that display articles or portfolio items.
- **Talks Section**: A section where talks or presentations are showcased.
- **Navbar**: The main navigation bar for the site with scroll progress indicator.
- **Side Navigation**: A secondary navigation menu on the left side for desktop devices.
- **Mobile Menu**: Full-screen navigation menu for mobile devices.
- **Scroll Progress Indicator**: Teal line in the navbar that grows as the user scrolls down the page.
- **Animation Variants**: Reusable animation configurations defined in utils/animation.ts.
- **Staggered Animations**: Sequential animations applied to lists where items animate one after another.
- **Intersection Observer**: Browser API used to trigger animations when elements enter the viewport.
- **Reduced Motion**: Accessibility feature that respects user preference for reduced animation.
- **Visual Interest & Personality**: Elements added to enhance the site's visual appeal.
- **Mobile Optimization**: Techniques used to optimize the site for mobile devices.
- **Performance & Polishing**: Steps taken to improve site performance and aesthetics.
- **Dynamic Metadata**: Information automatically extracted from linked content, like titles and images from LinkedIn articles.

## Code Cleanup and Optimization

This section outlines the comprehensive plan for cleaning up the codebase, removing unused components, and optimizing the project structure after all feature implementations are complete.

### Unused Code Removal

#### Photography-Related Elements

- **Components**:
  - Remove `src/components/photography/PhotoGallery.tsx`
  - Remove any photography-related UI components

- **Pages**:
  - Remove `src/pages/Photography.tsx`

- **Data Files**:
  - Remove `src/data/photoData.ts`

- **Types**:
  - Remove any photography-related types in `src/types/`

#### Test Components

- Remove `src/components/work/LinkedInContentTest.tsx`
- Remove `src/pages/linkedin-test.tsx`

#### Deployment Scripts

- Consolidate deployment scripts into a single, well-documented file
- Remove redundant files:
  - `deploy.sh`
  - `deploy.bat`
  - `build-and-deploy.sh`
  - `build-and-deploy.bat`
- Update or remove outdated `DEPLOYMENT.md`

### Code Quality Improvements

#### Unused Imports and Variables

- Use ESLint with the "no-unused-vars" and "no-unused-imports" rules
- Remove unused imports across all files
- Convert type-only imports to `import type` syntax
- Remove variables that are defined but never used

#### Dead Code Elimination

- Remove commented-out code sections
- Eliminate unreachable code blocks
- Remove redundant null checks or unnecessary conditions

#### Style and Format Consistency

- Ensure consistent indentation and formatting
- Apply naming conventions consistently
- Use Prettier for automatic formatting

#### Console Logs and Debug Code

- Remove all `console.log` statements not needed for production
- Remove debugging code and temporary workarounds

#### Performance Optimizations

- Look for expensive operations that could be memoized
- Optimize React components with `useMemo` and `useCallback` where appropriate
- Identify and optimize render performance bottlenecks

### Implementation Process

#### Phase 1: Analysis and Inventory

1. Create a complete inventory of unused files, components, and code sections
2. Document dependencies between components before removal
3. Set up linting rules to identify unused variables and imports
4. Run a complete build to ensure current state works

#### Phase 2: Non-destructive Cleanup

1. Remove obvious unused files (photography, LinkedIn test)
2. Clean up imports and unused variables
3. Remove console logs and debug code
4. Run tests after each significant change to ensure functionality

#### Phase 3: Refactoring and Optimization

1. Consolidate similar functions and components
2. Improve type definitions
3. Optimize performance-critical sections
4. Update documentation to reflect changes

#### Phase 4: Deployment Simplification

1. Consolidate deployment scripts
2. Update documentation
3. Ensure build process is streamlined

#### Phase 5: Validation

1. Complete test of the application
2. Verify build size reduction
3. Document code improvements and optimizations

### Benefits

- **Improved Performance**: Reduced bundle size and faster loading
- **Better Maintainability**: Cleaner codebase is easier to understand and extend
- **Enhanced Developer Experience**: Simpler navigation and faster build times
- **Reduced Technical Debt**: Eliminate deprecated or unused code before it becomes problematic
- **Improved Build Times**: Faster compilation and deployment processes