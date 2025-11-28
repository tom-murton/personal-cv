# Portfolio Deployment Guide

This document provides complete instructions for building and deploying your portfolio website.

## Quick Start Deployment

### Automated Deployment

1. Run the consolidated deployment script:
   ```bash
   # Make the script executable (one-time setup)
   chmod +x deploy.sh
   
   # Run the deployment
   ./deploy.sh
   ```

2. The script will:
   - Clean and rebuild your project
   - Verify the build output
   - Upload to your hosting via FTP (requires lftp)

## Manual Deployment Process

If you prefer a step-by-step approach:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Verify the build output**:
   - Check that the `dist` folder contains:
     - index.html
     - assets folder with JS and CSS files
     - All necessary images and resources

3. **Deploy using one of these methods**:

   a. **FTP Upload** (using any FTP client):
   - Connect to your host (ftp.tommurton.com)
   - Upload the contents of the `dist` folder to your website's root directory

   b. **Node-based deployment**:
   ```bash
   node deploy.js
   ```

## Troubleshooting Deployment Issues

### Build Problems

1. **Empty or incomplete dist folder**:
   - Try cleaning node modules:
     ```bash
     rm -rf node_modules
     npm install
     npm run build
     ```

2. **404 Errors on Page Refresh**:
   - Ensure the `.htaccess` file is in your root directory with correct content
   - Check that your hosting has URL rewriting enabled

### Server Configuration

For proper SPA (Single Page Application) routing, your server needs:

1. **Apache** (.htaccess included in build):
   ```apache
   RewriteEngine On
   RewriteBase /
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

2. **Nginx** (if using Nginx):
   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

## Performance Optimization Tips

1. **Verify optimal image sizes** before deployment
2. **Enable compression** on your server
3. **Set up appropriate caching headers**:
   ```apache
   <FilesMatch ".(js|css|jpg|jpeg|png|gif|webp|svg)$">
     Header set Cache-Control "max-age=31536000, public"
   </FilesMatch>
   ```

## Security Considerations

1. **Keep deployment credentials secure**:
   - Never commit FTP credentials to source control
   - Consider using environment variables for sensitive data

2. **Regular updates**:
   - Keep dependencies updated with `npm update` or `npm audit fix`

## Final Check

Before considering deployment complete:

1. **Test all site functionality**
2. **Check mobile responsiveness**
3. **Validate links**
4. **Test performance** with Lighthouse or similar tools
