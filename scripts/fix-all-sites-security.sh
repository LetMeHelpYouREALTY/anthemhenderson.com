#!/bin/bash

# ============================================
# Multi-Site Security Vulnerability Fix Script
# ============================================
# Fixes npm vulnerabilities across all 37 real estate sites
# Run from parent directory containing all projects
# Usage: ./fix-all-sites-security.sh

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Log file
LOG_FILE="security-fix-$(date +%Y%m%d-%H%M%S).log"

echo -e "${BLUE}🔒 Multi-Site Security Fix Script${NC}"
echo -e "${BLUE}======================================${NC}"
echo "Log file: $LOG_FILE"
echo ""

# All your real estate sites
SITES=(
  "heyberkshire.com-2"
  "justcalldrjan.com"
  "heritageatstonebridgehomes.com"
  "openhousemarketplace.com"
  "probaterealestatesales-com"
  "aliantehomesforsale.com"
  "arroyoskyeview.com"
  "bravadohomes.com"
  "cadencehenderson.com"
  "drjanduffy.com"
  "duffyrealtyoflasvegas.com"
  "goodtoknowrealtor"
  "goodtoknowrealtor-1"
  "las-vegas-relocation-services-com"
  "lone-mountain-homes-6mmt"
  "lone-mountain-homes-cohh"
  "lone-mountain-homes-cydw"
  "lone-mountain-homes-fx1b"
  "lonemountainvistas.com"
  "mesquiteestates.com"
  "nextjs-boilerplate"
  "californiaforeverbroker.com"
  # Add remaining 15 sites here
)

# Stats
TOTAL=${#SITES[@]}
SUCCESS=0
FAILED=0
SKIPPED=0

for site in "${SITES[@]}"; do
  echo -e "\n${BLUE}================================================${NC}"
  echo -e "${BLUE}Processing: $site${NC}"
  echo -e "${BLUE}================================================${NC}"
  
  # Check if directory exists
  if [ ! -d "$site" ]; then
    echo -e "${YELLOW}⚠️  Directory not found: $site - SKIPPED${NC}" | tee -a "$LOG_FILE"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi
  
  cd "$site" || continue
  
  # Check if it's a Node.js project
  if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}⚠️  No package.json found - SKIPPED${NC}" | tee -a "$LOG_FILE"
    SKIPPED=$((SKIPPED + 1))
    cd ..
    continue
  fi
  
  echo "📦 Found package.json"
  
  # Backup package.json
  cp package.json package.json.backup
  echo "💾 Created backup: package.json.backup"
  
  # Check current vulnerabilities
  echo "🔍 Auditing vulnerabilities..."
  VULNS_BEFORE=$(npm audit --json 2>/dev/null | grep -o '"total":[0-9]*' | head -1 | grep -o '[0-9]*' || echo "0")
  echo "Found $VULNS_BEFORE vulnerabilities"
  
  # Step 1: Upgrade critical packages
  echo "⬆️  Upgrading Next.js and eslint-config-next..."
  if npm install next@latest eslint-config-next@latest --legacy-peer-deps --silent >> "$LOG_FILE" 2>&1; then
    echo -e "${GREEN}✅ Critical packages upgraded${NC}"
  else
    echo -e "${YELLOW}⚠️  Upgrade had warnings (check log)${NC}"
  fi
  
  # Step 2: Auto-fix remaining issues
  echo "🔧 Running npm audit fix..."
  if npm audit fix --legacy-peer-deps --silent >> "$LOG_FILE" 2>&1; then
    echo -e "${GREEN}✅ Auto-fix completed${NC}"
  else
    echo -e "${YELLOW}⚠️  Some issues remain (check log)${NC}"
  fi
  
  # Step 3: Check final vulnerabilities
  VULNS_AFTER=$(npm audit --json 2>/dev/null | grep -o '"total":[0-9]*' | head -1 | grep -o '[0-9]*' || echo "0")
  echo "📊 Vulnerabilities: $VULNS_BEFORE → $VULNS_AFTER"
  
  # Step 4: Test build
  echo "🏗️  Testing build..."
  if npm run build --silent >> "$LOG_FILE" 2>&1; then
    echo -e "${GREEN}✅ Build successful${NC}"
    
    # Step 5: Commit changes
    if [ -n "$(git status --porcelain)" ]; then
      echo "📝 Committing changes..."
      git add package.json package-lock.json
      git commit -m "🔒 security: Fix $VULNS_BEFORE vulnerabilities (automated fix)" --quiet
      
      # Optionally push (commented out for safety)
      # git push origin main
      
      echo -e "${GREEN}✅ Changes committed (not pushed yet)${NC}"
    else
      echo "ℹ️  No changes to commit"
    fi
    
    SUCCESS=$((SUCCESS + 1))
  else
    echo -e "${RED}❌ Build failed - manual fix required${NC}" | tee -a "$LOG_FILE"
    
    # Restore backup
    mv package.json.backup package.json
    echo "↩️  Restored backup"
    
    FAILED=$((FAILED + 1))
  fi
  
  cd ..
done

# Final summary
echo -e "\n${BLUE}================================================${NC}"
echo -e "${BLUE}SUMMARY${NC}"
echo -e "${BLUE}================================================${NC}"
echo -e "Total sites: $TOTAL"
echo -e "${GREEN}✅ Success: $SUCCESS${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo -e "${YELLOW}⏭️  Skipped: $SKIPPED${NC}"
echo ""
echo "📄 Full log: $LOG_FILE"
echo ""
echo "⚠️  Note: Changes are committed but NOT pushed yet."
echo "Review each site, then push manually or run:"
echo "  for site in */; do (cd \$site && git push origin main); done"
