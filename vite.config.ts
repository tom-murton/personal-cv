import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      // Enable fast refresh for better developer experience
      devTarget: "es2022"
    }),
    mode === 'development' && componentTagger(),
    // Generate bundle visualization in stats.html
    mode === 'production' && visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
    // Add PWA capabilities for better offline experience
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Tom Murton — Projects, writing and talks',
        short_name: 'Tom Murton',
        description: 'Projects, writing and talks from product lead and solo builder Tom Murton.',
        theme_color: '#0d0e12',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Performance optimizations
  build: {
    // Target modern browsers for smaller bundle size
    target: 'es2020',
    // Minify output for production
    minify: 'terser',
    // Configure Terser for better optimization
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true, // Remove debugger statements
      },
      format: {
        comments: false, // Remove comments
      },
    },
    // Generate source maps for better debugging
    sourcemap: mode !== 'production',
    // Ensure output directory is cleaned before build
    emptyOutDir: true,
    // Optimize chunks for better loading
    cssCodeSplit: true,
    // Increase chunk size warning limit for larger dependencies
    chunkSizeWarningLimit: 1200,
    // Optimize Rollup options
    rollupOptions: {
      output: {
        // Ensure assets are hashed for better caching
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        // Optimize chunking strategy
        manualChunks: (id) => {
          // Create chunking strategy based on common dependencies
          if (id.includes('node_modules')) {
            // Core React libraries
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'vendor-react';
            }
            
            // Routing libraries
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            
            // Animation libraries
            if (id.includes('framer-motion')) {
              return 'vendor-animation';
            }
            
            // UI Components
            if (id.includes('@radix-ui')) {
              return 'vendor-ui';
            }
            
            // Utility libraries
            if (id.includes('lodash') || 
                id.includes('date-fns') || 
                id.includes('clsx') ||
                id.includes('tailwind')) {
              return 'vendor-utils';
            }
            
            // All other node_modules
            return 'vendor';
          }
        }
      }
    },
    // Copy assets properly
    assetsDir: 'assets',
    // Ensure commonjs modules are handled correctly
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  // Optimize deps for faster dev server startup
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'framer-motion',
      'lucide-react'
    ],
    exclude: []
  },
  // Enable asset preload and better caching
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  }
}));
