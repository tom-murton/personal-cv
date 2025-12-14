#!/bin/bash

# Automated deployment script for Namecheap
# Usage: ./deploy-to-namecheap.sh

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Namecheap Deployment Script${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if dist folder exists and has content
if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
  echo -e "${RED}❌ Error: dist folder not found or incomplete!${NC}"
  echo -e "${YELLOW}Building project first...${NC}\n"
  npm run build
  
  if [ ! -f "dist/index.html" ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
  fi
fi

# Ensure .htaccess is in dist
if [ ! -f "dist/.htaccess" ]; then
  echo -e "${YELLOW}📋 Copying .htaccess to dist folder...${NC}"
  cp .htaccess dist/
fi

# Verify dist contents
FILE_COUNT=$(find dist -type f | wc -l | tr -d ' ')
echo -e "${GREEN}✅ Build verified: ${FILE_COUNT} files ready${NC}\n"

# Check if FTP credentials are set
if [ -z "$FTP_HOST" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ]; then
  echo -e "${YELLOW}⚠️  FTP credentials not set in environment variables${NC}"
  echo -e "${BLUE}To use automated FTP deployment, set these environment variables:${NC}"
  echo "  export FTP_HOST='ftp.yourdomain.com'"
  echo "  export FTP_USER='your_username'"
  echo "  export FTP_PASS='your_password'"
  echo -e "\n${YELLOW}For now, here are manual upload instructions:${NC}\n"
  
  # Display manual instructions
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}📤 MANUAL UPLOAD VIA cPANEL:${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
  
  echo -e "${YELLOW}1. Log into Namecheap cPanel:${NC}"
  echo "   • Go to https://cpanel.namecheap.com"
  echo "   • Log in with your Namecheap account credentials"
  
  echo -e "\n${YELLOW}2. Open File Manager:${NC}"
  echo "   • Find and click on 'File Manager' in the Files section"
  echo "   • Navigate to: public_html/"
  
  echo -e "\n${YELLOW}3. Upload files:${NC}"
  echo "   • Click 'Upload' button in the top toolbar"
  echo "   • Select ALL files and folders from the 'dist' directory"
  echo "   • Important files to include:"
  echo "     - index.html"
  echo "     - .htaccess (make sure to show hidden files)"
  echo "     - assets/ folder"
  echo "     - All other files in dist/"
  
  echo -e "\n${YELLOW}4. Set permissions (if needed):${NC}"
  echo "   • Right-click on .htaccess → Change Permissions → 644"
  echo "   • Right-click on folders → Change Permissions → 755"
  echo "   • Right-click on files → Change Permissions → 644"
  
  echo -e "\n${YELLOW}5. Verify deployment:${NC}"
  echo "   • Visit https://tommurton.com to check your site"
  echo "   • Test all routes (/, /instagram, /work) work correctly"
  
  echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
  
  echo -e "${GREEN}✅ Your build is ready in the 'dist' folder${NC}"
  echo -e "${BLUE}📂 Location: $(pwd)/dist${NC}\n"
  
  exit 0
fi

# Automated FTP deployment
echo -e "${YELLOW}🚀 Starting automated FTP deployment...${NC}\n"
echo -e "Host: ${FTP_HOST}"
echo -e "User: ${FTP_USER}"
echo -e "Remote: /public_html\n"

read -p "Deploy to production? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Deployment cancelled.${NC}"
  exit 0
fi

# Deploy using lftp
lftp -c "
set ssl:verify-certificate no
open -u $FTP_USER,$FTP_PASS $FTP_HOST
mirror -R --delete --verbose --exclude-glob .git* dist /public_html
bye
"

if [ $? -eq 0 ]; then
  echo -e "\n${GREEN}✅ Deployment completed successfully!${NC}"
  echo -e "${BLUE}🌐 Your site should be live at: https://tommurton.com${NC}\n"
else
  echo -e "\n${RED}❌ Deployment failed. Please check your FTP credentials.${NC}"
  exit 1
fi



