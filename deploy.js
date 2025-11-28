import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const distDir = path.join(__dirname, 'dist');
const apiDir = path.join(__dirname, 'api');
const htaccessFile = path.join(__dirname, '.htaccess');
const uploadsDir = path.join(__dirname, 'uploads');
const sanityCorsFile = path.join(__dirname, 'SANITY_CORS_SETUP.md');
const schemaUpdateGuidePath = path.join(__dirname, 'SANITY_SCHEMA_UPDATE.md');

// Helper function to recursively copy directories
async function copyDir(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      await copyDir(srcPath, destPath);
    } else {
      // Copy files
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Helper function to display debug information about the build
function debugBuildInfo() {
  console.log('\n🔍 DEBUG INFO:');
  
  // Check if dist folder exists and list its contents
  if (fs.existsSync(distDir)) {
    console.log(`✅ dist folder exists at: ${distDir}`);
    console.log('Contents of dist folder:');
    listDirectoryContents(distDir);
  } else {
    console.log('❌ dist folder does not exist!');
  }
  
  // Check Vite config
  try {
    const viteConfigPath = path.join(__dirname, 'vite.config.ts');
    if (fs.existsSync(viteConfigPath)) {
      console.log(`✅ vite.config.ts exists`);
      const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
      console.log('Vite external configuration:', 
        viteConfig.includes('external:') ? 'Found' : 'Not found');
    } else {
      console.log('❌ vite.config.ts not found!');
    }
  } catch (err) {
    console.log('Error checking vite config:', err.message);
  }
  
  // Check if Sanity packages are installed
  try {
    const packageJsonPath = path.join(__dirname, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      console.log('Sanity packages in dependencies:',
        packageJson.dependencies['@sanity/client'] ? '✅ @sanity/client found' : '❌ @sanity/client missing',
        packageJson.dependencies['@sanity/image-url'] ? '✅ @sanity/image-url found' : '❌ @sanity/image-url missing');
    }
  } catch (err) {
    console.log('Error checking package.json:', err.message);
  }
}

// Helper function to list directory contents recursively for debugging
function listDirectoryContents(dir, depth = 0, maxDepth = 2) {
  if (depth > maxDepth) return;
  
  const indent = '  '.repeat(depth);
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    if (item.name.startsWith('.')) continue; // Skip hidden files
    
    console.log(`${indent}${item.isDirectory() ? '📁' : '📄'} ${item.name}`);
    
    if (item.isDirectory()) {
      listDirectoryContents(path.join(dir, item.name), depth + 1, maxDepth);
    }
  }
}

async function deploy() {
  try {
    console.log('🚀 Starting deployment preparation...');
    
    // Clean the dist directory if it exists
    if (fs.existsSync(distDir)) {
      console.log('🧹 Cleaning existing dist directory...');
      fs.rmSync(distDir, { recursive: true, force: true });
    }
    
    // Skip the installation of Sanity packages - we'll let Vite handle it
    console.log('📦 Skipping separate Sanity package installation (handled by build)...');
    
    // Build the project with better error handling
    console.log('🏗️ Building project...');
    try {
      // Use a direct build command with Vite instead of npm script
      execSync('vite build', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Build process failed!');
      console.error(error.message);
      
      // Display debug information
      debugBuildInfo();
      
      // Try alternative build command as fallback
      console.log('🔄 Trying alternative build approach...');
      try {
        // Use NODE_ENV to help with build configuration
        execSync('NODE_ENV=production VITE_EXTERNAL_SANITY=true vite build', { stdio: 'inherit' });
      } catch (fallbackError) {
        console.error('❌ Alternative build also failed:', fallbackError.message);
        debugBuildInfo();
        throw new Error('Build process failed after multiple attempts');
      }
    }
    
    // Copy external script to load Sanity client properly
    console.log('📄 Creating Sanity client loading script...');
    const sanityLoaderScript = `
// Sanity client loader
(function() {
  try {
    // Check if we need to load from CDN
    if (typeof window.SanityClient === 'undefined') {
      console.log('Loading Sanity client from CDN...');
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@sanity/client@6.7.1/dist/index.browser.min.js';
      script.onload = function() {
        console.log('Sanity client loaded successfully from CDN');
        // Create global for easier access
        window.SanityClient = window.sanityClient;
      };
      script.onerror = function() {
        console.error('Failed to load Sanity client from CDN');
      };
      document.head.appendChild(script);
      
      // Also load image URL builder
      const imageScript = document.createElement('script');
      imageScript.src = 'https://cdn.jsdelivr.net/npm/@sanity/image-url@1.1.0/lib/browser/index.min.js';
      imageScript.onload = function() {
        console.log('Sanity image-url loaded successfully from CDN');
      };
      document.head.appendChild(imageScript);
    }
  } catch (e) {
    console.error('Error initializing Sanity client:', e);
  }
})();
`;
    
    // Create the script file in the dist directory
    fs.writeFileSync(path.join(distDir, 'sanity-loader.js'), sanityLoaderScript);
    
    // Modify index.html to include the loader script
    const indexHtmlPath = path.join(distDir, 'index.html');
    if (fs.existsSync(indexHtmlPath)) {
      let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
      
      // Add the Sanity loader script before the main script
      if (!indexHtml.includes('sanity-loader.js')) {
        indexHtml = indexHtml.replace(
          '<script type="module" src="/src/main.tsx"></script>',
          '<script src="./sanity-loader.js"></script>\n    <script type="module" src="/src/main.tsx"></script>'
        );
        fs.writeFileSync(indexHtmlPath, indexHtml);
      }
    }
    
    // Verify that the build was successful
    if (!fs.existsSync(distDir) || !fs.existsSync(path.join(distDir, 'index.html'))) {
      console.error('❌ Build output verification failed - dist directory or index.html missing!');
      debugBuildInfo();
      throw new Error('Build verification failed');
    }
    
    // Copy API folder to dist
    if (fs.existsSync(apiDir)) {
      console.log('📋 Copying API folder...');
      await copyDir(apiDir, path.join(distDir, 'api'));
    } else {
      console.warn('⚠️ Warning: API directory not found at', apiDir);
      // Create empty api directory structure
      console.log('📁 Creating empty API folder structure in dist...');
      fs.mkdirSync(path.join(distDir, 'api'), { recursive: true });
    }

    // Copy .htaccess to dist - CRITICAL FOR PAGE ROUTING
    if (fs.existsSync(htaccessFile)) {
      console.log('📋 Copying root .htaccess file (CRITICAL for page routing)...');
      fs.copyFileSync(htaccessFile, path.join(distDir, '.htaccess'));
      console.log('✅ .htaccess copied successfully - this fixes page refresh 404 errors');
    } else {
      console.warn('⚠️ Warning: .htaccess file not found at', htaccessFile);
      // Create a basic .htaccess file
      console.log('📄 Creating basic .htaccess file for SPA routing...');
      const htaccessContent = `
# Enable URL rewriting
RewriteEngine On

# Handle requests for non-existent files or directories
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]

# Set caching for static assets
<FilesMatch "\\.(js|css)$">
  Header set Cache-Control "max-age=31536000, public"
</FilesMatch>

# Disable directory listing
Options -Indexes
`;
      fs.writeFileSync(path.join(distDir, '.htaccess'), htaccessContent);
      console.log('✅ Basic .htaccess created - this should fix page refresh 404 errors');
    }

    // Copy uploads folder if it exists
    if (fs.existsSync(uploadsDir)) {
      console.log('📋 Copying uploads folder...');
      await copyDir(uploadsDir, path.join(distDir, 'uploads'));
    } else {
      // Create uploads directory in dist
      console.log('📁 Creating uploads folder in dist...');
      fs.mkdirSync(path.join(distDir, 'uploads'), { recursive: true });
      
      // Copy uploads .htaccess if it exists
      if (fs.existsSync(path.join(__dirname, 'uploads/.htaccess'))) {
        fs.copyFileSync(
          path.join(__dirname, 'uploads/.htaccess'), 
          path.join(distDir, 'uploads/.htaccess')
        );
      }
    }

    // Copy Sanity CORS setup guide
    if (fs.existsSync(sanityCorsFile)) {
      console.log('📋 Copying Sanity CORS setup guide...');
      fs.copyFileSync(sanityCorsFile, path.join(distDir, 'SANITY_CORS_SETUP.md'));
    }

    // Copy the new Sanity schema update guide
    if (fs.existsSync(schemaUpdateGuidePath)) {
      console.log('📋 Copying Sanity schema update guide...');
      fs.copyFileSync(schemaUpdateGuidePath, path.join(distDir, 'SANITY_SCHEMA_UPDATE.md'));
    }

    // Copy DEPLOYMENT.md to dist
    const deploymentMdPath = path.join(__dirname, 'DEPLOYMENT.md');
    if (fs.existsSync(deploymentMdPath)) {
      console.log('📋 Copying deployment instructions...');
      fs.copyFileSync(deploymentMdPath, path.join(distDir, 'DEPLOYMENT.md'));
    }

    // Create data directory in dist
    console.log('📁 Creating data folder in dist...');
    fs.mkdirSync(path.join(distDir, 'data'), { recursive: true });

    // Create a production env file in dist for Sanity config
    console.log('📄 Creating production environment settings...');
    const envContent = `
# Sanity Configuration
SANITY_PROJECT_ID=aw2sgwa9
SANITY_DATASET=production
SANITY_API_VERSION=2023-05-03
`;
    fs.writeFileSync(path.join(distDir, '.env'), envContent);

    // Final verification of the dist directory contents
    console.log('\n🔍 Verifying deployment package...');
    const hasIndexHtml = fs.existsSync(path.join(distDir, 'index.html'));
    const hasAssetsFolder = fs.existsSync(path.join(distDir, 'assets')) || 
                           fs.existsSync(path.join(distDir, 'static'));
    
    if (!hasIndexHtml || !hasAssetsFolder) {
      console.warn('⚠️ Warning: Deployment package may be incomplete!');
      console.log(`  - index.html: ${hasIndexHtml ? '✅ Found' : '❌ Missing'}`);
      console.log(`  - assets/static: ${hasAssetsFolder ? '✅ Found' : '❌ Missing'}`);
      debugBuildInfo();
    } else {
      console.log('✅ Deployment package looks complete!');
    }

    console.log('\n✅ Deployment package prepared successfully!');
    console.log('📂 Upload all contents of the "dist" folder to your Namecheap hosting via cPanel.');
    console.log('\n📌 DEPLOYMENT TIPS:');
    console.log('1. In cPanel, use File Manager to navigate to your website\'s root directory');
    console.log('2. Upload all files from the "dist" folder to this directory');
    console.log('3. Make sure to set proper permissions (755 for folders, 644 for files)');
    console.log('4. IMPORTANT: The .htaccess file is CRITICAL for page routing - make sure it\'s uploaded');
    console.log('5. Remember to update your Sanity schema (see SANITY_SCHEMA_UPDATE.md)');
    console.log('\n🔐 Important: Configure CORS in Sanity to allow your production domain, but DO NOT enable "Allow credentials"');
  } catch (err) {
    console.error('❌ Error during deployment preparation:', err);
    debugBuildInfo();
    process.exit(1);
  }
}

// Run the deployment
deploy();
