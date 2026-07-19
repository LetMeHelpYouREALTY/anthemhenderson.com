# GitHub & Vercel Optimization Report

Generated: 2026-02-13
Based on: Vercel Next.js Best Practices & Web Interface Guidelines

---

## 🚨 Critical Issues

### UI Component Issues (Web Interface Guidelines)

#### components/sections/HeroSection.tsx

**Line 18** - Animation missing `prefers-reduced-motion` check
- Automatic image slideshow runs regardless of user preference
- **Fix**: Check `prefers-reduced-motion` and disable animation if requested

```tsx
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

useEffect(() => {
  if (prefersReducedMotion) return; // Don't animate if user prefers reduced motion
  
  const intervalId = setInterval(() => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  }, 5000);
  return () => clearInterval(intervalId);
}, [prefersReducedMotion]);
```

**Line 28** - `transition-opacity` not explicitly listed
- Uses `transition-all` pattern which is discouraged
- **Fix**: Use `transition-opacity duration-1000` explicitly

**Line 83** - Animation without reduced motion check
- Scroll indicator uses `animate-bounce` without accessibility consideration
- **Fix**: Add conditional class based on `prefers-reduced-motion`

#### components/layouts/Navbar.tsx

**Line 82-89** - Dropdown button missing keyboard handlers
- Button has `onClick` but no `onKeyDown` for Enter/Space keys
- **Fix**: Add keyboard support

```tsx
<button
  className="..."
  onClick={() => setIsServicesOpen(!isServicesOpen)}
  onMouseEnter={() => setIsServicesOpen(true)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsServicesOpen(!isServicesOpen);
    }
  }}
  aria-expanded={isServicesOpen}
  aria-haspopup="true"
>
  Services
  <ChevronDown className="h-4 w-4 ml-1" aria-hidden="true" />
</button>
```

**Line 92-107** - Dropdown menu needs ARIA roles
- Missing proper ARIA labeling for accessibility
- **Fix**: Add `role="menu"` and `role="menuitem"` attributes

**Line 127** - Icon-only button has aria-label ✅ (GOOD)
- Line 129: Toggle menu button has proper aria-label

#### components/ui/button.tsx

✓ Pass - Good focus states with `focus-visible:ring-2`

#### components/ui/input.tsx

⚠️ Missing `autocomplete` attributes
- Inputs should specify autocomplete for better UX
- **Fix**: Add autocomplete prop support and encourage usage

#### app/layout.tsx

✓ Pass - Proper semantic HTML structure
✓ Pass - Script loading strategies are appropriate
⚠️ Line 80: Missing `color-scheme` meta tag for dark mode support

**Fix**:
```tsx
<html lang="en" className="scroll-smooth antialiased" style={{ colorScheme: 'light' }}>
```

---

## 📦 Next.js Version Upgrade

### Current: Next.js 14.1.2 → Recommended: Next.js 15.x

**Benefits:**
- Async params and searchParams (better SSR performance)
- Async cookies() and headers()
- Improved caching strategies
- Better TypeScript support
- Turbopack stable (faster builds)

**Migration Steps:**

1. **Update dependencies**:
```bash
npm install next@latest react@latest react-dom@latest
npm install -D @types/react@latest @types/react-dom@latest
```

2. **Run async codemod**:
```bash
npx @next/codemod@latest next-async-request-api .
```

3. **Update all page components** to use async params:

```tsx
// Before (Next.js 14)
export default function Page({ params }: { params: { slug: string } }) {
  return <div>{params.slug}</div>
}

// After (Next.js 15)
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <div>{slug}</div>
}
```

4. **Update metadata generation**:
```tsx
// Before
export async function generateMetadata({ params }) {
  return { title: params.slug }
}

// After
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return { title: slug }
}
```

5. **Test thoroughly** - Run full test suite after migration

---

## ⚡ GitHub Workflows Optimization

### Current Issues:

1. **No caching** - Dependencies installed fresh every run (slow)
2. **Sequential jobs** - Some jobs could run in parallel
3. **No job outputs** - Rebuilding same artifacts multiple times
4. **Missing Vercel CLI** - Building with npm instead of Vercel

### Optimized Workflow:

Create `.github/workflows/vercel-preview.yml`:

```yaml
name: Vercel Preview Deployment

on:
  pull_request:
    branches: [main, develop]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

concurrency:
  group: ${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true

jobs:
  deploy-preview:
    name: Deploy to Vercel Preview
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Vercel CLI
        run: npm install -g vercel@latest

      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project Artifacts
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Vercel
        id: deploy
        run: |
          url=$(vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }})
          echo "url=$url" >> $GITHUB_OUTPUT

      - name: Comment PR with Preview URL
        uses: actions/github-script@v7
        with:
          script: |
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: `## 🚀 Preview Deployment Ready!\n\n✅ Preview URL: ${{ steps.deploy.outputs.url }}\n\n---\n*Deployed with Vercel*`
            });

  lighthouse:
    name: Lighthouse Performance Audit
    runs-on: ubuntu-latest
    needs: deploy-preview
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            ${{ needs.deploy-preview.outputs.url }}
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### Optimize Existing PR Review Workflow:

Update `.github/workflows/pr-review.yml`:

```yaml
# Add to build job
- name: Cache Next.js build
  uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      ${{ github.workspace }}/.next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx') }}
    restore-keys: |
      ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-
```

---

## 🔧 Vercel Configuration Optimizations

### Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "installCommand": "npm ci",
  "devCommand": "npm run dev",
  "outputDirectory": ".next",
  "regions": ["iad1"],
  "functions": {
    "app/**/*.tsx": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-DNS-Prefetch-Control",
          "value": "on"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/home",
      "destination": "/",
      "permanent": true
    }
  ],
  "crons": []
}
```

### Update `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Turbopack for faster dev builds (Next.js 15)
  experimental: {
    turbo: {
      // Turbopack configuration
    },
  },

  // Standalone output for Docker/Vercel optimization
  output: 'standalone',

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compression
  compress: true,

  // Performance optimizations
  swcMinify: true,
  
  // Existing redirects
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'heyberkshire.com',
          },
        ],
        destination: 'https://www.heyberkshire.com/:path*',
        permanent: true,
      },
    ]
  },

  // Existing rewrites (Python API)
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:5328/api/:path*'
            : '/api/',
      },
    ]
  },

  // Enhanced security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // CSP for RealScout widget (existing)
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://em.realscout.com https://www.realscout.com https://assets.calendly.com https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://em.realscout.com https://www.realscout.com https://assets.calendly.com",
              "img-src 'self' data: blob: https: http:",
              "font-src 'self' data: https://assets.calendly.com",
              "connect-src 'self' https://em.realscout.com https://www.realscout.com https://openrouter.ai https://api.openai.com https://calendly.com https://www.google-analytics.com https://analytics.google.com",
              "frame-src 'self' https://em.realscout.com https://www.realscout.com https://calendly.com https://assets.calendly.com https://www.google.com https://maps.google.com https://*.google.com",
              "worker-src 'self' blob:",
            ].join('; '),
          },
          // Additional security headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ]
  },

  // Bundle analyzer (when ANALYZE=true)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: './analyze.html',
            openAnalyzer: false,
          })
        )
      }
      return config
    },
  }),
}

module.exports = nextConfig
```

---

## 📊 Performance Monitoring

### Add Bundle Analysis Script:

Update `package.json`:

```json
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build",
    "lighthouse": "lighthouse https://heyberkshire.com --view",
    "perf": "npm run analyze && npm run lighthouse"
  },
  "devDependencies": {
    "webpack-bundle-analyzer": "^4.10.1",
    "lighthouse": "^11.6.0"
  }
}
```

### Add Performance Budget:

Create `.lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.95 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

---

## 🎯 Deployment Checklist

### Pre-Deployment:

- [ ] Run `npm run type-check` (no errors)
- [ ] Run `npm run lint` (no errors)
- [ ] Run `npm run format:check` (all files formatted)
- [ ] Run `npm run build` locally (successful)
- [ ] Test all pages load correctly
- [ ] Test RealScout widget loads
- [ ] Test Calendly widget loads
- [ ] Test AI chat widget
- [ ] Verify phone numbers: (702) 500-1942
- [ ] Check all images have alt text
- [ ] Verify metadata on all pages
- [ ] Test mobile responsiveness
- [ ] Run Lighthouse audit (90+ scores)

### Vercel Setup:

1. **Environment Variables** (required):
   - `OPENROUTER_API_KEY`
   - `NEXT_PUBLIC_REALSCOUT_AGENT_ID`
   - `VERCEL_TOKEN` (for GitHub Actions)
   - `VERCEL_ORG_ID` (for GitHub Actions)
   - `VERCEL_PROJECT_ID` (for GitHub Actions)

2. **Build Settings**:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm ci`
   - Node Version: 20.x

3. **Domain Configuration**:
   - Primary: www.heyberkshire.com
   - Redirect: heyberkshire.com → www.heyberkshire.com

4. **Function Configuration**:
   - Region: Washington, D.C., USA (iad1) - closest to target audience
   - Max Duration: 10s

---

## 🚀 Quick Wins (Implement Today)

### Priority 1 - Accessibility Fixes:

1. **Add reduced motion support to HeroSection**:
```tsx
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
```

2. **Add keyboard handlers to Navbar dropdown**:
```tsx
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    setIsServicesOpen(!isServicesOpen);
  }
}}
```

3. **Add ARIA attributes to dropdown menu**:
```tsx
<button aria-expanded={isServicesOpen} aria-haspopup="true">
```

### Priority 2 - Performance:

1. **Add webpack-bundle-analyzer**:
```bash
npm install -D webpack-bundle-analyzer
```

2. **Enable Next.js build cache in GitHub Actions**

3. **Add Vercel deployment preview to PRs**

### Priority 3 - Monitoring:

1. **Install Lighthouse CI**
2. **Set up performance budgets**
3. **Add bundle size tracking**

---

## 📝 Additional Resources

- [Next.js 15 Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading)
- [Vercel Build Configuration](https://vercel.com/docs/projects/project-configuration)
- [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines)
- [GitHub Actions Caching](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)

---

## 🎬 Implementation Order

1. ✅ Fix accessibility issues (HeroSection, Navbar)
2. ✅ Add GitHub Actions caching
3. ✅ Create Vercel preview deployment workflow
4. ✅ Upgrade to Next.js 15
5. ✅ Add performance monitoring
6. ✅ Optimize next.config.js
7. ✅ Create vercel.json
8. ✅ Add bundle analysis

---

*Generated by Vercel Next.js Best Practices & Web Interface Guidelines Skills*
