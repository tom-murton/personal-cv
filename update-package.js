
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  // Read package.json
  const packageJsonPath = path.join(__dirname, 'package.json');
  console.log('Reading package.json from:', packageJsonPath);
  
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  console.log('Successfully read package.json');
  
  const packageJson = JSON.parse(packageJsonContent);
  console.log('Current scripts:', JSON.stringify(packageJson.scripts, null, 2));

  // Add or update scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    "deploy": "node deploy.js",
    "build": "vite build",
    "build:verbose": "vite build --debug",
    "preview-build": "vite build && vite preview"
  };

  console.log('Updated scripts:', JSON.stringify(packageJson.scripts, null, 2));

  // Write updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Successfully updated scripts in package.json');

  // Make shell script executable (on Unix-like systems)
  try {
    if (process.platform !== 'win32') {
      fs.chmodSync('build-and-deploy.sh', '755');
      console.log('Made build-and-deploy.sh executable');
    }
  } catch (err) {
    console.log('Note: Could not set executable permissions on build-and-deploy.sh', err.message);
  }

  console.log('Setup complete! Now you can run "npm run deploy" to prepare your files for deployment.');
} catch (err) {
  console.error('Error updating package.json:', err);
  process.exit(1);
}
