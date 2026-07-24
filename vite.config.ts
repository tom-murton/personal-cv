import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

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
    // Keep generated asset names cache-safe.
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
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
      'react-router',
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
