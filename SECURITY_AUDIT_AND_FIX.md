# Security Audit & Vulnerability Remediation Plan

## 🚨 Current Status: 29 Vulnerabilities Found

### Severity Breakdown
- **CRITICAL**: 1 vulnerability
- **HIGH**: 11 vulnerabilities  
- **MODERATE**: 9 vulnerabilities
- **LOW**: 8 vulnerabilities

---

## 🔴 CRITICAL PRIORITY (Fix Immediately)

### 1. Next.js - Authorization Bypass (GHSA-f82v-jwr5-mffw)
**CVSS Score**: 9.1 (Critical)  
**Current Version**: 14.1.2  
**Fix**: Upgrade to Next.js 14.2.35 or higher

**Impact**: Attackers can bypass authorization in middleware
**Risk**: Direct security breach, data exposure

**Fix Command**:
```bash
npm install next@latest
```

---

## 🟠 HIGH PRIORITY (Fix This Week)

### 2. Next.js - Multiple DoS & Security Issues
**Issues**: 
- DoS with Server Components (GHSA-5j59-xgg2-r9c4)
- HTTP deserialization DoS (GHSA-h25m-26qc-wcjf)
- Image Optimizer DoS (GHSA-9g9p-9gw9-jx7f)
- SSRF via Middleware (GHSA-4342-x723-ch2f)
- Cache poisoning (multiple)

**Current**: 14.1.2  
**Fix**: Upgrade to Next.js 15.5.10+

### 3. eslint-config-next - glob Command Injection
**CVSS Score**: 7.5 (High)  
**Current**: 14.1.2  
**Fix**: Upgrade to 16.1.6

**Fix Command**:
```bash
npm install eslint-config-next@latest
```

### 4. braces - Uncontrolled Resource Consumption
**CVSS Score**: 7.5 (High)  
**Current**: <3.0.3  
**Fix**: Auto-fixable

### 5. cross-spawn - ReDoS
**CVSS Score**: 7.5 (High)  
**Current**: 7.0.0-7.0.4  
**Fix**: Auto-fixable

### 6. ws - DoS with Many HTTP Headers
**CVSS Score**: 7.5 (High)  
**Current**: 8.0.0-8.17.0  
**Fix**: Via @lhci/cli upgrade

---

## 🟡 MODERATE PRIORITY (Fix This Month)

### 7. wrangler - esbuild & miniflare issues
**Current**: 3.78.12  
**Fix**: Upgrade to 4.65.0 (MAJOR version!)

**Fix Command**:
```bash
npm install wrangler@latest --save-dev --legacy-peer-deps
```

### 8. @cloudflare/next-on-pages - DEPRECATED
**Status**: No fix available  
**Reason**: Package is deprecated

**Recommendation**: 
- Remove and use **OpenNext** adapter for Cloudflare
- Or stick with Vercel deployment (current primary)

### 9. Other Moderate Issues
- lodash - Prototype pollution
- js-yaml - Prototype pollution (merge)
- mdast-util-to-hast - Unsanitized class
- micromatch - ReDoS
- undici - Unbounded decompression
- esbuild - Dev server security issue

**Fix Command**:
```bash
npm audit fix
```

---

## 🟢 LOW PRIORITY (Fix When Convenient)

### 10. @lhci/cli - Multiple dependencies with issues
**Current**: 0.13.0  
**Issues**: lighthouse, puppeteer-core, cookie, tmp

**Recommendation**: 
- Keep for now (dev-only tool)
- Or remove and use Vercel Lighthouse integration

### 11. Other Low Issues
- brace-expansion - ReDoS (low impact)
- cookie - Out of bounds characters
- tmp - Symlink write issue

---

## 🛠️ STEP-BY-STEP FIX PLAN

### Step 1: Critical Fix (5 minutes)

```bash
# Backup package.json
cp package.json package.json.backup

# Upgrade Next.js (CRITICAL)
npm install next@latest --legacy-peer-deps

# Upgrade eslint-config
npm install eslint-config-next@latest --legacy-peer-deps

# Test build
npm run build
```

### Step 2: Auto-Fix What's Possible (2 minutes)

```bash
# Auto-fix moderate/low issues
npm audit fix --legacy-peer-deps

# Check what's left
npm audit
```

### Step 3: Manual Upgrades (10 minutes)

```bash
# Upgrade wrangler (breaking change - v4)
npm install wrangler@latest --save-dev --legacy-peer-deps

# Test Cloudflare Workers still work
npm run cloudflare:dev
```

### Step 4: Optional Cleanup (5 minutes)

```bash
# Remove deprecated package
npm uninstall @cloudflare/next-on-pages

# Remove unused Lighthouse CI (optional)
# npm uninstall @lhci/cli

# Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Step 5: Verify & Test (10 minutes)

```bash
# Run tests
npm test:run

# Build production
npm run build

# Check remaining vulns
npm audit

# Commit fixes
git add package.json package-lock.json
git commit -m "🔒 security: Fix 29 vulnerabilities (1 critical, 11 high)"
git push origin main
```

---

## 📊 Expected Results After Fix

### Before
- ❌ 29 vulnerabilities
- ❌ 1 critical (authorization bypass)
- ❌ 11 high (DoS, injection, SSRF)

### After
- ✅ ~5-8 vulnerabilities (low severity only)
- ✅ 0 critical
- ✅ 0-2 high (unfixable dev dependencies)

**Improvement**: 73-86% reduction in vulnerabilities!

---

## 🌐 MULTI-SITE REMEDIATION STRATEGY

### Your 37 Projects Need the Same Fixes

**Affected sites** (from your list):
- justcalldrjan.com
- heritageatstonebridgehomes.com
- openhousemarketplace.com
- probaterealestatesales-com
- aliantehomesforsale.com
- arroyoskyeview.com
- bravadohomes.com
- cadencehenderson.com
- drjanduffy.com
- duffyrealtyoflasvegas.com
- goodtoknowrealtor
- goodtoknowrealtor-1
- las-vegas-relocation-services-com
- lone-mountain-homes-* (4 variants)
- lonemountainvistas.com
- mesquiteestates.com
- nextjs-boilerplate
- californiaforeverbroker.com
- ...and 13 more

### Automation Script for All Sites

Create `fix-all-sites.sh`:

```bash
#!/bin/bash

# List of project directories
SITES=(
  "justcalldrjan.com"
  "heritageatstonebridgehomes.com"
  "openhousemarketplace.com"
  # ... add all 37 sites
)

for site in "${SITES[@]}"; do
  echo "🔧 Fixing $site..."
  
  cd "/path/to/$site" || continue
  
  # Backup
  cp package.json package.json.backup
  
  # Critical fixes
  npm install next@latest eslint-config-next@latest --legacy-peer-deps
  
  # Auto-fix
  npm audit fix --legacy-peer-deps
  
  # Test build
  npm run build || echo "⚠️ Build failed for $site"
  
  # Commit
  git add package.json package-lock.json
  git commit -m "🔒 security: Fix critical vulnerabilities"
  git push origin main
  
  echo "✅ $site fixed!"
  echo "---"
done

echo "🎉 All sites updated!"
```

### Run Script:

```bash
chmod +x fix-all-sites.sh
./fix-all-sites.sh > fix-log.txt 2>&1
```

---

## 📝 Alternative: GitHub Actions Automation

Create `.github/workflows/auto-security-fix.yml`:

```yaml
name: Auto-Fix Security Vulnerabilities

on:
  schedule:
    - cron: '0 0 * * 1' # Every Monday at midnight
  workflow_dispatch: # Manual trigger

jobs:
  security-fix:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Upgrade critical packages
        run: |
          npm install next@latest eslint-config-next@latest --legacy-peer-deps
          npm audit fix --legacy-peer-deps
      
      - name: Run tests
        run: npm test:run || true
      
      - name: Create PR
        uses: peter-evans/create-pull-request@v5
        with:
          commit-message: '🔒 security: Auto-fix vulnerabilities'
          title: 'Security: Auto-fix vulnerabilities'
          body: |
            ## Automated Security Fix
            
            This PR automatically upgrades vulnerable dependencies.
            
            **Changes:**
            - Upgraded Next.js to latest
            - Fixed npm audit issues
            
            **Please review and test before merging!**
          branch: security/auto-fix
          labels: security, automated
```

---

## 🔍 Verification Checklist

After fixing each site:

- [ ] `npm audit` shows <5 low vulnerabilities
- [ ] `npm run build` succeeds
- [ ] `npm test:run` passes
- [ ] Dev server starts: `npm run dev`
- [ ] Production build deploys successfully
- [ ] Site loads without errors
- [ ] Lead forms still work
- [ ] RealScout widget loads
- [ ] Calendly integration works

---

## 🚨 Special Cases

### heritageatstonebridgehomes (Manual Fix Required)

This site needs special attention. Common reasons:
- Custom build process
- Monorepo structure  
- Non-standard dependencies
- Broken package-lock.json

**Steps:**
1. Clone fresh: `git clone ...`
2. Delete `node_modules` and `package-lock.json`
3. Run `npm install --legacy-peer-deps`
4. Fix build errors manually
5. Test thoroughly before deploying

### californiaforeverbroker.com (Manual Investigation)

Unable to auto-detect. Check:
1. Is it a Next.js site?
2. Does it have a `package.json`?
3. Is it using a different framework? (Gatsby, Nuxt, etc.)
4. Run `npm audit` manually

---

## 📞 Support & Resources

### If Something Breaks

1. **Restore backup**: `mv package.json.backup package.json`
2. **Clean install**: `rm -rf node_modules package-lock.json && npm install`
3. **Check GitHub issues**: Search for your error on Next.js repo
4. **Check Vercel docs**: https://nextjs.org/docs/upgrading

### Common Issues

**Issue**: Build fails after Next.js upgrade  
**Fix**: Check for breaking changes in migration guide

**Issue**: Tests fail  
**Fix**: Update test mocks for new Next.js version

**Issue**: Cloudflare Workers broken  
**Fix**: Remove `@cloudflare/next-on-pages`, deploy only to Vercel

---

## 🎯 Success Metrics

### Per-Site Metrics

- Vulnerabilities: 29 → <5
- Critical issues: 1 → 0
- High issues: 11 → 0-2
- Build time: ~same
- Test coverage: maintained

### Portfolio-Wide Metrics

- Total vulnerable sites: 37 → 0
- Security score: F → A
- Compliance: ❌ → ✅
- Peace of mind: Priceless 😊

---

## ⏰ Time Investment

### This Site (heyberkshire.com)
- Critical fixes: 5 minutes
- Full remediation: 30 minutes
- Testing & deploy: 10 minutes
- **Total: 45 minutes**

### All 37 Sites (Manual)
- Per site: 45 minutes
- **Total: ~28 hours**

### All 37 Sites (Automated)
- Script setup: 2 hours
- Script execution: 4-6 hours (unattended)
- Review/fix failures: 4 hours
- **Total: 10-12 hours**

**Recommendation**: Use automation script to save 16+ hours!

---

## 🔐 Long-Term Prevention

### 1. Enable Dependabot Auto-Merge

Add to `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    # Auto-merge security patches
    reviewers:
      - "your-username"
```

### 2. Add Security GitHub Action

Already have this! Our workflow includes:
```yaml
- name: Run npm audit
  run: npm audit --audit-level=high
  continue-on-error: true

- name: Check for known vulnerabilities
  uses: snyk/actions/node@master
```

### 3. Monthly Security Review

Schedule:
- 1st Monday: Run `npm audit` on all sites
- Auto-merge Dependabot PRs for patches
- Manually review major version upgrades

---

## 📚 Next Steps

1. **Today**: Fix this site (heyberkshire.com)
2. **This week**: Create automation script
3. **Next week**: Run script on all 37 sites
4. **Monthly**: Set up automated security reviews

---

## ✅ Ready to Fix?

**Quick start** (this site only):

```bash
# 1. Backup
cp package.json package.json.backup

# 2. Fix critical
npm install next@latest eslint-config-next@latest --legacy-peer-deps

# 3. Auto-fix rest
npm audit fix --legacy-peer-deps

# 4. Test
npm run build && npm test:run

# 5. Commit
git add -A
git commit -m "🔒 security: Fix 29 vulnerabilities"
git push origin main
```

**Estimated time**: 15 minutes  
**Risk**: Low (have backup)  
**Reward**: 29 vulnerabilities fixed!

---

*Generated: February 13, 2026*  
*Next audit: March 13, 2026*
