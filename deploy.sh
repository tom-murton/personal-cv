#!/bin/bash

# --------------------------------------------------------
# Consolidated Portfolio Deployment Script
# This script handles the entire build and deployment process
# Combines functionality from previous scripts:
# - build-and-deploy.sh
# - deploy.sh
# - deploy.bat
# - build-and-deploy.bat
# --------------------------------------------------------

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting portfolio build and deployment process...${NC}"

# --------------------------------------------------------
# STEP 1: CLEAN BUILD
# --------------------------------------------------------

# Clean dist folder if it exists
if [ -d "dist" ]; then
  echo "Cleaning dist folder..."
  rm -rf dist
fi

# --------------------------------------------------------
# STEP 2: UPDATE PACKAGE SCRIPTS (if needed)
# --------------------------------------------------------

# Uncomment this if you need to update package.json before build
# echo "Updating package.json scripts..."
# node update-package.js

# --------------------------------------------------------
# STEP 3: BUILD PROJECT
# --------------------------------------------------------

echo "Building project..."
npm run build || {
  echo -e "${RED}Build failed!${NC}"
  exit 1
}

# --------------------------------------------------------
# STEP 4: VERIFY BUILD
# --------------------------------------------------------

# Check if the build was successful
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
  echo -e "${GREEN}Build successful!${NC}"
  
  # Count files in dist to verify it's not empty
  FILE_COUNT=$(find dist -type f | wc -l)
  echo "Total files in dist folder: $FILE_COUNT"
  
  if [ $FILE_COUNT -lt 10 ]; then
    echo -e "${RED}WARNING: The dist folder contains very few files ($FILE_COUNT).${NC}"
    echo "This might indicate a problem with the build."
    echo "Check the contents of the dist folder before uploading."
    exit 1
  fi
else
  echo -e "${RED}Build failed or dist folder is incomplete!${NC}"
  exit 1
fi

# --------------------------------------------------------
# STEP 5: DEPLOY VIA FTP
# --------------------------------------------------------

echo -e "${YELLOW}Starting FTP deployment...${NC}"

# FTP Connection details
HOST='ftp.tommurton.com'
USER='tommylop'
PASS='!9cmz?f$5B3!ey9iKH'
REMOTE_DIR='/public_html'

# Confirm deployment
read -p "Deploy to production server? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  # Run FTP commands using lftp
  lftp -c "
  open -u $USER,$PASS $HOST
  set ssl:verify-certificate no  # Important for secure connection
  mirror -R --overwrite --verbose dist $REMOTE_DIR
  bye
  "
  
  echo -e "${GREEN}Deployment completed successfully!${NC}"
  echo "Your site should be live at: https://tommurton.com"
else
  echo -e "${YELLOW}Deployment skipped. Your build is ready in the 'dist' folder.${NC}"
  echo "You can manually upload the 'dist' folder to your hosting provider."
fi

# --------------------------------------------------------
# DEPLOYMENT COMPLETE
# --------------------------------------------------------

echo -e "${GREEN}Build and deployment process complete!${NC}"
echo "Thank you for using the consolidated deployment script."

