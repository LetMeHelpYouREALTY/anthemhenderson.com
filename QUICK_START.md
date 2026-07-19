# Quick Start - GitHub & Vercel Optimizations

## ⚡ 5-Minute Setup

### 1. Install Dependencies (1 min)

```bash
npm install --save-dev @lhci/cli webpack-bundle-analyzer
```

### 2. Add GitHub Secrets (2 min)

Go to: **Your Repo → Settings → Secrets and variables → Actions → New repository secret**

Add these 3 secrets:

```
Name: VERCEL_TOKEN
Value: [Get from https://vercel.com/account/tokens]

Name: VERCEL_ORG_ID  
Value: [Run: npx vercel link, then copy from .vercel/project.json]

Name: VERCEL_PROJECT_ID
Value: [Same file as above]
```

### 3. Test Locally (2 min)

```bash
# Test accessibility fixes
npm run dev
# Press Tab to navigate, test Services dropdown with Enter/Escape

# Test performance tools
npm run analyze
```

### 4. Deploy (Push to GitHub)

```bash
git add .
git commit -m "Add GitHub and Vercel optimizations"
git push
```

---

## ✅ What You'll Get

### On Every Pull Request:

1. **Vercel Preview URL** - Test changes before merging
2. **Lighthouse Scores** - Performance, Accessibility, SEO, Best Practices
3. **Bundle Size** - Track JavaScript bundle growth
4. **Automated Checks** - Type check, lint, format, build

### Immediate Improvements:

- ✅ Faster CI builds (caching enabled)
- ✅ Better accessibility (keyboard navigation)
- ✅ Animated content respects user preferences
- ✅ Optimized images (AVIF/WebP)
- ✅ Enhanced security headers
- ✅ Performance monitoring

---

## 🎯 Files Changed

### Created:
- `hooks/useReducedMotion.ts` - Accessibility hook
- `.github/workflows/vercel-preview.yml` - Preview deployments
- `vercel.json` - Vercel config
- `.lighthouserc.json` - Performance budgets

### Modified:
- `components/sections/HeroSection.tsx` - Reduced motion support
- `components/layouts/Navbar.tsx` - Keyboard navigation
- `app/layout.tsx` - Color scheme meta
- `.github/workflows/pr-review.yml` - Added caching
- `next.config.js` - Image optimization
- `package.json` - New scripts

---

## 📊 Quick Commands

```bash
# Performance
npm run analyze          # Bundle size analysis
npm run lighthouse       # Performance audit
npm run perf            # Both

# Development
npm run dev             # Start dev server
npm run build          # Production build
npm run validate       # Check everything

# Vercel
npm run vercel:build   # Build with Vercel CLI
npm run vercel:deploy  # Deploy preview
```

---

## 🔍 Verify It Works

1. **Create a PR** - Workflows will run automatically
2. **Check for comments** - Bot posts preview URL + Lighthouse scores
3. **Click preview URL** - Test your changes live
4. **Review scores** - Aim for 90+ on all Lighthouse metrics

---

## 📖 Full Details

- `OPTIMIZATION_REPORT.md` - Complete audit and findings
- `IMPLEMENTATION_GUIDE.md` - Detailed setup instructions
- `README.md` - Project documentation

---

**That's it!** 🎉

Your site is now optimized for performance, accessibility, and automated testing.
